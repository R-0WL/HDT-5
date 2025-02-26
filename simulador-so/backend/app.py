"""
Módulo de API para el Simulador de Sistema Operativo.

Este módulo implementa la API REST utilizando FastAPI que permite
la comunicación entre el frontend y el backend de simulación.

Autor: Rene
"""

from fastapi import FastAPI, File, UploadFile, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import uvicorn
import os
import numpy as np
import matplotlib.pyplot as plt
import matplotlib
matplotlib.use('Agg')  # Usar backend no interactivo para matplotlib
import json
from typing import Dict, List, Optional

# Importar las funciones de simulación
from simulation import run_experiment, run_all_experiments

# Crear directorio para gráficas si no existe
os.makedirs("graficas", exist_ok=True)

app = FastAPI(title="Simulador de Sistema Operativo")

# Configurar CORS para permitir solicitudes desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permitir todos los orígenes en desarrollo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Montar el directorio de gráficas como estático
app.mount("/graficas", StaticFiles(directory="graficas"), name="graficas")

"""
Variable global para almacenar los resultados del último experimento.
Esto permite acceder a las estadísticas más recientes sin tener que volver a ejecutar la simulación.

Responsabilidad de Rene: Implementar el almacenamiento y recuperación de resultados recientes.
"""
latest_results = None

"""
Variable global para almacenar los resultados de todos los experimentos.
Esto evita tener que volver a ejecutar todos los experimentos cada vez que se solicitan gráficas.

Responsabilidad de Rene: Implementar el almacenamiento y recuperación de los resultados de todos los experimentos.
"""
all_experiments_results = None

@app.post("/api/simulate")
async def simulate(params: dict):
    """
    Endpoint para ejecutar una simulación con parámetros específicos.
    
    Esta función recibe parámetros desde el frontend, ejecuta una simulación
    con esos parámetros, y devuelve los resultados.
    
    Args:
        params (dict): Diccionario con los parámetros de simulación:
                      - numProcesses: Número de procesos
                      - arrivalInterval: Intervalo de llegada
                      - ramMemory: Cantidad de memoria RAM
                      - instructionsPerUnit: Instrucciones por unidad de tiempo
                      - numCpus: Número de CPUs
                      - includeTimeSeries: Si incluir datos de series temporales
    
    Returns:
        dict: Resultados de la simulación, incluyendo estadísticas y datos de procesos
        
    Raises:
        HTTPException: Si ocurre un error durante la simulación
        
    Responsabilidad de Rene: Implementar este endpoint para ejecutar simulaciones
    individuales con los parámetros proporcionados.
    """
    try:
        global latest_results
        
        # Extraer parámetros de la solicitud
        num_processes = params.get("numProcesses", 50)
        arrival_interval = params.get("arrivalInterval", 10)
        ram_memory = params.get("ramMemory", 100)
        instructions_per_unit = params.get("instructionsPerUnit", 3)
        num_cpus = params.get("numCpus", 1)
        include_time_series = params.get("includeTimeSeries", False)
        
        # Ejecutar simulación
        result = run_experiment(
            num_processes=num_processes,
            arrival_interval=arrival_interval,
            ram_memory=ram_memory,
            instructions_per_unit=instructions_per_unit,
            num_cpus=num_cpus,
            include_time_series=include_time_series
        )
        
        # Guardar resultados para uso posterior
        latest_results = result
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/experiments")
async def experiments(background_tasks: BackgroundTasks):
    """
    Endpoint para ejecutar todos los experimentos definidos.
    
    Esta función ejecuta todas las combinaciones de experimentos y genera
    las gráficas correspondientes. Debido a que puede tomar tiempo, se ejecuta
    en segundo plano.
    
    Args:
        background_tasks (BackgroundTasks): Tareas en segundo plano de FastAPI
    
    Returns:
        dict: Mensaje indicando que los experimentos están siendo ejecutados
        
    Raises:
        HTTPException: Si ocurre un error durante la ejecución
        
    Responsabilidad de Rene: Implementar este endpoint para ejecutar todos los
    experimentos especificados y generar las gráficas correspondientes.
    """
    try:
        global all_experiments_results
        
        # Ejecutar todos los experimentos (puede tomar tiempo)
        all_experiments_results = run_all_experiments()
        
        # Generar gráficas en segundo plano para no bloquear la respuesta
        background_tasks.add_task(generate_graphs, all_experiments_results)
        
        return {"message": "Experimentos completados. Gráficas generadas."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/graph-data/intervals")
async def get_interval_data():
    """
    Endpoint para obtener datos de la gráfica de intervalos.
    
    Esta función devuelve los datos necesarios para generar la gráfica
    de tiempos promedio por número de procesos y tasa de llegada.
    
    Returns:
        dict: Datos para la gráfica en formato JSON con series y puntos
              conteniendo el valor Y y la desviación estándar
    
    Raises:
        HTTPException: Si ocurre un error durante la generación de datos
        
    Responsabilidad de Rene: Implementar este endpoint para proporcionar datos
    correctamente estructurados para la gráfica de intervalos, incluyendo
    la desviación estándar para barras de error.
    """
    try:
        global all_experiments_results
        
        # Si no tenemos resultados, ejecutar los experimentos
        if all_experiments_results is None:
            all_experiments_results = run_all_experiments()
        
        # Preparar datos para la gráfica
        intervals = [10, 5, 1]
        data = []
        
        for interval in intervals:
            interval_data = all_experiments_results[f"interval_{interval}"]
            series = {
                "name": f"Intervalo {interval}",
                "data": [
                    {
                        "x": item["numProcesses"], 
                        "y": item["averageTime"],
                        "std": item["standardDeviation"]  # Incluir desviación estándar
                    }
                    for item in interval_data
                ]
            }
            data.append(series)
        
        return {"series": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/graph-data/strategies")
async def get_strategies_data():
    """
    Endpoint para obtener datos de la gráfica de estrategias.
    
    Esta función devuelve los datos necesarios para generar la gráfica
    de comparación de diferentes estrategias para optimizar el rendimiento.
    
    Returns:
        dict: Datos para la gráfica en formato JSON con series y puntos
              conteniendo el valor Y y la desviación estándar
    
    Raises:
        HTTPException: Si ocurre un error durante la generación de datos
        
    Responsabilidad de Rene: Implementar este endpoint para proporcionar datos
    correctamente estructurados para la gráfica de estrategias, incluyendo
    la desviación estándar para barras de error.
    """
    try:
        global all_experiments_results
        
        # Si no tenemos resultados, ejecutar los experimentos
        if all_experiments_results is None:
            all_experiments_results = run_all_experiments()
        
        # Estrategias a comparar
        strategies = [
            {"key": "interval_10", "name": "Normal (RAM=100, CPU=3, CPUs=1)"},
            {"key": "ram_200", "name": "RAM=200"},
            {"key": "fast_cpu", "name": "CPU Rápido (6 inst)"},
            {"key": "dual_cpu", "name": "2 CPUs"}
        ]
        
        data = []
        
        for strategy in strategies:
            strategy_data = all_experiments_results[strategy["key"]]
            series = {
                "name": strategy["name"],
                "data": [
                    {
                        "x": item["numProcesses"], 
                        "y": item["averageTime"],
                        "std": item["standardDeviation"]  # Incluir desviación estándar
                    }
                    for item in strategy_data
                ]
            }
            data.append(series)
        
        return {"series": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/latest-stats")
async def get_latest_stats():
    """
    Endpoint para obtener las estadísticas de la última simulación ejecutada.
    
    Esta función devuelve las estadísticas básicas (tiempo promedio, desviación
    estándar, procesos completados) de la simulación más reciente.
    
    Returns:
        dict: Estadísticas de la última simulación
    
    Raises:
        HTTPException: Si ocurre un error durante la obtención de estadísticas
        
    Responsabilidad de Rene: Implementar este endpoint para proporcionar
    estadísticas actualizadas de la última simulación ejecutada.
    """
    try:
        global latest_results
        
        # Si no hay resultados previos, usar valores por defecto
        if latest_results is None:
            return {
                "averageTime": 0,
                "standardDeviation": 0,
                "processesCompleted": 0,
                "totalProcesses": 0
            }
        
        # Devolver estadísticas de la última simulación
        return {
            "averageTime": latest_results["averageTime"],
            "standardDeviation": latest_results["standardDeviation"],
            "processesCompleted": len([p for p in latest_results["processes"] if p["state"] == "terminated"]),
            "totalProcesses": len(latest_results["processes"])
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def generate_graphs(results: Dict):
    """
    Función para generar gráficas a partir de los resultados de experimentos.
    
    Args:
        results (Dict): Resultados de todos los experimentos
        
    Returns:
        List[str]: Lista con los nombres de las gráficas generadas
        
    Responsabilidad de Rene: Implementar esta función para generar gráficas
    visualmente atractivas y claramente etiquetadas para mostrar los resultados
    de los experimentos.
    """
    # Graficar tiempos promedio por intervalo
    plt.figure(figsize=(10, 6))
    markers = ['o', 's', 'D']
    colors = ['b', 'g', 'r']
    intervals = [10, 5, 1]
    
    for i, interval in enumerate(intervals):
        data = results[f"interval_{interval}"]
        x = [item["numProcesses"] for item in data]
        y = [item["averageTime"] for item in data]
        
        # Graficar línea principal
        plt.plot(x, y, marker=markers[i], color=colors[i], label=f"Intervalo {interval}")
        
        # Añadir barras de error para desviación estándar
        if "standardDeviation" in data[0]:
            yerr = [item["standardDeviation"] for item in data]
            plt.errorbar(x, y, yerr=yerr, fmt='none', ecolor=colors[i], alpha=0.5)
    
    plt.xlabel('Número de Procesos')
    plt.ylabel('Tiempo Promedio')
    plt.title('Tiempo Promedio por Número de Procesos y Tasa de Llegada')
    plt.legend()
    plt.grid(True)
    plt.savefig('graficas/grafica_intervalos.png')
    plt.close()
    
    # Graficar comparación de estrategias
    plt.figure(figsize=(10, 6))
    
    # Datos de referencia (intervalo = 10)
    ref_data = results["interval_10"]
    x = [item["numProcesses"] for item in ref_data]
    y_ref = [item["averageTime"] for item in ref_data]
    
    # Datos para RAM = 200
    ram_data = results["ram_200"]
    y_ram = [item["averageTime"] for item in ram_data]
    
    # Datos para CPU rápido
    fast_data = results["fast_cpu"]
    y_fast = [item["averageTime"] for item in fast_data]
    
    # Datos para 2 CPUs
    dual_data = results["dual_cpu"]
    y_dual = [item["averageTime"] for item in dual_data]
    
    # Graficar líneas principales
    plt.plot(x, y_ref, marker='o', color='b', label='Normal (RAM=100, CPU=3, CPUs=1)')
    plt.plot(x, y_ram, marker='s', color='g', label='RAM=200')
    plt.plot(x, y_fast, marker='D', color='r', label='CPU Rápido (6 inst)')
    plt.plot(x, y_dual, marker='^', color='purple', label='2 CPUs')
    
    # Añadir barras de error para desviación estándar
    if "standardDeviation" in ref_data[0]:
        plt.errorbar(x, y_ref, yerr=[item["standardDeviation"] for item in ref_data], fmt='none', ecolor='b', alpha=0.5)
        plt.errorbar(x, y_ram, yerr=[item["standardDeviation"] for item in ram_data], fmt='none', ecolor='g', alpha=0.5)
        plt.errorbar(x, y_fast, yerr=[item["standardDeviation"] for item in fast_data], fmt='none', ecolor='r', alpha=0.5)
        plt.errorbar(x, y_dual, yerr=[item["standardDeviation"] for item in dual_data], fmt='none', ecolor='purple', alpha=0.5)
    
    plt.xlabel('Número de Procesos')
    plt.ylabel('Tiempo Promedio')
    plt.title('Comparación de Estrategias')
    plt.legend()
    plt.grid(True)
    plt.savefig('graficas/grafica_estrategias.png')
    plt.close()
    
    return ["grafica_intervalos.png", "grafica_estrategias.png"]

@app.get("/{full_path:path}")
async def serve_frontend(full_path: str):
    """
    Ruta para servir archivos estáticos del frontend.
    
    Esta función intenta servir archivos estáticos del frontend compilado.
    Si el archivo no existe, devuelve el index.html para rutas de React.
    
    Args:
        full_path (str): Ruta solicitada
        
    Returns:
        FileResponse: Archivo solicitado o index.html
        
    Note:
        Esta funcionalidad se usa principalmente en producción cuando el frontend
        está compilado y se sirve desde el mismo servidor que el backend.
        
    Responsabilidad de Rene: Implementar este endpoint para servir archivos estáticos,
    pero puede ser desactivado durante el desarrollo si el frontend se ejecuta
    en un servidor separado.
    """
    # Si la ruta está vacía, servir index.html
    if not full_path or full_path == "/":
        return FileResponse("../frontend/build/index.html")
    
    # Intentar servir el archivo estático
    file_path = f"../frontend/build/{full_path}"
    if os.path.exists(file_path) and os.path.isfile(file_path):
        return FileResponse(file_path)
    
    # Si el archivo no existe, servir index.html para manejar rutas de React
    return FileResponse("../frontend/build/index.html")


# esto la verdad es solo para probar, pero no me gusta el if name == main pero era la opcion mas viable.
if __name__ == "__main__":
    # Ejecutar servidor con uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
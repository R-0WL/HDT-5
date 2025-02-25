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

# Función para generar gráficas de los resultados
def generate_graphs(results: Dict):
    # Graficar tiempos promedio por intervalo
    plt.figure(figsize=(10, 6))
    markers = ['o', 's', 'D']
    colors = ['b', 'g', 'r']
    intervals = [10, 5, 1]
    
    for i, interval in enumerate(intervals):
        data = results[f"interval_{interval}"]
        x = [item["numProcesses"] for item in data]
        y = [item["averageTime"] for item in data]
        plt.plot(x, y, marker=markers[i], color=colors[i], label=f"Intervalo {interval}")
    
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
    
    plt.plot(x, y_ref, marker='o', color='b', label='Normal (RAM=100, CPU=3, CPUs=1)')
    plt.plot(x, y_ram, marker='s', color='g', label='RAM=200')
    plt.plot(x, y_fast, marker='D', color='r', label='CPU Rápido (6 inst)')
    plt.plot(x, y_dual, marker='^', color='purple', label='2 CPUs')
    
    plt.xlabel('Número de Procesos')
    plt.ylabel('Tiempo Promedio')
    plt.title('Comparación de Estrategias')
    plt.legend()
    plt.grid(True)
    plt.savefig('graficas/grafica_estrategias.png')
    plt.close()
    
    return ["grafica_intervalos.png", "grafica_estrategias.png"]

# Endpoint para ejecutar una simulación
@app.post("/api/simulate")
async def simulate(params: dict):
    try:
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
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Endpoint para ejecutar todos los experimentos
@app.get("/api/experiments")
async def experiments(background_tasks: BackgroundTasks):
    try:
        # Ejecutar todos los experimentos (puede tomar tiempo)
        results = run_all_experiments()
        
        # Generar gráficas en segundo plano
        background_tasks.add_task(generate_graphs, results)
        
        return {"message": "Experimentos completados. Gráficas generadas."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Endpoint para obtener las URLs de las gráficas
@app.get("/api/graphs")
async def get_graphs():
    try:
        graph_files = os.listdir("graficas")
        graph_urls = [f"/graficas/{file}" for file in graph_files if file.endswith('.png')]
        return {"graphs": graph_urls}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Ruta para servir archivos estáticos del frontend
@app.get("/{full_path:path}")
async def serve_frontend(full_path: str):
    # Si la ruta está vacía, servir index.html
    if not full_path or full_path == "/":
        return FileResponse("../frontend/build/index.html")
    
    # Intentar servir el archivo estático
    file_path = f"../frontend/build/{full_path}"
    if os.path.exists(file_path) and os.path.isfile(file_path):
        return FileResponse(file_path)
    
    # Si el archivo no existe, servir index.html para manejar rutas de React
    return FileResponse("../frontend/build/index.html")

if __name__ == "__main__":
    # Ejecutar servidor con uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
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
        
        return {"message": "Experimentos completados."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Endpoint para obtener datos para la gráfica de intervalos
@app.get("/api/graph-data/intervals")
async def get_interval_data():
    try:
        # Ejecutamos los experimentos o cargamos datos guardados
        results = run_all_experiments()
        
        intervals = [10, 5, 1]
        data = []
        
        for interval in intervals:
            interval_data = results[f"interval_{interval}"]
            series = {
                "name": f"Intervalo {interval}",
                "data": [
                    {
                        "x": item["numProcesses"], 
                        "y": item["averageTime"],
                        "std": item["standardDeviation"]  # Incluimos desviación estándar
                    }
                    for item in interval_data
                ]
            }
            data.append(series)
        
        return {"series": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Endpoint para obtener datos para la gráfica de estrategias
@app.get("/api/graph-data/strategies")
async def get_strategies_data():
    try:
        # Ejecutamos los experimentos o cargamos datos guardados
        results = run_all_experiments()
        
        # Datos de referencia y estrategias
        strategies = [
            {"key": "interval_10", "name": "Normal (RAM=100, CPU=3, CPUs=1)"},
            {"key": "ram_200", "name": "RAM=200"},
            {"key": "fast_cpu", "name": "CPU Rápido (6 inst)"},
            {"key": "dual_cpu", "name": "2 CPUs"}
        ]
        
        data = []
        
        for strategy in strategies:
            strategy_data = results[strategy["key"]]
            series = {
                "name": strategy["name"],
                "data": [
                    {
                        "x": item["numProcesses"], 
                        "y": item["averageTime"],
                        "std": item["standardDeviation"]  # Incluimos desviación estándar
                    }
                    for item in strategy_data
                ]
            }
            data.append(series)
        
        return {"series": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Endpoint para obtener las últimas estadísticas
@app.get("/api/latest-stats")
async def get_latest_stats():
    try:
        # Podemos devolver las estadísticas del último experimento
        # o usar algún resultado guardado
        
        # Esta parte dependerá de cómo almacenes los resultados
        # Por ahora usamos valores de ejemplo
        return {
            "averageTime": 4.56,
            "standardDeviation": 3.20,
            "processesCompleted": 150,
            "totalProcesses": 150
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    # Ejecutar servidor con uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
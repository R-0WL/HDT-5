# Simulador de Sistema Operativo

## Integrantes
- Jose
- Rene
- Fatima

## Descripción
Este proyecto implementa un simulador de sistema operativo que modela el ciclo de vida de procesos, gestión de memoria RAM y planificación de CPU utilizando SimPy para la simulación de eventos discretos.

## Estado del Proyecto

### Completado:
- Estructura del proyecto
- Frontend en React con interfaz gráfica completa
- Configuración inicial del proyecto

### Pendiente:
- **Backend completo**:
  - Implementar `simulation.py` con SimPy
  - Implementar `app.py` con FastAPI
  - Crear endpoints para la API
  - Generar gráficas con Matplotlib

## Tareas Asignadas

### Jose:
- Implementar la simulación con SimPy en `simulation.py`
- Configurar los recursos (Container para RAM, Resource para CPU)
- Implementar el ciclo de vida de los procesos

### Rene:
- Desarrollar la API con FastAPI en `app.py`
- Crear endpoints para ejecutar simulaciones
- Implementar la generación de gráficas con Matplotlib

### Fatima:
- Integración frontend-backend
- Pruebas de funcionamiento completo
- Documentación y análisis de resultados

## Cómo ejecutar el proyecto

1. Clonar el repositorio
2. Instalar dependencias:
   ```
   # Backend
   cd backend
   pip install -r requirements.txt
   
   # Frontend
   cd frontend
   npm install
   ```
3. Ejecutar el script de inicio:
   ```
   ./start.sh
   ```

## Estructura del Proyecto
```
simulador-so/
├── backend/
│   ├── app.py                # API FastAPI (PENDIENTE)
│   ├── simulation.py         # Simulación con SimPy (PENDIENTE)
│   ├── requirements.txt      # Dependencias Python
│   └── graficas/             # Carpeta para gráficas generadas
├── frontend/
│   ├── public/               # Archivos públicos
│   ├── src/                  # Código fuente React
│   └── package.json          # Dependencias NPM
└── start.sh                  # Script de inicio
```

## Recursos
- [Documentación de SimPy](https://simpy.readthedocs.io/)
- [Guía de FastAPI](https://fastapi.tiangolo.com/)
- [Tutorial de Matplotlib](https://matplotlib.org/stable/tutorials/index.html)

## Objetivo Final
Implementar un simulador que permita analizar diferentes estrategias de gestión de recursos en un sistema operativo y determinar cuál ofrece mejor rendimiento en términos de tiempo de ejecución de procesos.

# Simulador de Sistema Operativo

Este proyecto implementa un simulador de sistema operativo que modela el ciclo de vida de procesos, gestión de memoria RAM y planificación de CPU utilizando SimPy para la simulación de eventos discretos.

![image](https://github.com/user-attachments/assets/439342a1-2274-4dfe-8f88-2c9f29089ccc)


## Integrantes del Grupo
- Fatima Navarro: Frontend y Visualización
- Rene: Backend (API y Generación de Gráficas)
- José: Backend (Simulación con SimPy)

## Distribución de Responsabilidades

### Fatima (Frontend y Visualización)
- Implementar la interfaz gráfica con React y Tailwind CSS
- Desarrollar componentes para la visualización de resultados
- Crear gráficas interactivas utilizando Chart.js
- Manejar la comunicación con el backend a través de la API

### Rene (Backend - API y Generación de Gráficas)
- Implementar los endpoints de API en `app.py` usando FastAPI
- Crear los endpoints específicos para la generación de gráficas:
  - `/api/graph-data/intervals`: Para datos de intervalos de tiempo
  - `/api/graph-data/strategies`: Para comparación de estrategias
- Procesar los datos de simulación para su visualización
- Generar respuestas JSON estructuradas para las gráficas

### José (Backend - Simulación con SimPy)
- Implementar la lógica de simulación en `simulation.py`
- Crear la clase `Process` para representar procesos del SO
- Implementar `OSSimulation` para manejar el ciclo de vida de procesos
- Configurar los recursos de SimPy:
  - `Container` para memoria RAM
  - `Resource` para CPU(s)
- Desarrollar las funciones `run_experiment()` y `run_all_experiments()`

## Estructura del Proyecto

simulador-so/
├── backend/
│   ├── app.py                # API (Rene)
│   ├── simulation.py         # Simulación (José)
│   ├── requirements.txt      # Dependencias de Python
│   └── graficas/             # Carpeta para almacenar gráficas
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── simulationApi.js
│   │   ├── components/
│   │   │   ├── App.jsx
│   │   │   ├── layout/
│   │   │   ├── simulation/
│   │   │   ├── results/
│   │   │   │   ├── Graph.jsx
│   │   │   │   ├── IntervalGraph.jsx
│   │   │   │   ├── StrategiesGraph.jsx
│   │   │   │   └── Results.jsx
│   │   │   └── settings/
│   │   ├── styles/
│   │   └── index.js
│   ├── package.json
│   └── tailwind.config.js
├── start.sh                  # Script para iniciar el proyecto (Linux/Mac)
└── start.bat                 # Script para iniciar el proyecto (Windows)


## Instrucciones para Cada Integrante

### Fatima (Frontend)
1. Implementa los componentes de React en la carpeta `frontend/src/components/`
2. Instala las dependencias necesarias: `npm install chart.js react-chartjs-2`
3. Utiliza el archivo `simulationApi.js` para comunicarte con el backend
4. Prueba tus componentes individualmente antes de integrarlos

### Rene (Backend - API)
1. Implementa los endpoints en `app.py` utilizando FastAPI
2. Asegúrate de configurar CORS correctamente para permitir peticiones desde el frontend
3. Para los endpoints de gráficas, debes devolver datos en formato JSON con la siguiente estructura:
   ```json
   {
     "series": [
       {
         "name": "Nombre de la serie",
         "data": [
           {"x": valor_x, "y": valor_y, "std": desviacion_estandar}
         ]
       }
     ]
   }
   ```
4. Usa la función `run_all_experiments()` implementada por José para obtener los datos

### José (Backend - Simulación)
1. Implementa la simulación en `simulation.py` siguiendo las especificaciones del documento
2. Utiliza SimPy para modelar recursos y procesos
3. Asegúrate de implementar correctamente el ciclo de vida de los procesos
4. La función `run_all_experiments()` debe devolver un diccionario con todos los resultados

## Cómo Iniciar el Proyecto

## Cómo Iniciar el Proyecto en Windows
Requisitos previos para Windows:

-Python 3.8 o superior
-Node.js y npm
-Visual Studio Code (recomendado)

Instalación:

Clona el repositorio o descarga los archivos
Instala las dependencias del backend:
Copycd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

Instala las dependencias del frontend:
Copycd ..\frontend
npm install
npm install chart.js@3.9.1 react-chartjs-2@4.3.1


Ejecución del proyecto:
Opción 1: Usando el script batch

Desde la carpeta raíz del proyecto, ejecuta:
Copystart.bat

Se abrirán dos ventanas de terminal, una para el backend y otra para el frontend
Espera a que ambos servicios inicien
Accede a la aplicación en: http://localhost:3000

Opción 2: Inicio manual

Inicia el backend:
Copycd backend
venv\Scripts\activate
python app.py

En otra ventana de terminal, inicia el frontend:
Copycd frontend
npm start

Accede a la aplicación en: http://localhost:3000

## Problemas comunes en Windows:

Error "react-scripts no se reconoce como un comando interno o externo":

Solución: Ejecuta npm install react-scripts en la carpeta frontend


Error "File at path ../frontend/build/index.html does not exist":

Solución: Construye primero la aplicación de React con cd frontend && npm run build


Error de CORS al conectar con el backend:

Verifica que el backend tenga configurada correctamente la política de CORS en app.py


Si el script start.bat no funciona:

Inicia los servicios manualmente como se indica en "Opción 2: Inicio manual"

## En macos o linux

1. Clona el repositorio
2. Instala las dependencias:
   ```bash
   # Backend
   cd backend
   python -m venv venv
   source venv/bin/activate  # En Windows: venv\Scripts\activate
   pip install -r requirements.txt
   
   # Frontend
   cd ../frontend
   npm install
   npm install chart.js react-chartjs-2
   ```

3. Ejecuta el script de inicio:
   ```bash
   ./start.sh
   control + c para salir
   ```

## Flujo de Comunicación

1. El usuario interactúa con la interfaz de React
2. El frontend realiza peticiones a la API implementada por Rene
3. La API utiliza la simulación implementada por José para obtener resultados
4. Los resultados se devuelven al frontend como JSON
5. El frontend renderiza las gráficas con Chart.js

## Descripción Técnica de las Gráficas

Las gráficas a implementar deben mostrar:

1. **Gráfica de Intervalos**:
   - Eje X: Número de procesos (25, 50, 100, 150, 200)
   - Eje Y: Tiempo promedio de ejecución
   - Series: Diferentes intervalos de llegada (10, 5, 1)
   - Debe incluir barras de error para la desviación estándar

2. **Gráfica de Estrategias**:
   - Eje X: Número de procesos (25, 50, 100, 150, 200)
   - Eje Y: Tiempo promedio de ejecución
   - Series: Diferentes estrategias
     - Normal (RAM=100, CPU=3, CPUs=1)
     - RAM=200
     - CPU Rápido (6 inst)
     - 2 CPUs
   - Debe incluir barras de error para la desviación estándar



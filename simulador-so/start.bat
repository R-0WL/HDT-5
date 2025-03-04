@echo off
:: Script para iniciar el simulador de SO en Windows
setlocal enabledelayedexpansion

:: Verificar que estamos en el directorio correcto
if not exist "backend" (
    echo Error: Este script debe ejecutarse desde el directorio raiz del proyecto.
    echo Asegurate de estar en el directorio que contiene las carpetas 'backend' y 'frontend'.
    pause
    exit /b 1
)

if not exist "frontend" (
    echo Error: Este script debe ejecutarse desde el directorio raiz del proyecto.
    echo Asegurate de estar en el directorio que contiene las carpetas 'backend' y 'frontend'.
    pause
    exit /b 1
)

echo === Iniciando Simulador de Sistema Operativo ===

:: Crear directorios necesarios
if not exist "backend\graficas" mkdir backend\graficas

:: Iniciar Backend
echo Iniciando backend...
cd backend

:: Verificar si el entorno virtual existe, si no, crearlo
if not exist "venv" (
    echo Creando entorno virtual...
    python -m venv venv
)

:: Activar entorno virtual
call venv\Scripts\activate.bat

:: Instalar dependencias
echo Instalando dependencias del backend...
pip install -r requirements.txt

:: Iniciar servidor backend en segundo plano
echo Iniciando servidor backend...
start /B python app.py

:: Cambiar al directorio frontend
cd ..\frontend

:: Instalar dependencias (si es necesario)
if not exist "node_modules" (
    echo Instalando dependencias del frontend...
    npm install
    
    :: Instalar Chart.js explícitamente
    echo Instalando Chart.js...
    npm install chart.js@3.9.1 react-chartjs-2@4.3.1
)

:: Iniciar servidor de desarrollo de React
echo Iniciando servidor frontend...
start /B npm start

echo ¡Simulador iniciado correctamente!
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo Presiona Ctrl+C en cada ventana de la consola para detener los servidores.

:: No cerramos la ventana para que el usuario pueda ver los mensajes
pause
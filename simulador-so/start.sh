#!/bin/bash

# Verificar si estamos en el directorio correcto
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
  echo "Error: Este script debe ejecutarse desde el directorio raíz del proyecto."
  echo "Asegúrate de estar en el directorio que contiene las carpetas 'backend' y 'frontend'."
  exit 1
fi

# Colores para terminal
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Iniciando Simulador de Sistema Operativo ===${NC}"

# Crear directorios necesarios
mkdir -p backend/graficas

# Iniciar Backend
echo -e "${BLUE}Iniciando backend...${NC}"
cd backend

# Verificar si el entorno virtual existe, si no, crearlo
if [ ! -d "venv" ]; then
  echo -e "${YELLOW}Creando entorno virtual...${NC}"
  python3 -m venv venv
fi

# Activar entorno virtual
source venv/bin/activate

# Instalar dependencias
echo -e "${YELLOW}Instalando dependencias del backend...${NC}"
pip install -r requirements.txt

# Iniciar servidor backend en segundo plano
echo -e "${GREEN}Iniciando servidor backend...${NC}"
python3 app.py &
BACKEND_PID=$!

# Cambiar al directorio frontend
cd ../frontend

# Instalar dependencias (si es necesario)
if [ ! -d "node_modules" ]; then
  echo -e "${YELLOW}Instalando dependencias del frontend...${NC}"
  npm install
  
  # Instalar Chart.js explícitamente
  echo -e "${YELLOW}Instalando Chart.js...${NC}"
  npm install chart.js@3.9.1 react-chartjs-2@4.3.1
fi

# Iniciar servidor de desarrollo de React en segundo plano
echo -e "${GREEN}Iniciando servidor frontend...${NC}"
npm start &
FRONTEND_PID=$!

# Función para manejar la señal de interrupción (Ctrl+C)
cleanup() {
  echo -e "${YELLOW}Deteniendo servidores...${NC}"
  kill $BACKEND_PID
  kill $FRONTEND_PID
  echo -e "${GREEN}Servidores detenidos.${NC}"
  exit 0
}

# Registrar la función cleanup para señales de interrupción
trap cleanup SIGINT SIGTERM

echo -e "${GREEN}¡Simulador iniciado correctamente!${NC}"
echo -e "${BLUE}Backend: http://localhost:8000${NC}"
echo -e "${BLUE}Frontend: http://localhost:3000${NC}"
echo -e "${YELLOW}Presiona Ctrl+C para detener los servidores.${NC}"

# Mantener el script en ejecución
wait
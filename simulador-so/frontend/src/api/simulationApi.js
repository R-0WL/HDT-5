import axios from 'axios';

const API_URL = 'http://localhost:8000';

// Ejecutar una simulación con parámetros específicos
export const runSimulation = async (params) => {
  try {
    const response = await axios.post(`${API_URL}/api/simulate`, params);
    return response.data;
  } catch (error) {
    console.error('Error al ejecutar simulación:', error);
    throw error;
  }
};

// Obtener resultados de todos los experimentos
export const getExperiments = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/experiments`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener experimentos:', error);
    throw error;
  }
};

// Obtener datos para la gráfica de intervalos
export const getIntervalData = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/graph-data/intervals`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener datos de intervalos:', error);
    throw error;
  }
};

// Obtener datos para la gráfica de estrategias
export const getStrategiesData = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/graph-data/strategies`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener datos de estrategias:', error);
    throw error;
  }
};

// Obtener estadísticas más recientes
export const getLatestStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/latest-stats`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    throw error;
  }
};
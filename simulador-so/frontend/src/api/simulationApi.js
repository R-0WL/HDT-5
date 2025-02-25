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

// Obtener URLs de gráficas generadas
export const getGraphs = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/graphs`);
    return response.data.graphs;
  } catch (error) {
    console.error('Error al obtener gráficas:', error);
    throw error;
  }
};
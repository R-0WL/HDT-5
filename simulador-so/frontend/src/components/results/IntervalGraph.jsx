import React from 'react';
import Graph from './Graph';

const IntervalGraph = ({ refreshTrigger }) => {
  return (
    <Graph 
      url="/api/graph-data/intervals"
      title="Tiempo Promedio por Número de Procesos y Tasa de Llegada"
      colors={['rgb(59, 130, 246)', 'rgb(34, 197, 94)', 'rgb(239, 68, 68)']}
      refreshTrigger={refreshTrigger}
    />
  );
};

export default IntervalGraph;
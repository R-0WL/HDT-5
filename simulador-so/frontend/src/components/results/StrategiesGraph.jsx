import React from 'react';
import Graph from './Graph';

const StrategiesGraph = ({ refreshTrigger }) => {
  return (
    <Graph 
      url="/api/graph-data/strategies"
      title="Comparación de Estrategias"
      colors={['rgb(59, 130, 246)', 'rgb(34, 197, 94)', 'rgb(239, 68, 68)', 'rgb(168, 85, 247)']}
      refreshTrigger={refreshTrigger}
    />
  );
};

export default StrategiesGraph;
import React, { useState, useEffect } from 'react';
import StatisticsPanel from './StatisticsPanel';
import IntervalGraph from './IntervalGraph';
import StrategiesGraph from './StrategiesGraph';
import { getLatestStats } from '../../api/simulationApi';

const Results = ({ refreshTrigger }) => {
  const [stats, setStats] = useState({
    averageTime: 0,
    standardDeviation: 0,
    processesCompleted: 0,
    totalProcesses: 0
  });
  
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getLatestStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, [refreshTrigger]); // Añadido refreshTrigger a las dependencias

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatisticsPanel stats={stats} loading={loading} />
      
      <div className="bg-gradient-to-b from-blue-300/80 to-blue-400/80 backdrop-blur-md rounded-xl overflow-hidden border-2 border-white/50 shadow-lg">
        <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 border-b-2 border-white/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-white opacity-30" style={{height: '50%'}}></div>
          <h2 className="text-lg font-bold text-white drop-shadow-md relative z-10">Tiempos por Intervalo</h2>
        </div>
        <div className="p-4 h-60">
          <IntervalGraph refreshTrigger={refreshTrigger} />
        </div>
      </div>
      
      <div className="bg-gradient-to-b from-blue-300/80 to-blue-400/80 backdrop-blur-md rounded-xl overflow-hidden border-2 border-white/50 shadow-lg">
        <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 border-b-2 border-white/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-white opacity-30" style={{height: '50%'}}></div>
          <h2 className="text-lg font-bold text-white drop-shadow-md relative z-10">Comparación de Estrategias</h2>
        </div>
        <div className="p-4 h-60">
          <StrategiesGraph refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </div>
  );
};

export default Results;
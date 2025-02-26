import React from 'react';

const StatisticsPanel = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="bg-gradient-to-b from-blue-300/80 to-blue-400/80 backdrop-blur-md rounded-xl overflow-hidden border-2 border-white/50 shadow-lg">
        <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 border-b-2 border-white/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-white opacity-30" style={{height: '50%'}}></div>
          <h2 className="text-lg font-bold text-white drop-shadow-md relative z-10">Estadísticas</h2>
        </div>
        <div className="p-4 flex items-center justify-center h-60">
          <div className="text-blue-800">Cargando estadísticas...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-blue-300/80 to-blue-400/80 backdrop-blur-md rounded-xl overflow-hidden border-2 border-white/50 shadow-lg">
      <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 border-b-2 border-white/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-white opacity-30" style={{height: '50%'}}></div>
        <h2 className="text-lg font-bold text-white drop-shadow-md relative z-10">Estadísticas</h2>
      </div>
      
      <div className="p-4">
        <div className="space-y-3">
          <div className="bg-blue-100/80 rounded-lg p-3 border border-white/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-white opacity-30" style={{height: '50%'}}></div>
            <div className="relative z-10">
              <div className="text-sm text-blue-800 font-semibold mb-1">Tiempo Promedio</div>
              <div className="text-2xl font-bold text-blue-900">{stats.averageTime.toFixed(2)}</div>
            </div>
          </div>
          
          <div className="bg-blue-100/80 rounded-lg p-3 border border-white/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-white opacity-30" style={{height: '50%'}}></div>
            <div className="relative z-10">
              <div className="text-sm text-blue-800 font-semibold mb-1">Desviación Estándar</div>
              <div className="text-2xl font-bold text-blue-900">{stats.standardDeviation.toFixed(2)}</div>
            </div>
          </div>
          
          <div className="bg-blue-100/80 rounded-lg p-3 border border-white/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-white opacity-30" style={{height: '50%'}}></div>
            <div className="relative z-10">
              <div className="text-sm text-blue-800 font-semibold mb-1">Procesos Completados</div>
              <div className="text-2xl font-bold text-blue-900">{stats.processesCompleted} / {stats.totalProcesses}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPanel;
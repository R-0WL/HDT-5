import React from 'react';

const MemoryMonitor = ({ memoryUsed, totalMemory }) => {
  const memoryPercentage = (memoryUsed / totalMemory) * 100;
  const freeMemory = totalMemory - memoryUsed;
  
  return (
    <div className="bg-gradient-to-b from-blue-300/80 to-blue-400/80 backdrop-blur-md rounded-xl overflow-hidden border-2 border-white/50 shadow-lg">
      <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 border-b-2 border-white/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-white opacity-30" style={{height: '50%'}}></div>
        <h2 className="text-lg font-bold text-white drop-shadow-md relative z-10">Memoria RAM</h2>
      </div>
      
      <div className="p-4">
        <div className="relative h-8 bg-gradient-to-b from-blue-700/60 to-blue-800/60 backdrop-blur-md rounded-full overflow-hidden border-2 border-white/50 shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 relative"
            style={{ width: `${memoryPercentage}%` }}
          >
            <div className="absolute inset-0">
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-white opacity-40 rounded-t-full"></div>
              <div className="absolute inset-0">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="h-px bg-white/30" 
                    style={{ marginTop: i * 4 }}
                  ></div>
                ))}
              </div>
            </div>
            <div className="h-full flex items-center justify-center">
              <span className="text-white font-bold text-sm drop-shadow-md">{memoryUsed} / {totalMemory}</span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between mt-2 text-xs">
          <span className="bg-blue-700/70 backdrop-blur-md px-3 py-1 rounded-full font-bold text-white border border-white/30 shadow relative overflow-hidden">
            <div className="absolute inset-0 bg-white opacity-20" style={{height: '50%'}}></div>
            <span className="relative z-10">Usado: {memoryUsed} ({memoryPercentage.toFixed(1)}%)</span>
          </span>
          <span className="bg-green-600/70 backdrop-blur-md px-3 py-1 rounded-full font-bold text-white border border-white/30 shadow relative overflow-hidden">
            <div className="absolute inset-0 bg-white opacity-20" style={{height: '50%'}}></div>
            <span className="relative z-10">Libre: {freeMemory} ({(100 - memoryPercentage).toFixed(1)}%)</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default MemoryMonitor;
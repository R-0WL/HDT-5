import React from 'react';

const LifecycleView = ({ stateCounts }) => {
  return (
    <div className="bg-gradient-to-b from-blue-300/80 to-blue-400/80 backdrop-blur-md rounded-xl overflow-hidden border-2 border-white/50 shadow-lg">
      <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 border-b-2 border-white/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-white opacity-30" style={{height: '50%'}}></div>
        <h2 className="text-lg font-bold text-white drop-shadow-md relative z-10">Ciclo de Vida de Procesos</h2>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-center">
          <div className="text-center">
            <div className="bg-gradient-to-b from-green-400 to-green-600 w-12 h-12 rounded-full mx-auto shadow-md border-2 border-white/50 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-white opacity-30" style={{height: '50%'}}></div>
              <span className="font-bold text-white drop-shadow-sm relative z-10">{stateCounts.new}</span>
            </div>
            <span className="text-xs font-semibold text-blue-900 mt-1 block">NUEVO</span>
          </div>
          
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
          
          <div className="text-center">
            <div className="bg-gradient-to-b from-blue-400 to-blue-600 w-12 h-12 rounded-full mx-auto shadow-md border-2 border-white/50 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-white opacity-30" style={{height: '50%'}}></div>
              <span className="font-bold text-white drop-shadow-sm relative z-10">{stateCounts.ready}</span>
            </div>
            <span className="text-xs font-semibold text-blue-900 mt-1 block">LISTO</span>
          </div>
          
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
          
          <div className="text-center">
            <div className="bg-gradient-to-b from-red-400 to-red-600 w-12 h-12 rounded-full mx-auto shadow-md border-2 border-white/50 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-white opacity-30" style={{height: '50%'}}></div>
              <span className="font-bold text-white drop-shadow-sm relative z-10">{stateCounts.running}</span>
            </div>
            <span className="text-xs font-semibold text-blue-900 mt-1 block">EJEC</span>
          </div>
          
          <svg className="w-5 h-5 text-blue-500 transform rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
          
          <div className="text-center">
            <div className="bg-gradient-to-b from-yellow-400 to-yellow-600 w-12 h-12 rounded-full mx-auto shadow-md border-2 border-white/50 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-white opacity-30" style={{height: '50%'}}></div>
              <span className="font-bold text-white drop-shadow-sm relative z-10">{stateCounts.waiting}</span>
            </div>
            <span className="text-xs font-semibold text-blue-900 mt-1 block">ESPERA</span>
          </div>
          
          <svg className="w-5 h-5 text-blue-500 transform -rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
          
          <div className="text-center">
            <div className="bg-gradient-to-b from-purple-400 to-purple-600 w-12 h-12 rounded-full mx-auto shadow-md border-2 border-white/50 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-white opacity-30" style={{height: '50%'}}></div>
              <span className="font-bold text-white drop-shadow-sm relative z-10">{stateCounts.terminated}</span>
            </div>
            <span className="text-xs font-semibold text-blue-900 mt-1 block">TERM</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LifecycleView;
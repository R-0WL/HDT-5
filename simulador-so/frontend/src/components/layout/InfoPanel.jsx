import React, { useState } from 'react';

const InfoPanel = () => {
  const [visible, setVisible] = useState(true);
  
  if (!visible) return null;
  
  return (
    <div className="fixed bottom-4 right-4 w-60 bg-gradient-to-b from-blue-400/90 to-blue-600/90 backdrop-blur-md rounded-lg border-2 border-white/50 shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2 border-b border-white/30 flex justify-between items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-white opacity-30" style={{height: '50%'}}></div>
        <span className="text-white font-bold text-sm relative z-10">Información</span>
        <button 
          className="w-5 h-5 rounded-full bg-red-500 relative overflow-hidden flex items-center justify-center"
          onClick={() => setVisible(false)}
        >
          <div className="absolute inset-0 bg-white opacity-30" style={{height: '50%'}}></div>
          <span className="text-white font-bold text-xs relative z-10">×</span>
        </button>
      </div>
      <div className="p-3">
        <p className="text-white text-xs">Seleccione los parámetros deseados y presione "Iniciar Simulación" para comenzar.</p>
      </div>
    </div>
  );
};

export default InfoPanel;
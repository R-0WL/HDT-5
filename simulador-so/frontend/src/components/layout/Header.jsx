import React from 'react';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 p-3 shadow-lg border-b-2 border-white/40 relative overflow-hidden">
      <div className="absolute inset-0 bg-white opacity-20" style={{height: '50%'}}></div>
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-b from-blue-400 to-blue-700 rounded-full flex items-center justify-center mr-3 shadow-md border-2 border-white/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-white opacity-40" style={{height: '50%'}}></div>
            <span className="text-white font-bold text-xl relative z-10">SO</span>
          </div>
          <h1 className="text-2xl font-bold text-white drop-shadow-md">Simulador de Sistema Operativo</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
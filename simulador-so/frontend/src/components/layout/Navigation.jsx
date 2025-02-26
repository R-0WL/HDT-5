import React from 'react';

const Navigation = ({ activeTab, setActiveTab }) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-1 border-b border-white/20 shadow-md">
      <div className="container mx-auto flex space-x-1">
        <button 
          className={`px-4 py-2 rounded-t-lg font-semibold relative overflow-hidden ${activeTab === 'simulation' ? 'bg-gradient-to-b from-blue-300 to-blue-400 text-blue-900' : 'bg-blue-700/50 text-white'}`}
          onClick={() => setActiveTab('simulation')}
        >
          {activeTab === 'simulation' && <div className="absolute inset-0 bg-white opacity-30" style={{height: '50%'}}></div>}
          <span className="relative z-10">Simulación</span>
        </button>
        <button 
          className={`px-4 py-2 rounded-t-lg font-semibold relative overflow-hidden ${activeTab === 'results' ? 'bg-gradient-to-b from-blue-300 to-blue-400 text-blue-900' : 'bg-blue-700/50 text-white'}`}
          onClick={() => setActiveTab('results')}
        >
          {activeTab === 'results' && <div className="absolute inset-0 bg-white opacity-30" style={{height: '50%'}}></div>}
          <span className="relative z-10">Resultados</span>
        </button>
        <button 
          className={`px-4 py-2 rounded-t-lg font-semibold relative overflow-hidden ${activeTab === 'settings' ? 'bg-gradient-to-b from-blue-300 to-blue-400 text-blue-900' : 'bg-blue-700/50 text-white'}`}
          onClick={() => setActiveTab('settings')}
        >
          {activeTab === 'settings' && <div className="absolute inset-0 bg-white opacity-30" style={{height: '50%'}}></div>}
          <span className="relative z-10">Configuración</span>
        </button>
      </div>
    </div>
  );
};

export default Navigation;
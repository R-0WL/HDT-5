import React from 'react';

const ExperimentOptions = ({ onRunExperiment, onRunAllExperiments, loading, onGoToResults }) => {
  return (
    <div className="bg-gradient-to-b from-blue-300/80 to-blue-400/80 backdrop-blur-md rounded-xl overflow-hidden border-2 border-white/50 shadow-lg">
      <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 border-b-2 border-white/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-white opacity-30" style={{height: '50%'}}></div>
        <h2 className="text-lg font-bold text-white drop-shadow-md relative z-10">Experimentos</h2>
      </div>
      
      <div className="p-4">
        <div className="space-y-3">
          <button 
            className="w-full h-9 relative bg-gradient-to-b from-blue-400 to-blue-600 rounded-lg px-4 py-2 text-white font-bold shadow-md border border-white/50 group overflow-hidden text-sm"
            onClick={() => {
              onRunExperiment({
                numProcesses: 25,
                arrivalInterval: 10,
                ramMemory: 100,
                instructionsPerUnit: 3,
                numCpus: 1
              });
            }}
            disabled={loading}
          >
            <div className="absolute inset-0 bg-white opacity-30 group-hover:opacity-40 transition-opacity" style={{height: '50%'}}></div>
            <div className="relative z-10">Ejecutar prueba con 25 procesos</div>
          </button>
          
          <button 
            className="w-full h-9 relative bg-gradient-to-b from-blue-400 to-blue-600 rounded-lg px-4 py-2 text-white font-bold shadow-md border border-white/50 group overflow-hidden text-sm"
            onClick={() => {
              onRunExperiment({
                numProcesses: 50,
                arrivalInterval: 10,
                ramMemory: 100,
                instructionsPerUnit: 3,
                numCpus: 1
              });
            }}
            disabled={loading}
          >
            <div className="absolute inset-0 bg-white opacity-30 group-hover:opacity-40 transition-opacity" style={{height: '50%'}}></div>
            <div className="relative z-10">Ejecutar prueba con 50 procesos</div>
          </button>
          
          <button 
            className="w-full h-9 relative bg-gradient-to-b from-blue-400 to-blue-600 rounded-lg px-4 py-2 text-white font-bold shadow-md border border-white/50 group overflow-hidden text-sm"
            onClick={() => {
              onRunExperiment({
                numProcesses: 100,
                arrivalInterval: 10,
                ramMemory: 100,
                instructionsPerUnit: 3,
                numCpus: 1
              });
            }}
            disabled={loading}
          >
            <div className="absolute inset-0 bg-white opacity-30 group-hover:opacity-40 transition-opacity" style={{height: '50%'}}></div>
            <div className="relative z-10">Ejecutar prueba con 100 procesos</div>
          </button>
          
          <button 
            className="w-full h-9 relative bg-gradient-to-b from-green-400 to-green-600 rounded-lg px-4 py-2 text-white font-bold shadow-md border border-white/50 group overflow-hidden text-sm"
            onClick={onRunAllExperiments}
            disabled={loading}
          >
            <div className="absolute inset-0 bg-white opacity-30 group-hover:opacity-40 transition-opacity" style={{height: '50%'}}></div>
            <div className="relative z-10">
              {loading ? 'Ejecutando...' : 'Ejecutar todos los experimentos'}
            </div>
          </button>
          
          <button 
            className="w-full h-9 relative bg-gradient-to-b from-purple-400 to-purple-600 rounded-lg px-4 py-2 text-white font-bold shadow-md border border-white/50 group overflow-hidden text-sm"
            onClick={onGoToResults}
          >
            <div className="absolute inset-0 bg-white opacity-30 group-hover:opacity-40 transition-opacity" style={{height: '50%'}}></div>
            <div className="relative z-10">Ver gráficas comparativas</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExperimentOptions;
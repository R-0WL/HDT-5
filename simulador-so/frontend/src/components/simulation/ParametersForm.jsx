import React from 'react';

const ParametersForm = ({ params, loading, onParamChange, onStartSimulation }) => {
  return (
    <div className="bg-gradient-to-b from-blue-300/80 to-blue-400/80 backdrop-blur-md rounded-xl overflow-hidden border-2 border-white/50 shadow-lg">
      <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 border-b-2 border-white/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-white opacity-30" style={{height: '50%'}}></div>
        <h2 className="text-lg font-bold text-white drop-shadow-md relative z-10">Parámetros de Simulación</h2>
      </div>
      
      <div className="p-4 space-y-4">
        {/* Número de procesos */}
        <div className="space-y-1">
          <label className="block text-blue-900 font-medium">Número de procesos:</label>
          <div className="relative">
            <select 
              className="w-full h-9 bg-gradient-to-b from-white/90 to-blue-100/90 backdrop-blur-md border-2 border-white/70 rounded-full px-4 py-1 text-blue-800 focus:outline-none appearance-none shadow-md"
              value={params.numProcesses}
              onChange={(e) => onParamChange('numProcesses', Number(e.target.value))}
            >
              <option value={25}>25 procesos</option>
              <option value={50}>50 procesos</option>
              <option value={100}>100 procesos</option>
              <option value={150}>150 procesos</option>
              <option value={200}>200 procesos</option>
            </select>
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-white opacity-30 rounded-t-full"></div>
            </div>
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Intervalo de llegada */}
        <div className="space-y-1">
          <label className="block text-blue-900 font-medium">Intervalo de llegada:</label>
          <div className="relative">
            <select 
              className="w-full h-9 bg-gradient-to-b from-white/90 to-blue-100/90 backdrop-blur-md border-2 border-white/70 rounded-full px-4 py-1 text-blue-800 focus:outline-none appearance-none shadow-md"
              value={params.arrivalInterval}
              onChange={(e) => onParamChange('arrivalInterval', Number(e.target.value))}
            >
              <option value={1}>1 - Rápido</option>
              <option value={5}>5 - Medio</option>
              <option value={10}>10 - Lento</option>
            </select>
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-white opacity-30 rounded-t-full"></div>
            </div>
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Memoria RAM */}
        <div className="space-y-1">
          <label className="block text-blue-900 font-medium">Memoria RAM:</label>
          <div className="relative">
            <select 
              className="w-full h-9 bg-gradient-to-b from-white/90 to-blue-100/90 backdrop-blur-md border-2 border-white/70 rounded-full px-4 py-1 text-blue-800 focus:outline-none appearance-none shadow-md"
              value={params.ramMemory}
              onChange={(e) => onParamChange('ramMemory', Number(e.target.value))}
            >
              <option value={100}>100 unidades</option>
              <option value={200}>200 unidades</option>
            </select>
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-white opacity-30 rounded-t-full"></div>
            </div>
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Opciones de CPU */}
        <div className="space-y-2 pt-2">
          <div className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <input 
                type="radio" 
                id="cpu_normal" 
                name="cpu_type" 
                checked={params.instructionsPerUnit === 3}
                onChange={() => onParamChange('instructionsPerUnit', 3)}
                className="w-4 h-4"
              />
              <label htmlFor="cpu_normal" className="text-blue-900">CPU Normal (3 inst)</label>
            </div>
            <div className="flex items-center space-x-2">
              <input 
                type="radio" 
                id="cpu_fast" 
                name="cpu_type" 
                checked={params.instructionsPerUnit === 6}
                onChange={() => onParamChange('instructionsPerUnit', 6)}
                className="w-4 h-4"
              />
              <label htmlFor="cpu_fast" className="text-blue-900">CPU Rápida (6 inst)</label>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <input 
                type="radio" 
                id="cpu_single" 
                name="cpu_count" 
                checked={params.numCpus === 1}
                onChange={() => onParamChange('numCpus', 1)}
                className="w-4 h-4"
              />
              <label htmlFor="cpu_single" className="text-blue-900">1 CPU</label>
            </div>
            <div className="flex items-center space-x-2">
              <input 
                type="radio" 
                id="cpu_dual" 
                name="cpu_count" 
                checked={params.numCpus === 2}
                onChange={() => onParamChange('numCpus', 2)}
                className="w-4 h-4"
              />
              <label htmlFor="cpu_dual" className="text-blue-900">2 CPUs</label>
            </div>
          </div>
        </div>
        
        {/* Botón de iniciar */}
        <div className="pt-2">
          <button 
            className="w-full h-10 relative bg-gradient-to-b from-green-400 to-green-600 rounded-full px-4 py-2 text-white font-bold shadow-md border-2 border-white/50 group overflow-hidden disabled:opacity-50"
            onClick={onStartSimulation}
            disabled={loading}
          >
            <div className="absolute inset-0 bg-white opacity-30 group-hover:opacity-40 transition-opacity" style={{height: '50%'}}></div>
            <div className="relative z-10 flex items-center justify-center">
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  SIMULANDO...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  INICIAR SIMULACIÓN
                </>
              )}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParametersForm;
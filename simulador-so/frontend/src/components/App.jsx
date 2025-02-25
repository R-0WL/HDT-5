import React, { useState, useEffect } from 'react';
import { runSimulation, getExperiments, getGraphs } from '../api/simulationApi';

// Datos de muestra para la simulación
const mockProcesses = [
  { id: 1, state: "new", memoryRequired: 8, remainingInstructions: 9 },
  { id: 2, state: "ready", memoryRequired: 5, remainingInstructions: 7 },
  { id: 3, state: "running", memoryRequired: 3, remainingInstructions: 2 },
  { id: 4, state: "waiting", memoryRequired: 6, remainingInstructions: 4 },
  { id: 5, state: "ready", memoryRequired: 2, remainingInstructions: 8 }
];

const App = () => {
  // Estado para parámetros de simulación
  const [params, setParams] = useState({
    numProcesses: 50,
    arrivalInterval: 10,
    ramMemory: 100,
    instructionsPerUnit: 3,
    numCpus: 1,
    includeTimeSeries: true
  });
  
  // Estado para pestañas de navegación
  const [activeTab, setActiveTab] = useState('simulation');
  
  // Estados para resultados y datos de simulación
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [processes, setProcesses] = useState([]);
  const [memoryUsed, setMemoryUsed] = useState(45); // Valor de ejemplo
  const [stateCounts, setStateCounts] = useState({
    new: 1, ready: 2, running: 1, waiting: 1, terminated: 0
  });
  
  // Iniciar una simulación
  // En App.jsx, modifica la función startSimulation
const startSimulation = async () => {
  setLoading(true);
  try {
    const data = await runSimulation(params);
    setResults(data);
    
    if (data.processes) {
      setProcesses(data.processes.slice(0, 10));
    }
    
    if (data.timeSeriesData && data.timeSeriesData.length > 0) {
      const lastEntry = data.timeSeriesData[data.timeSeriesData.length - 1];
      setMemoryUsed(params.ramMemory - lastEntry.memoryLevel);
      setStateCounts(lastEntry.statesCount);
    }
    
    // Cargar las gráficas actualizadas
    try {
      const graphsResponse = await getGraphs();
      // Forzar recarga de las imágenes añadiendo timestamp
      const timestamp = new Date().getTime();
      setGraphUrls({
        intervals: `http://localhost:8000/graficas/grafica_intervalos.png?t=${timestamp}`,
        strategies: `http://localhost:8000/graficas/grafica_estrategias.png?t=${timestamp}`
      });
    } catch (error) {
      console.error("Error al cargar gráficas:", error);
    }
    
    setActiveTab('results');
  } catch (error) {
    console.error("Error en la simulación:", error);
    alert("Error al ejecutar la simulación. Consulta la consola para más detalles.");
  } finally {
    setLoading(false);
  }
};

// Agregar estado para las URLs de las gráficas
const [graphUrls, setGraphUrls] = useState({
  intervals: '',
  strategies: ''
});
  
  // Ejecutar todos los experimentos
  const runAllExperiments = async () => {
    setLoading(true);
    try {
      await getExperiments();
      alert("Todos los experimentos han sido ejecutados y las gráficas han sido generadas.");
    } catch (error) {
      console.error("Error al ejecutar experimentos:", error);
      alert("Error al ejecutar los experimentos. Consulta la consola para más detalles.");
    } finally {
      setLoading(false);
    }
  };
  
  // Manejar cambios en los parámetros
  const handleParamChange = (name, value) => {
    setParams({
      ...params,
      [name]: value
    });
  };
  
  return (
    <div className="bg-gradient-to-b from-blue-400 to-blue-600 min-h-screen font-sans">
      {/* Barra superior al estilo Vista */}
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
      
      {/* Pestañas de navegación */}
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

      {/* Contenido principal */}
      <div className="container mx-auto p-4">
        {/* Pestaña de simulación */}
        {activeTab === 'simulation' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Panel de parámetros */}
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
                      onChange={(e) => handleParamChange('numProcesses', Number(e.target.value))}
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
                      onChange={(e) => handleParamChange('arrivalInterval', Number(e.target.value))}
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
                      onChange={(e) => handleParamChange('ramMemory', Number(e.target.value))}
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
                        onChange={() => handleParamChange('instructionsPerUnit', 3)}
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
                        onChange={() => handleParamChange('instructionsPerUnit', 6)}
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
                        onChange={() => handleParamChange('numCpus', 1)}
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
                        onChange={() => handleParamChange('numCpus', 2)}
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
                    onClick={startSimulation}
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
            
            {/* Visualización de memoria y ciclo de vida */}
            <div className="space-y-4">
              {/* Memoria RAM */}
              <div className="bg-gradient-to-b from-blue-300/80 to-blue-400/80 backdrop-blur-md rounded-xl overflow-hidden border-2 border-white/50 shadow-lg">
                <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 border-b-2 border-white/30 relative overflow-hidden">
                  <div className="absolute inset-0 bg-white opacity-30" style={{height: '50%'}}></div>
                  <h2 className="text-lg font-bold text-white drop-shadow-md relative z-10">Memoria RAM</h2>
                </div>
                
                <div className="p-4">
                  <div className="relative h-8 bg-gradient-to-b from-blue-700/60 to-blue-800/60 backdrop-blur-md rounded-full overflow-hidden border-2 border-white/50 shadow-inner">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 relative"
                      style={{ width: `${(memoryUsed / params.ramMemory) * 100}%` }}
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
                        <span className="text-white font-bold text-sm drop-shadow-md">{memoryUsed} / {params.ramMemory}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-2 text-xs">
                    <span className="bg-blue-700/70 backdrop-blur-md px-3 py-1 rounded-full font-bold text-white border border-white/30 shadow relative overflow-hidden">
                      <div className="absolute inset-0 bg-white opacity-20" style={{height: '50%'}}></div>
                      <span className="relative z-10">Usado: {memoryUsed} ({((memoryUsed / params.ramMemory) * 100).toFixed(1)}%)</span>
                    </span>
                    <span className="bg-green-600/70 backdrop-blur-md px-3 py-1 rounded-full font-bold text-white border border-white/30 shadow relative overflow-hidden">
                      <div className="absolute inset-0 bg-white opacity-20" style={{height: '50%'}}></div>
                      <span className="relative z-10">Libre: {params.ramMemory - memoryUsed} ({((params.ramMemory - memoryUsed) / params.ramMemory * 100).toFixed(1)}%)</span>
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Ciclo de Vida */}
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
            </div>
          </div>
        )}
        
        {/* Pestaña de resultados */}
        {activeTab === 'results' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Estadísticas */}
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
                      <div className="text-2xl font-bold text-blue-900">{results ? results.averageTime.toFixed(2) : '---'}</div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-100/80 rounded-lg p-3 border border-white/50 relative overflow-hidden">
                    <div className="absolute inset-0 bg-white opacity-30" style={{height: '50%'}}></div>
                    <div className="relative z-10">
                      <div className="text-sm text-blue-800 font-semibold mb-1">Desviación Estándar</div>
                      <div className="text-2xl font-bold text-blue-900">{results ? results.standardDeviation.toFixed(2) : '---'}</div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-100/80 rounded-lg p-3 border border-white/50 relative overflow-hidden">
                    <div className="absolute inset-0 bg-white opacity-30" style={{height: '50%'}}></div>
                    <div className="relative z-10">
                      <div className="text-sm text-blue-800 font-semibold mb-1">Procesos Completados</div>
                      <div className="text-2xl font-bold text-blue-900">{results && results.processes ? `${results.processes.length} / ${params.numProcesses}` : '---'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
     {/* Gráfica 1 */}
<div className="bg-gradient-to-b from-blue-300/80 to-blue-400/80 backdrop-blur-md rounded-xl overflow-hidden border-2 border-white/50 shadow-lg">
  <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 border-b-2 border-white/30 relative overflow-hidden">
    <div className="absolute inset-0 bg-white opacity-30" style={{height: '50%'}}></div>
    <h2 className="text-lg font-bold text-white drop-shadow-md relative z-10">Tiempos por Intervalo</h2>
  </div>
  
  <div className="p-4 h-60 flex items-center justify-center">
    <div className="text-blue-800 text-center w-full h-full">
      {graphUrls.intervals ? (
        <img 
          src={graphUrls.intervals} 
          alt="Gráfica de intervalos" 
          className="max-w-full max-h-full mx-auto"
        />
      ) : (
        "Ejecute una simulación para ver resultados"
      )}
    </div>
  </div>
</div>

{/* Gráfica 2 */}
<div className="bg-gradient-to-b from-blue-300/80 to-blue-400/80 backdrop-blur-md rounded-xl overflow-hidden border-2 border-white/50 shadow-lg">
  <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 border-b-2 border-white/30 relative overflow-hidden">
    <div className="absolute inset-0 bg-white opacity-30" style={{height: '50%'}}></div>
    <h2 className="text-lg font-bold text-white drop-shadow-md relative z-10">Comparación de Estrategias</h2>
  </div>
  
  <div className="p-4 h-60 flex items-center justify-center">
    <div className="text-blue-800 text-center w-full h-full">
      {graphUrls.strategies ? (
        <img 
          src={graphUrls.strategies} 
          alt="Gráfica de estrategias" 
          className="max-w-full max-h-full mx-auto"
        />
      ) : (
        "Ejecute una simulación para ver resultados"
      )}
    </div>
  </div>
</div>
          </div>
        )}
      
        
        {/* Pestaña de configuración */}
        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Lista de procesos */}
            <div className="bg-gradient-to-b from-blue-300/80 to-blue-400/80 backdrop-blur-md rounded-xl overflow-hidden border-2 border-white/50 shadow-lg">
              <div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-600 border-b-2 border-white/30 relative overflow-hidden">
                <div className="absolute inset-0 bg-white opacity-30" style={{height: '50%'}}></div>
                <h2 className="text-lg font-bold text-white drop-shadow-md relative z-10">Procesos Activos</h2>
              </div>
              
              <div className="p-4">
                <div className="overflow-hidden rounded-lg border border-white/50">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-blue-500 to-blue-600 relative overflow-hidden">
                        <th className="p-2 text-left text-white text-sm font-bold relative z-10">ID</th>
                        <th className="p-2 text-left text-white text-sm font-bold relative z-10">Estado</th>
                        <th className="p-2 text-left text-white text-sm font-bold relative z-10">Mem</th>
                        <th className="p-2 text-left text-white text-sm font-bold relative z-10">Inst</th>
                        <div className="absolute inset-0 bg-white opacity-20" style={{height: '50%'}}></div>
                      </tr>
                    </thead>
                    <tbody>
                      {(processes.length > 0 ? processes : mockProcesses).map((process, index) => (
                        <tr key={process.id} className={`relative ${index % 2 === 0 ? 'bg-blue-500/20' : 'bg-blue-600/20'}`}>
                          <td className="p-2 text-blue-800 font-medium relative overflow-hidden">
                            <div className="relative z-10">{process.id}</div>
                            <div className="absolute inset-0 bg-white opacity-10" style={{height: '50%'}}></div>
                          </td>
                          <td className="p-2 relative overflow-hidden">
                            <div className="relative z-10">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium relative overflow-hidden inline-block
                                ${process.state === 'new' ? 'bg-gradient-to-r from-green-400 to-green-500 text-white' : ''}
                                ${process.state === 'ready' ? 'bg-gradient-to-r from-blue-400 to-blue-500 text-white' : ''}
                                ${process.state === 'running' ? 'bg-gradient-to-r from-red-400 to-red-500 text-white' : ''}
                                ${process.state === 'waiting' ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white' : ''}
                                ${process.state === 'terminated' ? 'bg-gradient-to-r from-purple-400 to-purple-500 text-white' : ''}
                              `}>
                                <div className="absolute inset-0 bg-white opacity-30" style={{height: '50%'}}></div>
                                <span className="relative z-10">
                                  {process.state === 'new' ? 'NUEVO' : ''}
                                  {process.state === 'ready' ? 'LISTO' : ''}
                                  {process.state === 'running' ? 'EJEC' : ''}
                                  {process.state === 'waiting' ? 'ESPERA' : ''}
                                  {process.state === 'terminated' ? 'TERM' : ''}
                                </span>
                              </span>
                            </div>
                            <div className="absolute inset-0 bg-white opacity-10" style={{height: '50%'}}></div>
                          </td>
                          <td className="p-2 text-blue-800 relative overflow-hidden">
                            <div className="relative z-10">{process.memoryRequired || process.memory}</div>
                            <div className="absolute inset-0 bg-white opacity-10" style={{height: '50%'}}></div>
                          </td>
                          <td className="p-2 text-blue-800 relative overflow-hidden">
                            <div className="relative z-10">{process.remainingInstructions || process.instructions}</div>
                            <div className="absolute inset-0 bg-white opacity-10" style={{height: '50%'}}></div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            {/* Opciones de experimentos */}
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
                      handleParamChange('numProcesses', 25);
                      startSimulation();
                    }}
                    disabled={loading}
                  >
                    <div className="absolute inset-0 bg-white opacity-30 group-hover:opacity-40 transition-opacity" style={{height: '50%'}}></div>
                    <div className="relative z-10">Ejecutar prueba con 25 procesos</div>
                  </button>
                  
                  <button 
                    className="w-full h-9 relative bg-gradient-to-b from-blue-400 to-blue-600 rounded-lg px-4 py-2 text-white font-bold shadow-md border border-white/50 group overflow-hidden text-sm"
                    onClick={() => {
                      handleParamChange('numProcesses', 50);
                      startSimulation();
                    }}
                    disabled={loading}
                  >
                    <div className="absolute inset-0 bg-white opacity-30 group-hover:opacity-40 transition-opacity" style={{height: '50%'}}></div>
                    <div className="relative z-10">Ejecutar prueba con 50 procesos</div>
                  </button>
                  
                  <button 
                    className="w-full h-9 relative bg-gradient-to-b from-blue-400 to-blue-600 rounded-lg px-4 py-2 text-white font-bold shadow-md border border-white/50 group overflow-hidden text-sm"
                    onClick={() => {
                      handleParamChange('numProcesses', 100);
                      startSimulation();
                    }}
                    disabled={loading}
                  >
                    <div className="absolute inset-0 bg-white opacity-30 group-hover:opacity-40 transition-opacity" style={{height: '50%'}}></div>
                    <div className="relative z-10">Ejecutar prueba con 100 procesos</div>
                  </button>
                  
                  <button 
                    className="w-full h-9 relative bg-gradient-to-b from-green-400 to-green-600 rounded-lg px-4 py-2 text-white font-bold shadow-md border border-white/50 group overflow-hidden text-sm"
                    onClick={runAllExperiments}
                    disabled={loading}
                  >
                    <div className="absolute inset-0 bg-white opacity-30 group-hover:opacity-40 transition-opacity" style={{height: '50%'}}></div>
                    <div className="relative z-10">
                      {loading ? 'Ejecutando...' : 'Ejecutar todos los experimentos'}
                    </div>
                  </button>
                  
                  <button 
                    className="w-full h-9 relative bg-gradient-to-b from-purple-400 to-purple-600 rounded-lg px-4 py-2 text-white font-bold shadow-md border border-white/50 group overflow-hidden text-sm"
                    onClick={() => setActiveTab('results')}
                  >
                    <div className="absolute inset-0 bg-white opacity-30 group-hover:opacity-40 transition-opacity" style={{height: '50%'}}></div>
                    <div className="relative z-10">Ver gráficas comparativas</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Ventana flotante de notificación */}
      <div className="fixed bottom-4 right-4 w-60 bg-gradient-to-b from-blue-400/90 to-blue-600/90 backdrop-blur-md rounded-lg border-2 border-white/50 shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2 border-b border-white/30 flex justify-between items-center relative overflow-hidden">
          <div className="absolute inset-0 bg-white opacity-30" style={{height: '50%'}}></div>
          <span className="text-white font-bold text-sm relative z-10">Información</span>
          <button className="w-5 h-5 rounded-full bg-red-500 relative overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-white opacity-30" style={{height: '50%'}}></div>
            <span className="text-white font-bold text-xs relative z-10">×</span>
          </button>
        </div>
        <div className="p-3">
          <p className="text-white text-xs">Seleccione los parámetros deseados y presione "Iniciar Simulación" para comenzar.</p>
        </div>
      </div>
    </div>
  );
};

export default App;
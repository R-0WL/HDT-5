import React, { useState } from 'react';
import { runSimulation, getExperiments } from '../api/simulationApi';
import Header from './layout/Header';
import Navigation from './layout/Navigation';
import ParametersForm from './simulation/ParametersForm';
import MemoryMonitor from './simulation/MemoryMonitor';
import LifecycleView from './simulation/LifecycleView';
import Results from './results/Results';
import ProcessesList from './settings/ProcessesList';
import ExperimentOptions from './settings/ExperimentOptions';
import InfoPanel from './layout/InfoPanel';

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
  
  // Trigger para actualizar gráficas
  const [refreshGraphs, setRefreshGraphs] = useState(0);
  
  // Iniciar una simulación
  const startSimulation = async () => {
    setLoading(true);
    try {
      const data = await runSimulation(params);
      setResults(data);
      
      if (data.processes) {
        setProcesses(data.processes.slice(0, 10)); // Mostrar solo los primeros 10
      }
      
      if (data.timeSeriesData && data.timeSeriesData.length > 0) {
        // Tomar el último registro de series temporales para mostrar el estado final
        const lastEntry = data.timeSeriesData[data.timeSeriesData.length - 1];
        setMemoryUsed(params.ramMemory - lastEntry.memoryLevel);
        setStateCounts(lastEntry.statesCount);
      }
      
      // Incrementar el contador para actualizar gráficas
      setRefreshGraphs(prev => prev + 1);
      
      // Cambiar a la pestaña de resultados
      setActiveTab('results');
    } catch (error) {
      console.error("Error en la simulación:", error);
      alert("Error al ejecutar la simulación. Consulta la consola para más detalles.");
    } finally {
      setLoading(false);
    }
  };
  
  // Ejecutar todos los experimentos
  const runAllExperiments = async () => {
    setLoading(true);
    try {
      await getExperiments();
      
      // Incrementar el contador para actualizar gráficas
      setRefreshGraphs(prev => prev + 1);
      
      setActiveTab('results');
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
      <Header />
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="container mx-auto p-4">
        {/* Pestaña de simulación */}
        {activeTab === 'simulation' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ParametersForm 
              params={params} 
              loading={loading}
              onParamChange={handleParamChange}
              onStartSimulation={startSimulation}
            />
            <div className="space-y-4">
              <MemoryMonitor memoryUsed={memoryUsed} totalMemory={params.ramMemory} />
              <LifecycleView stateCounts={stateCounts} />
            </div>
          </div>
        )}
        
        {/* Pestaña de resultados */}
        {activeTab === 'results' && <Results refreshTrigger={refreshGraphs} />}
        
        {/* Pestaña de configuración */}
        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ProcessesList processes={processes} />
            <ExperimentOptions 
              onRunExperiment={(newParams) => {
                // Actualizar parámetros y ejecutar simulación
                Object.keys(newParams).forEach(key => {
                  handleParamChange(key, newParams[key]);
                });
                startSimulation();
              }} 
              onRunAllExperiments={runAllExperiments}
              loading={loading}
              onGoToResults={() => setActiveTab('results')}
            />
          </div>
        )}
      </div>
      
      <InfoPanel />
    </div>
  );
};

export default App;
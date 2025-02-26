import React from 'react';

const ProcessesList = ({ processes }) => {
  // Si no hay procesos, usar datos de ejemplo
  const displayProcesses = processes.length > 0 ? processes : [
    { id: 1, state: "new", memoryRequired: 8, remainingInstructions: 9 },
    { id: 2, state: "ready", memoryRequired: 5, remainingInstructions: 7 },
    { id: 3, state: "running", memoryRequired: 3, remainingInstructions: 2 },
    { id: 4, state: "waiting", memoryRequired: 6, remainingInstructions: 4 },
    { id: 5, state: "ready", memoryRequired: 2, remainingInstructions: 8 }
  ];

  return (
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
              {displayProcesses.map((process, index) => (
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
  );
};

export default ProcessesList;
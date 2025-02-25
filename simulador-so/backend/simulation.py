import simpy
import random
import numpy as np
from collections import defaultdict

# Semilla para reproducibilidad
RANDOM_SEED = 42
random.seed(RANDOM_SEED)

class Process:
    """Clase que representa un proceso en el sistema operativo."""
    id_counter = 0
    
    def __init__(self, env, pid=None):
        """Inicializa un nuevo proceso."""
        if pid is None:
            Process.id_counter += 1
            self.id = Process.id_counter
        else:
            self.id = pid
            
        self.env = env
        self.memory = random.randint(1, 10)
        self.instructions = random.randint(1, 10)
        self.state = "new"
        self.arrival_time = env.now
        self.completion_time = None
        
    def __str__(self):
        """Representación de string del proceso."""
        return f"Proceso {self.id} - Estado: {self.state}, Memoria: {self.memory}, Instrucciones: {self.instructions}"

class OSSimulation:
    """Clase que maneja la simulación del sistema operativo."""
    
    def __init__(self, env, num_processes, arrival_interval, ram_size, instructions_per_unit, num_cpus=1):
        """Inicializa la simulación con los parámetros dados."""
        self.env = env
        self.num_processes = num_processes
        self.arrival_interval = arrival_interval
        self.ram = simpy.Container(env, init=ram_size, capacity=ram_size)
        self.instructions_per_unit = instructions_per_unit
        self.cpu = simpy.Resource(env, capacity=num_cpus)
        self.waiting_queue = simpy.Resource(env, capacity=float('inf'))
        
        # Para almacenar los procesos
        self.processes = []
        
        # Para almacenar estadísticas
        self.completed_processes = []
        self.process_times = []
        
        # Para almacenar datos de series temporales
        self.time_series_data = []
        self.include_time_series = False
        
    def generate_processes(self):
        """Genera procesos según una distribución exponencial."""
        for i in range(self.num_processes):
            yield self.env.timeout(random.expovariate(1.0 / self.arrival_interval))
            process = Process(self.env)
            self.processes.append(process)
            self.env.process(self.process_lifecycle(process))
            
    def process_lifecycle(self, process):
        """Maneja el ciclo de vida completo de un proceso."""
        # Estado NEW - Esperando por memoria
        process.state = "new"
        self.record_state()
        
        # Solicitar memoria RAM
        yield self.ram.get(process.memory)
        
        # Estado READY - Esperando por CPU
        process.state = "ready"
        self.record_state()
        
        # Mientras el proceso tenga instrucciones por ejecutar
        while process.instructions > 0:
            # Obtener CPU
            with self.cpu.request() as req:
                yield req
                
                # Estado RUNNING - Ejecutando en CPU
                process.state = "running"
                self.record_state()
                
                # Ejecutar instrucciones (1 unidad de tiempo)
                yield self.env.timeout(1)
                
                # Actualizar contador de instrucciones
                if process.instructions <= self.instructions_per_unit:
                    process.instructions = 0
                else:
                    process.instructions -= self.instructions_per_unit
                
            # Decidir el próximo estado
            if process.instructions <= 0:
                # TERMINATED - No más instrucciones
                process.state = "terminated"
                self.record_state()
                
                # Liberar memoria
                yield self.ram.put(process.memory)
                
                # Registrar tiempo de finalización
                process.completion_time = self.env.now
                self.process_times.append(process.completion_time - process.arrival_time)
                self.completed_processes.append(process)
                break
            else:
                # Generar número aleatorio para decidir el próximo estado
                next_state = random.randint(1, 2)
                
                if next_state == 1:
                    # WAITING - Operaciones I/O
                    process.state = "waiting"
                    self.record_state()
                    
                    # Simular tiempo en operaciones I/O
                    with self.waiting_queue.request() as wait_req:
                        yield wait_req
                        yield self.env.timeout(random.uniform(1, 3))
                        
                    # Regresar a READY
                    process.state = "ready"
                    self.record_state()
                else:
                    # Regresar directamente a READY
                    process.state = "ready"
                    self.record_state()
                    
    def record_state(self):
        """Registra el estado actual de la simulación para series temporales."""
        if not self.include_time_series:
            return
            
        # Contar procesos en cada estado
        states_count = defaultdict(int)
        for p in self.processes:
            states_count[p.state] += 1
            
        # Registrar datos
        self.time_series_data.append({
            "time": self.env.now,
            "memoryLevel": self.ram.level,
            "statesCount": dict(states_count)
        })
    
    def run_simulation(self, include_time_series=False):
        """Ejecuta la simulación completa."""
        self.include_time_series = include_time_series
        Process.id_counter = 0  # Resetear contador de IDs
        
        # Iniciar generación de procesos
        self.env.process(self.generate_processes())
        
        # Ejecutar simulación
        self.env.run()
        
        # Calcular estadísticas
        avg_time = np.mean(self.process_times) if self.process_times else 0
        std_dev = np.std(self.process_times) if len(self.process_times) > 1 else 0
        
        return {
            "averageTime": avg_time,
            "standardDeviation": std_dev,
            "processes": [
                {
                    "id": p.id,
                    "state": p.state,
                    "memory": p.memory,
                    "instructions": p.instructions,
                    "arrivalTime": p.arrival_time,
                    "completionTime": p.completion_time
                } for p in self.processes
            ],
            "timeSeriesData": self.time_series_data if include_time_series else []
        }

def run_experiment(num_processes=50, arrival_interval=10, ram_memory=100, 
                  instructions_per_unit=3, num_cpus=1, include_time_series=False,
                  max_simulation_time=1000):
    """Ejecuta un experimento de simulación con los parámetros dados."""
    # Crear ambiente de simulación con tiempo máximo
    env = simpy.Environment()
    
    # Crear simulación
    simulation = OSSimulation(env, num_processes, arrival_interval, 
                              ram_memory, instructions_per_unit, num_cpus)
    
    # Ejecutar simulación
    return simulation.run_simulation(include_time_series)

# Experimentos para diferentes configuraciones
def run_all_experiments():
    """Ejecuta todos los experimentos con diferentes configuraciones."""
    process_counts = [25, 50, 100, 150, 200]
    arrival_intervals = [10, 5, 1]
    results = {}
    
    # Experimentos con parámetros normales
    for interval in arrival_intervals:
        results[f"interval_{interval}"] = []
        for count in process_counts:
            result = run_experiment(
                num_processes=count,
                arrival_interval=interval,
                ram_memory=100,
                instructions_per_unit=3,
                num_cpus=1,
                include_time_series=False
            )
            results[f"interval_{interval}"].append({
                "numProcesses": count,
                "averageTime": result["averageTime"],
                "standardDeviation": result["standardDeviation"]
            })
    
    # Experimentos con memoria incrementada
    results["ram_200"] = []
    for count in process_counts:
        result = run_experiment(
            num_processes=count,
            arrival_interval=10,
            ram_memory=200,
            instructions_per_unit=3,
            num_cpus=1,
            include_time_series=False
        )
        results["ram_200"].append({
            "numProcesses": count,
            "averageTime": result["averageTime"],
            "standardDeviation": result["standardDeviation"]
        })
    
    # Experimentos con CPU más rápido
    results["fast_cpu"] = []
    for count in process_counts:
        result = run_experiment(
            num_processes=count,
            arrival_interval=10,
            ram_memory=100,
            instructions_per_unit=6,
            num_cpus=1,
            include_time_series=False
        )
        results["fast_cpu"].append({
            "numProcesses": count,
            "averageTime": result["averageTime"],
            "standardDeviation": result["standardDeviation"]
        })
    
    # Experimentos con 2 CPUs
    results["dual_cpu"] = []
    for count in process_counts:
        result = run_experiment(
            num_processes=count,
            arrival_interval=10,
            ram_memory=100,
            instructions_per_unit=3,
            num_cpus=2,
            include_time_series=False
        )
        results["dual_cpu"].append({
            "numProcesses": count,
            "averageTime": result["averageTime"],
            "standardDeviation": result["standardDeviation"]
        })
    
    return results

if __name__ == "__main__":
    # Prueba simple
    result = run_experiment(num_processes=10, include_time_series=True)
    print(f"Tiempo promedio: {result['averageTime']}")
    print(f"Desviación estándar: {result['standardDeviation']}")
    print(f"Procesos completados: {len(result['processes'])}")
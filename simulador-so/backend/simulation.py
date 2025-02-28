"""
Módulo de simulación para el Simulador de Sistema Operativo.

Este módulo implementa la simulación de un sistema operativo usando SimPy,
modelando procesos, memoria RAM, CPU y el ciclo de vida de los procesos.

Autor: José
"""

import simpy
import random
import numpy as np
from collections import defaultdict

# Semilla para reproducibilidad
RANDOM_SEED = 42
random.seed(RANDOM_SEED)

class Process:
    def __init__(self, env: simpy.Environment, pid: int, size: int, instructions: int):
        """
        Clase que representa un proceso en la simulación del sistema operativo.
        
        :param env: Entorno de SimPy donde se ejecuta la simulación.
        :param pid: Identificador único del proceso.
        :param size: Cantidad de memoria RAM requerida por el proceso.
        :param instructions: Número total de instrucciones que ejecutará el proceso.
        """
        self.env = env
        self.pid = pid
        self.size = size
        self.instructions = instructions
        self.state = "new"  # Estados: new, ready, running, terminated
        self.start_time = None
        self.completion_time = None
    
    def execute(self, cpu: simpy.Resource, ram: simpy.Container, instruction_per_cycle: int):
        """
        Simula la ejecución del proceso en el sistema operativo.
        
        :param cpu: Recurso CPU de SimPy.
        :param ram: Contenedor de memoria RAM.
        :param instruction_per_cycle: Cantidad de instrucciones ejecutadas por ciclo.
        """
        self.state = "ready"
        self.start_time = self.env.now
        print(f"[{self.env.now}] Proceso {self.pid} creado y esperando memoria ({self.size} MB).")
        
        # Solicitar RAM
        yield ram.get(self.size)
        print(f"[{self.env.now}] Proceso {self.pid} obtuvo {self.size} MB de RAM, listo para ejecución.")
        
        while self.instructions > 0:
            self.state = "running"
            with cpu.request() as req:
                yield req  # Esperar CPU
                print(f"[{self.env.now}] Proceso {self.pid} ejecutando en CPU.")
                yield self.env.timeout(1)  # Simula el uso del CPU por un ciclo
                self.instructions -= instruction_per_cycle
                print(f"[{self.env.now}] Proceso {self.pid} ejecutó instrucciones restantes: {self.instructions}.")
        
        # Liberar RAM y finalizar proceso
        yield ram.put(self.size)
        self.state = "terminated"
        self.completion_time = self.env.now
        print(f"[{self.env.now}] Proceso {self.pid} finalizado, liberando {self.size} MB de RAM.")
    
    def __init__(self, env, pid=None):
        """
        Inicializa un nuevo proceso.
        
        Args:
            env (simpy.Environment): Entorno de simulación
            pid (int, opcional): ID del proceso. Si es None, se genera automáticamente.
        """
        if pid is None:
            Process.id_counter += 1
            self.id = Process.id_counter
        else:
            self.id = pid
            
        self.env = env
        self.memory = random.randint(1, 10)  # Memoria requerida (1-10)
        self.instructions = random.randint(1, 10)  # Instrucciones a ejecutar (1-10)
        self.state = "new"  # Estado inicial
        self.arrival_time = env.now  # Tiempo de llegada
        self.completion_time = None  # Tiempo de finalización (inicialmente None)
        
    def __str__(self):
        """
        Devuelve una representación en string del proceso.
        
        Returns:
            str: Representación del proceso con sus atributos principales
        """
        return f"Proceso {self.id} - Estado: {self.state}, Memoria: {self.memory}, Instrucciones: {self.instructions}"

class OSSimulation:
    def __init__(self, env, num_processes, arrival_interval, ram_size, instructions_per_unit, num_cpus):
        self.env = env
        self.num_processes = num_processes
        self.arrival_interval = arrival_interval
        self.ram = simpy.Container(env, init=ram_size, capacity=ram_size)
        self.instructions_per_unit = instructions_per_unit
        self.cpu = simpy.Resource(env, capacity=num_cpus)
        self.waiting_queue = simpy.Resource(env, capacity=1)  # Cola para I/O
        self.processes = []
        self.completed_processes = []
        self.process_times = []
        self.time_series_data = []
    
    def generate_processes(self):
        """Genera procesos y los añade al entorno de SimPy."""
        for i in range(self.num_processes):
            process = Process(
                pid=i,
                env=self.env,
                ram=self.ram,
                cpu=self.cpu,
                waiting_queue=self.waiting_queue,
                instructions=random.randint(1, 10) * self.instructions_per_unit
            )
            self.processes.append(process)
            self.env.process(self.process_lifecycle(process))
            yield self.env.timeout(random.expovariate(1.0 / self.arrival_interval))
    
    def process_lifecycle(self, process):
        """Maneja el ciclo de vida de un proceso dentro del sistema operativo."""
        yield self.env.process(process.request_ram())
        
        start_time = self.env.now
        while process.instructions_remaining > 0:
            with self.cpu.request() as req:
                yield req  # Espera acceso a la CPU
                yield self.env.process(process.execute(self.instructions_per_unit))
            
            if random.random() < 0.1:  # Simulación de I/O con probabilidad del 10%
                with self.waiting_queue.request() as io_req:
                    yield io_req
                    yield self.env.timeout(random.uniform(1, 3))  # Simulación de tiempo de I/O
        
        process.terminate()
        self.completed_processes.append(process)
        self.process_times.append(self.env.now - start_time)
    
    def run_simulation(self):
        """Ejecuta la simulación creando procesos y ejecutándolos en el entorno."""
        self.env.process(self.generate_processes())
        self.env.run()
    
    def get_results(self):
        """Devuelve métricas sobre la simulación."""
        avg_time = sum(self.process_times) / len(self.process_times) if self.process_times else 0
        return {
            "completed_processes": len(self.completed_processes),
            "average_execution_time": avg_time
        }

    
    def __init__(self, env, num_processes, arrival_interval, ram_size, instructions_per_unit, num_cpus=1):
        """
        Inicializa la simulación con los parámetros dados.
        
        Args:
            env (simpy.Environment): Entorno de simulación
            num_processes (int): Número total de procesos a crear
            arrival_interval (float): Intervalo promedio entre llegadas de procesos
            ram_size (int): Tamaño total de la memoria RAM
            instructions_per_unit (int): Instrucciones ejecutadas por unidad de tiempo
            num_cpus (int, opcional): Número de CPUs disponibles
        """
        self.env = env
        self.num_processes = num_processes
        self.arrival_interval = arrival_interval
        self.ram = simpy.Container(env, init=ram_size, capacity=ram_size)  # Memoria RAM como Container
        self.instructions_per_unit = instructions_per_unit
        self.cpu = simpy.Resource(env, capacity=num_cpus)  # CPU como Resource
        self.waiting_queue = simpy.Resource(env, capacity=float('inf'))  # Cola para I/O
        
        # Para almacenar los procesos
        self.processes = []
        
        # Para almacenar estadísticas
        self.completed_processes = []
        self.process_times = []
        
        # Para almacenar datos de series temporales
        self.time_series_data = []
        self.include_time_series = False
        
    def generate_processes(self):
        """
        Genera procesos según una distribución exponencial.
        
        Este método crea procesos de acuerdo al intervalo especificado
        y los añade a la simulación. Cada proceso se crea con un tiempo
        entre llegadas que sigue una distribución exponencial.
        
        Yields:
            simpy.events.Timeout: Evento de timeout para la creación del siguiente proceso
        """
        # Implementar la generación de procesos según distribución exponencial
        pass
            
    def process_lifecycle(self, process):
        """
        Maneja el ciclo de vida completo de un proceso.
        
        Implementa el flujo completo del proceso a través de sus diferentes estados:
        1. NEW: Espera por memoria RAM
        2. READY: Espera por CPU
        3. RUNNING: Se ejecuta en CPU
        4. Después de CPU:
           - TERMINATED: Si no quedan instrucciones
           - WAITING: Si se genera un 1 aleatorio, va a I/O
           - READY: Si se genera un 2 aleatorio, vuelve a la cola de listos
        
        Args:
            process (Process): El proceso a manejar
            
        Yields:
            Diversos eventos de SimPy según el ciclo de vida
        """
        # Implementar el ciclo de vida completo del proceso
        pass
                    
    def record_state(self):
        """
        Registra el estado actual de la simulación para series temporales.
        
        Guarda información sobre el estado actual del sistema, incluyendo:
        - Nivel de memoria RAM
        - Número de procesos en cada estado
        - Timestamp
        
        Esta información se utiliza para análisis posterior y visualización.
        """
        # Implementar el registro de estados
        pass
    
    def run_simulation(self, include_time_series=False):
        """
        Ejecuta la simulación completa y devuelve resultados.
        
        Args:
            include_time_series (bool): Si se deben incluir datos de series temporales
            
        Returns:
            dict: Resultados de la simulación, incluyendo tiempos promedio, desviación
                  estándar, procesos y datos temporales si se solicitan.
        """
        # Implementar la ejecución de la simulación
        pass

import simpy

def run_experiment(num_processes=50, arrival_interval=10, ram_memory=100, 
                   instructions_per_unit=3, num_cpus=1, include_time_series=False,
                   max_simulation_time=1000):
    """
    Ejecuta un experimento de simulación con los parámetros dados.
    
    Esta función configura y ejecuta una simulación completa con los
    parámetros especificados, devolviendo los resultados.
    
    Args:
        num_processes (int): Número de procesos a simular
        arrival_interval (float): Intervalo promedio entre llegadas
        ram_memory (int): Cantidad total de memoria RAM
        instructions_per_unit (int): Instrucciones por unidad de tiempo
        num_cpus (int): Número de CPUs disponibles
        include_time_series (bool): Si se deben incluir datos temporales
        max_simulation_time (int): Tiempo máximo de simulación
        
    Returns:
        dict: Resultados del experimento
    """
    env = simpy.Environment()
    
    # Crear instancia de la simulación con los parámetros dados
    simulation = OSSimulation(env, num_processes, arrival_interval, ram_memory,
                              instructions_per_unit, num_cpus, include_time_series)
    
    # Ejecutar la simulación hasta que termine o alcance el tiempo máximo
    env.run(until=max_simulation_time)
    
    # Obtener resultados
    results = {
        "completed_processes": len(simulation.completed_processes),
        "avg_time_per_process": (sum(simulation.process_times) / len(simulation.process_times)) if simulation.process_times else 0,
        "time_series_data": simulation.time_series_data if include_time_series else None
    }
    
    return results


def run_all_experiments():
    """
    Ejecuta todos los experimentos con diferentes configuraciones.
    
    Esta función ejecuta múltiples experimentos con diferentes combinaciones
    de parámetros según lo especificado en el documento:
    - Diferentes cantidades de procesos (25, 50, 100, 150, 200)
    - Diferentes intervalos de llegada (10, 5, 1)
    - Diferentes estrategias (RAM=200, CPU rápido, 2 CPUs)
    
    Returns:
        dict: Diccionario con los resultados de todos los experimentos
    """
    # Definir parámetros a probar
    num_processes_list = [25, 50, 100, 150, 200]
    arrival_intervals = [10, 5, 1]
    configurations = [
        {"ram_memory": 100, "instructions_per_unit": 3, "num_cpus": 1},  # Configuración base
        {"ram_memory": 200, "instructions_per_unit": 3, "num_cpus": 1},  # Más RAM
        {"ram_memory": 100, "instructions_per_unit": 6, "num_cpus": 1},  # CPU rápido
        {"ram_memory": 100, "instructions_per_unit": 3, "num_cpus": 2},  # 2 CPUs
    ]
    
    results = {}

    # Ejecutar experimentos con todas las combinaciones de parámetros
    for num_processes in num_processes_list:
        for arrival_interval in arrival_intervals:
            for config in configurations:
                experiment_key = f"P{num_processes}_A{arrival_interval}_RAM{config['ram_memory']}_CPU{config['num_cpus']}_Speed{config['instructions_per_unit']}"
                results[experiment_key] = run_experiment(
                    num_processes=num_processes,
                    arrival_interval=arrival_interval,
                    ram_memory=config["ram_memory"],
                    instructions_per_unit=config["instructions_per_unit"],
                    num_cpus=config["num_cpus"],
                    include_time_series=False,
                    max_simulation_time=1000
                )

    return results



# esto la verdad es solo para probar, pero no me gusta el if name == main pero era la opcion mas viable.
if __name__ == "__main__":
    # Prueba simple
    result = run_experiment(num_processes=10, include_time_series=True)
    print(f"Tiempo promedio: {result['averageTime']}")
    print(f"Desviación estándar: {result['standardDeviation']}")
    print(f"Procesos completados: {len(result['processes'])}")
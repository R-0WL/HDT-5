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
    """
    Representa un proceso en el sistema operativo.
    
    La clase Process modela un programa en ejecución dentro del sistema operativo.
    Cada proceso tiene un ciclo de vida que pasa por diferentes estados:
    new -> ready -> running -> (waiting/ready/terminated)
    
    Atributos:
        id (int): Identificador único del proceso
        env (simpy.Environment): Entorno de simulación
        memory (int): Cantidad de memoria RAM requerida (1-10)
        instructions (int): Número total de instrucciones a ejecutar (1-10)
        state (str): Estado actual del proceso (new, ready, running, waiting, terminated)
        arrival_time (float): Tiempo de llegada al sistema
        completion_time (float): Tiempo de finalización (None si no ha terminado)
    
    Responsabilidad de José: Implementar esta clase con todos sus atributos y métodos.
    """
    id_counter = 0
    
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
    """
    Clase principal que maneja la simulación del sistema operativo.
    
    Esta clase coordina toda la simulación, incluyendo la creación de procesos,
    la gestión de recursos (RAM, CPU), y el ciclo de vida de los procesos.
    Implementa el modelo del sistema operativo descrito en la especificación.
    
    Atributos:
        env (simpy.Environment): Entorno de simulación
        num_processes (int): Número total de procesos a crear
        arrival_interval (float): Intervalo promedio entre llegadas de procesos
        ram (simpy.Container): Recurso que representa la memoria RAM
        instructions_per_unit (int): Número de instrucciones ejecutadas por unidad de tiempo
        cpu (simpy.Resource): Recurso que representa el/los CPU(s)
        waiting_queue (simpy.Resource): Cola para operaciones de I/O
        processes (list): Lista de todos los procesos creados
        completed_processes (list): Lista de procesos terminados
        process_times (list): Tiempos de ejecución de los procesos
        time_series_data (list): Datos para análisis de series temporales
        
    Responsabilidad de José: Implementar esta clase con todos sus métodos para 
    modelar correctamente el ciclo de vida de los procesos.
    """
    
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
        
    Responsabilidad de José: Implementar esta función para ejecutar experimentos
    individuales correctamente.
    """
    # Implementar la configuración y ejecución de un experimento
    pass

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
        
    Responsabilidad de José: Implementar esta función para ejecutar y recopilar
    resultados de todos los experimentos solicitados.
    """
    # Implementar la ejecución de todos los experimentos
    pass


# esto la verdad es solo para probar, pero no me gusta el if name == main pero era la opcion mas viable.
if __name__ == "__main__":
    # Prueba simple
    result = run_experiment(num_processes=10, include_time_series=True)
    print(f"Tiempo promedio: {result['averageTime']}")
    print(f"Desviación estándar: {result['standardDeviation']}")
    print(f"Procesos completados: {len(result['processes'])}")
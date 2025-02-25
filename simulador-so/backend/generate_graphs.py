# Archivo para generar gráficas manualmente
from simulation import run_all_experiments
import matplotlib.pyplot as plt

# Ejecutar experimentos
results = run_all_experiments()

# Generar gráficas
# Graficar tiempos promedio por intervalo
plt.figure(figsize=(10, 6))
markers = ['o', 's', 'D']
colors = ['b', 'g', 'r']
intervals = [10, 5, 1]

for i, interval in enumerate(intervals):
    data = results[f"interval_{interval}"]
    x = [item["numProcesses"] for item in data]
    y = [item["averageTime"] for item in data]
    plt.plot(x, y, marker=markers[i], color=colors[i], label=f"Intervalo {interval}")

plt.xlabel('Número de Procesos')
plt.ylabel('Tiempo Promedio')
plt.title('Tiempo Promedio por Número de Procesos y Tasa de Llegada')
plt.legend()
plt.grid(True)
plt.savefig('graficas/grafica_intervalos.png')
plt.close()

# Graficar comparación de estrategias
plt.figure(figsize=(10, 6))

# Datos de referencia (intervalo = 10)
ref_data = results["interval_10"]
x = [item["numProcesses"] for item in ref_data]
y_ref = [item["averageTime"] for item in ref_data]

# Datos para RAM = 200
ram_data = results["ram_200"]
y_ram = [item["averageTime"] for item in ram_data]

# Datos para CPU rápido
fast_data = results["fast_cpu"]
y_fast = [item["averageTime"] for item in fast_data]

# Datos para 2 CPUs
dual_data = results["dual_cpu"]
y_dual = [item["averageTime"] for item in dual_data]

plt.plot(x, y_ref, marker='o', color='b', label='Normal (RAM=100, CPU=3, CPUs=1)')
plt.plot(x, y_ram, marker='s', color='g', label='RAM=200')
plt.plot(x, y_fast, marker='D', color='r', label='CPU Rápido (6 inst)')
plt.plot(x, y_dual, marker='^', color='purple', label='2 CPUs')

plt.xlabel('Número de Procesos')
plt.ylabel('Tiempo Promedio')
plt.title('Comparación de Estrategias')
plt.legend()
plt.grid(True)
plt.savefig('graficas/grafica_estrategias.png')
plt.close()

print("Gráficas generadas en el directorio 'graficas'")
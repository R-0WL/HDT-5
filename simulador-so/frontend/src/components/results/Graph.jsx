import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

// Registrar componentes necesarios para Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Componente personalizado para barras de error
const ErrorBar = ({ ctx, xPos, yPos, yError, color }) => {
  // Dibujar línea vertical para error
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(xPos, yPos - yError);
  ctx.lineTo(xPos, yPos + yError);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Dibujar pequeñas líneas horizontales en los extremos
  ctx.beginPath();
  ctx.moveTo(xPos - 5, yPos - yError);
  ctx.lineTo(xPos + 5, yPos - yError);
  ctx.moveTo(xPos - 5, yPos + yError);
  ctx.lineTo(xPos + 5, yPos + yError);
  ctx.stroke();
  ctx.restore();
};

const Graph = ({ url, title, colors, refreshTrigger }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8000${url}`);
        
        // Configurar datos para Chart.js
        const data = {
          labels: [25, 50, 100, 150, 200], // Números de procesos
          datasets: response.data.series.map((series, index) => ({
            label: series.name,
            data: series.data.map(point => point.y),
            backgroundColor: colors[index % colors.length],
            borderColor: colors[index % colors.length],
            borderWidth: 2,
            tension: 0.4,
            // Guardar valores de desviación estándar para uso posterior
            errorBars: series.data.map(point => point.std)
          })),
        };
        
        setChartData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching graph data:', err);
        setError('No se pudieron cargar los datos de la gráfica');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, colors, refreshTrigger]); // Añadido refreshTrigger a las dependencias

  // Resto del código sigue igual...

  if (loading) return (
    <div className="h-full flex items-center justify-center">
      <div className="text-blue-800">Cargando gráfica...</div>
    </div>
  );
  
  if (error) return (
    <div className="h-full flex items-center justify-center">
      <div className="text-red-500">{error}</div>
    </div>
  );
  
  if (!chartData) return (
    <div className="h-full flex items-center justify-center">
      <div className="text-blue-800">No hay datos disponibles</div>
    </div>
  );

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: title,
        color: 'rgb(30, 64, 175)',
        font: {
          size: 14
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y || 0;
            const std = context.dataset.errorBars[context.dataIndex] || 0;
            return `${label}: ${value.toFixed(2)} ± ${std.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Tiempo Promedio'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Número de Procesos'
        }
      }
    },
    // Plugin personalizado para dibujar barras de error
    plugins: [{
      id: 'errorBars',
      afterDatasetsDraw(chart) {
        const { ctx, scales } = chart;
        
        chart.data.datasets.forEach((dataset, datasetIndex) => {
          if (!dataset.errorBars) return;
          
          const meta = chart.getDatasetMeta(datasetIndex);
          
          meta.data.forEach((element, index) => {
            const { x, y } = element.tooltipPosition();
            const yScale = scales.y;
            const std = dataset.errorBars[index];
            
            if (std) {
              const yError = Math.abs(yScale.getPixelForValue(y + std) - yScale.getPixelForValue(y));
              ErrorBar({
                ctx,
                xPos: x,
                yPos: y,
                yError: yError,
                color: dataset.borderColor
              });
            }
          });
        });
      }
    }]
  };

  return (
    <div className="h-full w-full">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default Graph;
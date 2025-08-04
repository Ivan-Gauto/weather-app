// src/components/TemperatureChart.tsx
'use client';
import zoomPlugin from 'chartjs-plugin-zoom';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  type ChartOptions
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler
);

interface ChartDataItem {
  dt: number;
  main: {
    temp: number;
  };
}

export default function TemperatureChart({ data }: { data: ChartDataItem[] }) {
  const styles = {
    primaryColor: '#3242d3ff',
    darkColor: '#191a4bff',
    lightColor: 'rgba(255, 255, 255, 1)'
  };

  if (!data || data.length === 0) return (
    <div className="p-4 bg-blue-50 text-blue-800 rounded-lg">
      No hay datos disponibles
    </div>
  );

  const chartData = {
    labels: data.map(item => new Date(item.dt * 1000).getHours() + ':00'),
    datasets: [
      {
        label: 'Temperatura (°C)',
        data: data.map(item => Math.round(item.main.temp)),
        borderColor: styles.darkColor,
        borderWidth: 2,
        tension: 0.3,
        fill: true,
        pointBackgroundColor: styles.primaryColor,
        pointBorderColor: '#fff',
        pointHoverRadius: 8,
        pointRadius: 4,
        pointBorderWidth: 2,
      },
    ],
  };

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    zoomPlugin
  );

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      zoom: {
        pan: {
          enabled: true,
          mode: 'x',
          modifierKey: 'shift'
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true
          },
          mode: 'x',
          drag: {
            enabled: true,
            modifierKey: 'ctrl'
          },
        }
      }
    },
    scales: {
      x: {
        min: 0,
        max: 23,
        grid: {
          color: styles.lightColor,
          drawTicks: false
        },
        ticks: {
          color: styles.lightColor,
          font: {
            weight: 'bold'
          }
        }
      },
      y: {
        min: 0,
        max: 50,
        grid: {
          color: styles.lightColor,
          drawTicks: false
        },
        ticks: {
          color: styles.lightColor,
          font: {
            weight: 'bold'
          },
          callback: (value) => `${value}°C`
        }
      }
    }
  };

  return (
    <div className="w-full relative" style={{ height: '330px' }}>
      <div className="scroll-container"> {/* Cambiado el nombre de clase */}
        <div style={{ width: `${data.length * 60}px` }}> {/* Ancho dinámico basado en datos */}
          <Line
            data={chartData}
            options={options}
            className="chart-canvas" /* Añadida clase */
          />
        </div>
      </div>
    </div>
  );
}
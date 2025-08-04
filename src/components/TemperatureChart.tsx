// src/components/TemperatureChart.tsx
'use client';
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
  type ChartOptions
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
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
    lightColor: 'rgba(255, 255, 255, 1)' // Añadí transparencia para mejor visualización
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

  // Opciones con tipado correcto para Chart.js
  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: styles.lightColor,
          font: {
            weight: 'bold' as const, // Usamos 'as const' para el tipo literal
            size: 12
          },
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: styles.darkColor,
        titleFont: {
          weight: 'bold'
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: styles.lightColor,
          drawTicks: false
        },
        ticks: {
          color: styles.lightColor,
        }
      },
      y: {
        min: 10,
        max: 30,
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
    <div className="w-full" style={{ height: '300px' }}>
      <Line
        data={chartData}
        options={options}
        className="w-full h-full"
      />
    </div>
  );
}
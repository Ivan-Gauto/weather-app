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

export default function TemperatureChart({ data }: { data: any[] }) {
  const styles = {
    primaryColor: '#0077b6',
    darkColor: '#03045e',
    lightColor: '#caf0f8'
  };

  if (!data || data.length === 0) return (
    <div className="alert alert-info">No hay datos disponibles</div>
  );

  const chartData = {
    labels: data.map(item => new Date(item.dt * 1000).getHours() + ':00'),
    datasets: [
      {
        label: 'Temperatura (°C)',
        data: data.map(item => Math.round(item.main.temp)),
        borderColor: styles.darkColor,
        backgroundColor: styles.primaryColor,
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: styles.darkColor,
          font: {
            weight: 'bold'
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          color: styles.lightColor
        },
        ticks: {
          color: styles.darkColor
        }
      },
      y: {
        grid: {
          color: styles.lightColor
        },
        ticks: {
          color: styles.darkColor
        }
      }
    }
  };

  return (
    <div style={{ height: '300px' }}>
      <Line data={chartData} options={options} />
    </div>
  );
}
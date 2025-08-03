// src/components/WeeklyForecast.tsx
'use client';
import { useState, useEffect } from 'react';

export default function WeeklyForecast({ coords }: { coords: { lat: number; lon: number } }) {
  const [forecast, setForecast] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const styles = {
    primaryText: 'text-[#0077b6]',
    darkText: 'text-[#03045e]',
    borderColor: 'border-[#0077b6]/30'
  };

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&units=metric&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`);
        const data = await res.json();
        
        // Procesamiento de datos para agrupar por día
        const dailyData = data.list.reduce((acc: any, item: any) => {
          const date = new Date(item.dt * 1000).toLocaleDateString();
          if (!acc[date]) acc[date] = [];
          acc[date].push(item);
          return acc;
        }, {});
        
        setForecast(Object.entries(dailyData).slice(0, 7));
      } catch (error) {
        console.error("Error fetching forecast:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
  }, [coords]);

  if (loading) return (
    <div className={`text-center ${styles.darkText}`}>
      <div className="spinner-border spinner-border-sm" role="status">
        <span className="visually-hidden">Cargando...</span>
      </div>
    </div>
  );

  return (
    <div className="list-group list-group-flush">
      {forecast.map(([date, items]: [string, any[]], index: number) => {
        const day = new Date(date).toLocaleDateString('es-ES', { weekday: 'short' });
        const avgTemp = Math.round(items.reduce((sum: number, item: any) => sum + item.main.temp, 0) / items.length);
        const icon = items[0].weather[0].icon;
        
        return (
          <div key={index} className={`list-group-item bg-transparent d-flex justify-content-between align-items-center py-3 ${styles.borderColor}`}>
            <span className={`fw-medium ${styles.darkText}`}>
              {index === 0 ? 'Hoy' : day.charAt(0).toUpperCase() + day.slice(1)}
            </span>
            <div className="d-flex align-items-center">
              <img 
                src={`https://openweathermap.org/img/wn/${icon}.png`} 
                alt="Weather icon" 
                className="me-2"
                style={{ width: '30px', height: '30px' }}
              />
              <span className={`fw-bold ${styles.primaryText}`}>{Math.round(avgTemp)}°C</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
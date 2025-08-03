'use client';
import { useState, useEffect } from 'react';
import { traducirDescripcion } from '../utils/weatherTranslations';

interface ForecastItem {
  dt: number;  // Timestamp único
  main: {
    temp_min: number;
    temp_max: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
}

interface DailyForecast {
  id: string;       // Clave única basada en timestamp
  date: string;     // Fecha formateada
  dayName: string;  // Nombre del día
  minTemp: number;
  maxTemp: number;
  icon: string;
  description: string;
}

export default function WeeklyForecast({ coords }: { coords: { lat: number; lon: number } }) {
  const [forecast, setForecast] = useState<DailyForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/weather?lat=${coords.lat}&lon=${coords.lon}`);
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        const data = await res.json();
        if (!data?.daily || !Array.isArray(data.daily)) {
          throw new Error("Estructura de datos inválida");
        }
        const processedForecast: DailyForecast[] = data.daily.slice(0, 7).map((item: any, idx: number) => ({
          id: `day-${idx}`,
          date: item.date,
          dayName: new Date(item.date.split('/').reverse().join('-')).toLocaleDateString('es-ES', { weekday: 'long' }),
          minTemp: item.minTemp,
          maxTemp: item.maxTemp,
          icon: item.weather?.icon ?? '01d',
          description: item.weather?.description ?? 'Despejado'
        }));
        setForecast(processedForecast);
      } catch (err: any) {
        setError(err.message || "Error al obtener el pronóstico");
        setForecast([]);
      } finally {
        setLoading(false);
      }
    };
    fetchForecast();
  }, [coords]);

  if (loading) return (
    <div className="d-flex justify-content-center py-4">
      <div className="spinner-border text-info" role="status"></div>
    </div>
  );

  if (error) return (
    <div className="text-center text-info py-4">
      {error}
    </div>
  );

  return (
    <div className="d-flex flex-column gap-3">
      {forecast.map((day) => (
        <div
          key={day.id}
          className="bg-info bg-opacity-25 border border-info-subtle rounded-3 p-3 shadow-sm"
        >
          <div className="d-flex justify-content-between align-items-center">
            <span className="fw-medium text-primary">
              {day.dayName.charAt(0).toUpperCase() + day.dayName.slice(1)}
            </span>
            <div className="d-flex align-items-center gap-2">
              <span className="text-primary fw-bold">{Math.round(day.maxTemp)}°</span>
              <span className="text-info">{Math.round(day.minTemp)}°</span>
            </div>
          </div>
          <div className="d-flex align-items-center gap-2 mt-2">
            <img
              src={`https://openweathermap.org/img/wn/${day.icon}.png`}
              alt={day.description}
              style={{ width: 40, height: 40 }}
            />
            <span className="text-secondary text-capitalize ms-2">
              {traducirDescripcion(day.description)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
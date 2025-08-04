// src/components/WeeklyForecast.tsx
'use client';
import { traducirDescripcion } from '../utils/weatherTranslations';
import { ForecastDay } from '@/types/weatherTypes';

interface WeeklyForecastProps {
  dailyData?: Array<{
    dt?: number;
    temp?: {
      min?: number;
      max?: number;
    };
    weather?: Array<{
      description?: string;
      icon?: string;
    }>;
  }>;
}

export default function WeeklyForecast({ dailyData }: WeeklyForecastProps) {
  if (!dailyData || dailyData.length === 0) {
    return (
      <div className="text-center text-white py-4">
        No hay datos de pronóstico disponibles
      </div>
    );
  }

  const forecastDays: ForecastDay[] = dailyData
    .filter(day => day && day.temp && day.weather?.[0]) // Filtramos días inválidos
    .map((day, idx) => ({
      id: `day-${idx}`,
      date: day.dt ? new Date(day.dt * 1000).toLocaleDateString() : 'Fecha desconocida',
      dayName: day.dt 
        ? new Date(day.dt * 1000).toLocaleDateString('es-ES', { weekday: 'long' })
        : 'Día desconocido',
      minTemp: day.temp?.min ?? 0,
      maxTemp: day.temp?.max ?? 0,
      icon: day.weather?.[0]?.icon ?? '01d', // Icono por defecto
      description: day.weather?.[0]?.description ?? 'Despejado'
    }));

  if (forecastDays.length === 0) {
    return (
      <div className="text-center text-white py-4">
        No hay datos válidos de pronóstico
      </div>
    );
  }

  return (
    <div className="d-flex flex-column gap-3">
      {forecastDays.map((day) => (
        <div
          key={day.id}
          className="border border-info-subtle rounded-3 p-3 shadow-sm"
        >
          <div className="d-flex justify-content-between align-items-center">
            <span className="fw-medium text-white">
              {day.dayName.charAt(0).toUpperCase() + day.dayName.slice(1)}
            </span>
            <div className="d-flex align-items-center gap-2">
              <span className="text-white fw-bold">{Math.round(day.maxTemp)}°</span>
              <span className="text-info">{Math.round(day.minTemp)}°</span>
            </div>
          </div>
          <div className="d-flex align-items-center gap-2 mt-2">
            <img
              src={`https://openweathermap.org/img/wn/${day.icon}.png`}
              alt={day.description}
              style={{ width: 40, height: 40 }}
            />
            <span className="text-white text-capitalize ms-2">
              {traducirDescripcion(day.description)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
// src/app/page.tsx
'use client';
import { useState, useEffect } from 'react';
import WeatherCard from '@/components/WeatherCard';
import WeeklyForecast from '@/components/WeeklyForecast';
import TemperatureChart from '@/components/TemperatureChart';

export default function Home() {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hourlyData, setHourlyData] = useState<any[]>([]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          setCoords({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
          
          try {
            const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
            const response = await fetch(
              `https://api.openweathermap.org/data/2.5/forecast?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric&appid=${API_KEY}`
            );
            const data = await response.json();
            setHourlyData(data.list.slice(0, 8));
          } catch (err) {
            console.error("Error fetching hourly data:", err);
          }
          
          setIsLoading(false);
        },
        (err) => {
          setError(err.message);
          setIsLoading(false);
        }
      );
    } else {
      setError("Geolocalización no soportada por tu navegador");
      setIsLoading(false);
    }
  }, []);

  if (isLoading) return (
    <div className={`min-vh-100 d-flex justify-content-center align-items-center`}>
      <div className={`spinner-border text-primary`} role="status">
        <span className="visually-hidden">Cargando...</span>
      </div>
    </div>
  );

  if (error) return (
    <div className={`min-vh-100 d-flex justify-content-center align-items-center`}>
      <div className={`alert alert-danger`}>
        Error: {error}
      </div>
    </div>
  );

  if (!coords) return (
    <div className={`min-vh-100 d-flex justify-content-center align-items-center`}>
      <div className={`alert alert-warning`}>
        No se pudo obtener tu ubicación
      </div>
    </div>
  );

  return (
    <div className={`min-vh-100 bg-primary p-4`}>
      <div className="container">
        <h1 className={`text-center mb-4 text-white p-3 fw-light fs-1`}>Clima Actual</h1>
        
        <div className="row mb-4">
          {/* Tarjeta principal del clima */}
          <div className="col-lg-8 mb-4 mb-lg-0">
            <WeatherCard coords={coords} />
          </div>
          
          {/* Pronóstico semanal */}
          <div className="col-lg-4">
            <div className={`h-100 p-4`}>
              <h2 className={`h4 mb-4 text-white p-2 rounded text-center`}>Pronóstico Semanal</h2>
              <WeeklyForecast coords={coords} />
            </div>
          </div>
        </div>
        
        {/* Gráfica de temperatura */}
        <div className={`p-4`}>
          <h2 className={`h4 mb-4 text-white p-2 rounded text-center`}>Temperatura por Horas</h2>
          <TemperatureChart data={hourlyData} />
        </div>
      </div>
    </div>
  );
}
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
    if (!navigator.geolocation) {
      setError("Geolocalización no soportada");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          setCoords({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });

          const response = await fetch(`/api/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}`);

          if (!response.ok) {
            throw new Error(await response.text());
          }

          const data = await response.json();
          setHourlyData(data?.hourly?.slice(0, 8) || []);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      },
      (err) => {
        setError(err.message);
        setIsLoading(false);
      }
    );
  }, []);

  if (isLoading) return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-primary bg-opacity-25">
      <div className="spinner-border text-primary" style={{ width: 48, height: 48 }} role="status"></div>
    </div>
  );

  if (error) return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-primary bg-opacity-25 p-4">
      <div className="bg-white bg-opacity-75 p-5 rounded-4 shadow text-center border border-info-subtle">
        <h2 className="h4 fw-bold text-primary mb-2">Error</h2>
        <p className="text-info mb-0">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="min-vh-100 bg-primary py-4 px-2">
      <div className="container-lg">
        <h1 className="display-5 fw-bold text-white mb-4 text-center p-3">
          Clima Actual
        </h1>
        <div className="row g-4 mb-4">
          <div className="col-12 col-lg-8">
            {coords && <WeatherCard coords={coords} />}
            <div className="mt-4 rounded-4 p-4 border border-info-subtle shadow-lg">
              <h2 className="h5 fw-semibold white mb-3">Temperatura por Horas</h2>
              <TemperatureChart data={hourlyData} />
            </div>
          </div>
          <div className="col-12 col-lg-4">
            <div className="bg-opacity-50 rounded-4 p-4 border border-info-subtle shadow-lg h-100">
              <h2 className="h5 fw-semibold mb-3">Pronóstico Semanal</h2>
              {coords && <WeeklyForecast coords={coords} />}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
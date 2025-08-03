// src/components/WeatherCard.tsx
'use client';
import { useState, useEffect } from 'react';
import { traducirDescripcion } from '../utils/weatherTranslations';

export default function WeatherCard({ coords }: { coords: { lat: number; lon: number } }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/weather?lat=${coords.lat}&lon=${coords.lon}`);
        const json = await res.json();

        if (!res.ok) throw new Error(json.error || "Error en la API");
        if (!json.current) throw new Error("Datos incompletos");

        setData(json);
      } catch (err: any) {
        setError(err.message);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [coords]);

  if (loading) return (
    <div className="p-5 d-flex justify-content-center align-items-center">
      <div className="spinner-border " role="status">
        <span className="visually-hidden">Cargando...</span>
      </div>
    </div>
  );

  if (error) return (
    <div className="p-5 text-danger">
      {error}
    </div>
  );

  if (!data) return (
    <div className="p-5">
      No se encontraron datos climáticos
    </div>
  );

  return (
    <div className="p-4 border border-info-subtle rounded-4 shadow-sm">
      <div className="row align-items-center">
        <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
          <h2 className="mb-1 fw-bold text-white">
            {data.location}
            <span className="ms-2 ">{data.country}</span>
          </h2>
          <p className="mb-0 ">
            {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
          <div className="d-flex align-items-center justify-content-center justify-content-md-start mt-3">
            <img
              src={`https://openweathermap.org/img/wn/${data.current.weather[0].icon}@4x.png`}
              alt={data.current.weather[0].description}
              className="img-fluid"
              style={{ width: '100px', height: '100px' }}
            />
            <div>
              <p className="display-3 mb-0 fw-bold">{data.current.main.temp}°C</p>
              <p className="text-capitalize ">
                {traducirDescripcion(data.current.weather[0].description)}
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="p-3">
            <div className="row g-2">
              <div className="col-6">
                <div className="p-2 bg-opacity-50 rounded-3">
                  <p className="mb-1 small ">Sensación</p>
                  <p className="mb-0 h5">{data.current.main.feels_like}°C</p>
                </div>
              </div>
              <div className="col-6">
                <div className="p-2 bg-opacity-50 rounded-3">
                  <p className="mb-1 small ">Humedad</p>
                  <p className="mb-0 h5">{data.current.main.humidity}%</p>
                </div>
              </div>
              <div className="col-6">
                <div className="p-2 bg-opacity-50 rounded-3">
                  <p className="mb-1 small ">Viento</p>
                  <p className="mb-0 h5">{data.current.wind_speed || '--'} km/h</p>
                </div>
              </div>
              <div className="col-6">
                <div className="p-2 bg-opacity-50 rounded-3">
                  <p className="mb-1 small ">Presión</p>
                  <p className="mb-0 h5">{data.current.pressure || '--'} hPa</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
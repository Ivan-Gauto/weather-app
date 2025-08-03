'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function WeatherCard({ city }: { city: string }) {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get(`/api/weather?city=${city}`);
        setWeather(response.data);
      } catch (error) {
        console.error("Error fetching weather:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city]);

  if (loading) return <div className="text-center">Cargando...</div>;

  return (
    <div className="card">
      <div className="card-body">
        <h2 className="card-title">{city}</h2>
        {weather && (
          <>
            <p>Temperatura: {weather.main.temp}°C</p>
            <p>Humedad: {weather.main.humidity}%</p>
          </>
        )}
      </div>
    </div>
  );
}
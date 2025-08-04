// src/components/WeatherCard.tsx
'use client';
import { traducirDescripcion } from '../utils/weatherTranslations';

interface WeatherCardProps {
  currentData: {
    dt?: number;
    main?: {
      temp?: number;
      feels_like?: number;
      humidity?: number;
      pressure?: number;
    };
    weather?: Array<{
      description?: string;
      icon?: string;
    }>;
    wind_speed?: number;
  };
  location?: string;
  country?: string;
}

export default function WeatherCard({ currentData, location, country }: WeatherCardProps) {
  if (!currentData || !currentData.main || !currentData.weather) {
    return (
      <div className="p-5">
        No se encontraron datos climáticos
      </div>
    );
  }

  const date = currentData.dt 
    ? new Date(currentData.dt * 1000).toLocaleDateString('es-ES', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long' 
      })
    : '';

  return (
    <div className="p-4 border border-info-subtle rounded-4 shadow-sm">
      <div className="row align-items-center">
        <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
          <h2 className="mb-1 fw-bold text-white">
            {location || 'Ubicación desconocida'}
            {country && <span className="ms-2">{country}</span>}
          </h2>
          {date && <p className="mb-0">{date}</p>}
          
          <div className="d-flex align-items-center justify-content-center justify-content-md-start mt-3">
            {currentData.weather[0]?.icon && (
              <img
                src={`https://openweathermap.org/img/wn/${currentData.weather[0].icon}@4x.png`}
                alt={currentData.weather[0].description || 'Icono del clima'}
                className="img-fluid"
                style={{ width: '100px', height: '100px' }}
              />
            )}
            <div>
              <p className="display-3 mb-0 fw-bold">
                {currentData.main.temp !== undefined ? Math.round(currentData.main.temp) : '--'}°C
              </p>
              {currentData.weather[0]?.description && (
                <p className="text-capitalize">
                  {traducirDescripcion(currentData.weather[0].description)}
                </p>
              )}
            </div>
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="p-3">
            <div className="row g-2">
              {[
                { label: 'Sensación', value: currentData.main.feels_like, unit: '°C' },
                { label: 'Humedad', value: currentData.main.humidity, unit: '%' },
                { label: 'Viento', value: currentData.wind_speed, unit: 'km/h' },
                { label: 'Presión', value: currentData.main.pressure, unit: 'hPa' }
              ].map((item, index) => (
                <div key={index} className="col-6">
                  <div className="p-2 bg-opacity-50 rounded-3">
                    <p className="mb-1 small">{item.label}</p>
                    <p className="mb-0 h5">
                      {item.value !== undefined ? Math.round(item.value) : '--'}{item.unit}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
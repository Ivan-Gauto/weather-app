// src/types/weatherTypes.ts
export interface WeatherData {
  current: {
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      humidity: number;
      pressure: number;
      temp_min?: number;
      temp_max?: number;
    };
    weather: Array<{
      description: string;
      icon: string;
    }>;
    wind_speed: number;
  };
  hourly: Array<{
    dt: number;
    main: {
      temp: number;
    };
  }>;
  daily: Array<{
    dt: number;
    temp: {
      min: number;
      max: number;
    };
    weather: Array<{
      description: string;
      icon: string;
    }>;
  }>;
  location: string;
  country: string;
}

export interface ForecastDay {
  id: string;
  date: string;
  dayName: string;
  minTemp: number;
  maxTemp: number;
  icon: string;
  description: string;
}
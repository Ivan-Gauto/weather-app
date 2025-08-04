// src/app/api/weather/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  if (!lat || !lon) {
    return NextResponse.json(
      { error: "Coordenadas faltantes" },
      { status: 400 }
    );
  }

  const API_KEY = process.env.OPENWEATHER_API_KEY;
  if (!API_KEY) {
    return NextResponse.json(
      { error: "API key no configurada en el servidor" },
      { status: 500 }
    );
  }

  try {
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;

    const [currentRes, forecastRes] = await Promise.all([
      fetch(currentUrl),
      fetch(forecastUrl)
    ]);

    if (!currentRes.ok || !forecastRes.ok) {
      throw new Error(`Error de OpenWeather: ${currentRes.statusText || forecastRes.statusText}`);
    }

    const [currentData, forecastData] = await Promise.all([
      currentRes.json(),
      forecastRes.json()
    ]);

    // Procesamiento de datos diarios
    const dailyForecast = forecastData.list.reduce((acc: any, item: any) => {
      const date = new Date(item.dt * 1000).toLocaleDateString('es-ES');
      if (!acc[date]) {
        acc[date] = {
          dt: item.dt,
          temp: {
            min: item.main.temp_min,
            max: item.main.temp_max
          },
          weather: item.weather[0]
        };
      } else {
        if (item.main.temp_min < acc[date].temp.min) acc[date].temp.min = item.main.temp_min;
        if (item.main.temp_max > acc[date].temp.max) acc[date].temp.max = item.main.temp_max;
      }
      return acc;
    }, {});

    return NextResponse.json({
      current: {
        main: {
          temp: currentData.main?.temp,
          feels_like: currentData.main?.feels_like,
          humidity: currentData.main?.humidity,
          pressure: currentData.main?.pressure
        },
        weather: currentData.weather,
        wind_speed: currentData.wind?.speed,
        dt: currentData.dt
      },
      hourly: forecastData.list.slice(0, 24).map((item: any) => ({
        dt: item.dt,
        main: {
          temp: item.main.temp
        }
      })),
      daily: Object.values(dailyForecast).slice(0, 7),
      location: currentData.name,
      country: currentData.sys?.country
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error al obtener datos meteorológicos" },
      { status: 500 }
    );
  }
}
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

    const dailyForecast = forecastData.list.reduce((acc: any, item: any) => {
      const date = new Date(item.dt * 1000).toLocaleDateString('es-ES');
      if (!acc[date]) {
        acc[date] = {
          dt: item.dt,
          temp: {
            min: item.main.temp_min,
            max: item.main.temp_max
          },
          weather: [{
            description: item.weather[0]?.description || 'Despejado',
            icon: item.weather[0]?.icon || '01d'
          }]
        };
      } else {
        acc[date].temp.min = Math.min(acc[date].temp.min, item.main.temp_min);
        acc[date].temp.max = Math.max(acc[date].temp.max, item.main.temp_max);
      }
      return acc;
    }, {});

    const sortedDaily = Object.values(dailyForecast)
      .sort((a: any, b: any) => a.dt - b.dt)
      .slice(0, 7)
      .map((day: any) => ({
        dt: day.dt,
        temp: {
          min: day.temp.min,
          max: day.temp.max
        },
        weather: day.weather
      }));

    return NextResponse.json({
      current: {
        main: {
          temp: currentData.main?.temp,
          feels_like: currentData.main?.feels_like,
          humidity: currentData.main?.humidity,
          pressure: currentData.main?.pressure
        },
        weather: currentData.weather || [{ description: 'Despejado', icon: '01d' }],
        wind_speed: currentData.wind?.speed,
        dt: currentData.dt
      },
      hourly: forecastData.list.slice(0, 24).map((item: any) => ({
        dt: item.dt,
        main: {
          temp: item.main.temp
        }
      })),
      daily: sortedDaily,
      location: currentData.name || 'Ubicación desconocida',
      country: currentData.sys?.country || ''
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error al obtener datos meteorológicos" },
      { status: 500 }
    );
  }
}
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
      { error: "API key no configurada" },
      { status: 500 }
    );
  }

  try {
    const geoUrl = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`;
    const geoRes = await fetch(geoUrl);
    const locationData = await geoRes.json();

    if (!Array.isArray(locationData)) {
      throw new Error("Datos de ubicación inválidos");
    }

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${API_KEY}`;
    const weatherRes = await fetch(weatherUrl);
    const weatherData = await weatherRes.json();

    const response = {
      location: locationData[0]?.name || "Tu ubicación",
      country: locationData[0]?.country,
      weather: {
        temp: Math.round(weatherData.main.temp),
        feels_like: Math.round(weatherData.main.feels_like),
        humidity: weatherData.main.humidity,
        description: weatherData.weather[0]?.description || "",
        icon: weatherData.weather[0]?.icon || "01d",
        wind: weatherData.wind?.speed ? Math.round(weatherData.wind.speed * 3.6) : undefined
      }
    };

    return NextResponse.json(response);

  } catch (error: any) {
    return NextResponse.json(
      { 
        error: "Error al obtener datos climáticos",
        details: error.message
      },
      { status: 500 }
    );
  }
}
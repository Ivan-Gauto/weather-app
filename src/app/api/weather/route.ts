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
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`Error de OpenWeather: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Procesamos los datos para agrupar por día
    const dailyForecast = data.list.reduce((acc: any, item: any) => {
      const date = new Date(item.dt * 1000).toLocaleDateString('es-ES');
      if (!acc[date]) {
        acc[date] = {
          date,
          minTemp: item.main.temp_min,
          maxTemp: item.main.temp_max,
          weather: item.weather[0],
          hourly: []
        };
      }
      acc[date].hourly.push(item);
      return acc;
    }, {});

    return NextResponse.json({
      current: data.list[0],
      daily: Object.values(dailyForecast).slice(0, 7) // Próximos 7 días
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
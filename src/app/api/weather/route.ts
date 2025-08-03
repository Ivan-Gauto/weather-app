import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city');
  const API_KEY = process.env.OPENWEATHER_API_KEY;

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=es`
    );
    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json(
      { error: "Ciudad no encontrada" },
      { status: 404 }
    );
  }
}
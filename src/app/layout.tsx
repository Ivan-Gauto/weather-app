// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';

// Configuración de fuentes modernas alternativas
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Nimbus | Clima Moderno',
  description: 'Interfaz meteorológica de última generación',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`
        font-sans 
        bg-gradient-to-b from-[#caf0f8] to-[#0077b6]
        text-[#03045e]
        min-h-screen
        tracking-tight
      `}>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </body>
    </html>
  );
}

const lat = 'YOUR_LATITUDE';
const lon = 'YOUR_LONGITUDE';
const API_KEY = 'YOUR_API_KEY';
const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${API_KEY}`;

// Diccionario simple para descripciones de OpenWeather
const weatherTranslations: Record<string, string> = {
  'clear sky': 'cielo despejado',
  'few clouds': 'pocas nubes',
  'scattered clouds': 'nubes dispersas',
  'broken clouds': 'nubes rotas',
  'shower rain': 'chubascos',
  'rain': 'lluvia',
  'thunderstorm': 'tormenta',
  'snow': 'nieve',
  'mist': 'niebla',
  'overcast clouds': 'nublado',
  'light rain': 'lluvia ligera',
  'moderate rain': 'lluvia moderada',
  // Agrega más según lo que recibas de la API
};

function traducirDescripcion(desc: string) {
  return weatherTranslations[desc.toLowerCase()] || desc;
}
import WeatherCard from '@/components/WeatherCard';

export default function Home() {
  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">App del Clima</h1>
      <WeatherCard city="Madrid" />
    </div>
  );
}
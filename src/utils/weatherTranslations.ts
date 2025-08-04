export const weatherTranslations: Record<string, string> = {
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
};

export function traducirDescripcion(desc: string) {
  return weatherTranslations[desc?.toLowerCase()] || desc;
}
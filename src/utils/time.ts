import { getCalendars } from 'expo-localization';

const uses24hourClock = getCalendars()[0].uses24hourClock;

export function formatTimestamp(timestamp: Date): string {
  let date = new Date(timestamp);

  if (uses24hourClock) {
    const hours = ('0' + date.getHours()).slice(-2); // Formata as horas para terem dois dígitos
    const minutes = ('0' + date.getMinutes()).slice(-2); // Formata os minutos para terem dois dígitos
    return `${hours}:${minutes}`;
  }
  let hours = date.getHours();
  const amPm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12; // Converte as horas para o formato de 12 horas
  const formattedHours = ('0' + hours).slice(-2); // Formata as horas para terem dois dígitos
  const formattedMinutes = ('0' + date.getMinutes()).slice(-2); // Formata os minutos para terem dois dígitos
  return `${formattedHours}:${formattedMinutes} ${amPm}`;
}

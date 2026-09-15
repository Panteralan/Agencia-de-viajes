export function calculateRefundEligibility(departureDateStr: string): {
  percentage: number;
  reasonExplanation: string;
  hoursUntilTrip: number;
} {
  const now = new Date();
  const departureDate = new Date(departureDateStr);
  const diffMs = departureDate.getTime() - now.getTime();
  const hoursUntilTrip = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60)));

  if (hoursUntilTrip > 168) { // More than 7 days (7 * 24h = 168h)
    return {
      percentage: 100,
      reasonExplanation: 'Cancelación con más de 7 días de anticipación: Aplica 100% de reembolso total del importe pagado.',
      hoursUntilTrip,
    };
  } else if (hoursUntilTrip >= 48) { // Between 48 hours and 7 days
    return {
      percentage: 50,
      reasonExplanation: 'Cancelación entre 48 horas y 7 días previos al viaje: Aplica 50% de reembolso según la política comercial.',
      hoursUntilTrip,
    };
  } else { // Less than 48 hours
    return {
      percentage: 0,
      reasonExplanation: 'Cancelación a menos de 48 horas de la salida del viaje: 0% de reembolso (no reintegrable según reglamento tarifario).',
      hoursUntilTrip,
    };
  }
}

export function calculateModificationEligibility(departureDateStr: string): {
  canModify: boolean;
  feeUSD: number;
  explanation: string;
} {
  const now = new Date();
  const departureDate = new Date(departureDateStr);
  const diffMs = departureDate.getTime() - now.getTime();
  const hoursUntilTrip = Math.floor(diffMs / (1000 * 60 * 60));

  if (hoursUntilTrip < 48) {
    return {
      canModify: false,
      feeUSD: 0,
      explanation: 'Las modificaciones están bloqueadas dentro de las 48 horas previas al viaje por normativa aeroportuaria y de transporte.',
    };
  } else if (hoursUntilTrip > 168) {
    return {
      canModify: true,
      feeUSD: 20, // Tarifa reducida
      explanation: 'Modificación con más de 7 días de anticipación: Aplica tarifa administrativa reducida de $20 USD.',
    };
  } else {
    return {
      canModify: true,
      feeUSD: 55, // Tarifa estándar
      explanation: 'Modificación entre 2 y 7 días antes de la salida: Aplica penalidad estándar por cambio de $55 USD.',
    };
  }
}

export function getTimeRemaining24h(deadlineStr: string): {
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  formatted: string;
} {
  const now = new Date().getTime();
  const deadline = new Date(deadlineStr).getTime();
  const diff = deadline - now;

  if (diff <= 0) {
    return { hours: 0, minutes: 0, seconds: 0, isExpired: true, formatted: '00:00:00 (Expirado)' };
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  const pad = (n: number) => n.toString().padStart(2, '0');
  return {
    hours,
    minutes,
    seconds,
    isExpired: false,
    formatted: `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`,
  };
}

/** Data local no formato yyyy-MM-dd (toISOString usaria UTC e poderia virar o dia seguinte à noite). */
export function toLocalISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Hoje, ou segunda-feira se hoje for domingo (a barbearia fecha aos domingos). */
export function defaultBookingDate(): string {
  const d = new Date();
  if (d.getDay() === 0) d.setDate(d.getDate() + 1);
  return toLocalISODate(d);
}

export function isSunday(isoDate: string): boolean {
  const [y, m, d] = isoDate.split('-').map(Number);
  return new Date(y, m - 1, d).getDay() === 0;
}

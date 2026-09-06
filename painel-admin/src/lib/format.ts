/** Formatting helpers (pt-BR). */

const nfBRL = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
});
const nfBRL0 = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
});

export function brl(value: number): string {
  return nfBRL.format(value);
}

export function brlShort(value: number): string {
  return nfBRL0.format(Math.round(value));
}

export function brlSigned(value: number): string {
  const s = value < 0 ? '−' : '+';
  return `${s} ${nfBRL.format(Math.abs(value))}`;
}

export function pct(value: number, digits = 0): string {
  return `${value.toFixed(digits)}%`;
}

const MONTHS_PT = [
  'jan', 'fev', 'mar', 'abr', 'mai', 'jun',
  'jul', 'ago', 'set', 'out', 'nov', 'dez',
];

/** "12 mar 2026" */
export function shortDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${String(d).padStart(2, '0')} ${MONTHS_PT[m - 1]} ${y}`;
}

/** "mar 2026" from "2026-03" or an ISO date */
export function monthLabel(key: string): string {
  const [y, m] = key.split('-').map(Number);
  return `${MONTHS_PT[m - 1]} ${y}`;
}

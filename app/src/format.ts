/**
 * Brazilian currency / number formatting helpers.
 * Hand-rolled (no `Intl`) so output is identical on Hermes, JSC and web.
 */

/** 1850 -> "1.850" ; groups the integer part with "." */
function groupInt(intStr: string): string {
  return intStr.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/** 1850.4 -> "1.850,40" */
function fmt2(value: number): string {
  const abs = Math.abs(value);
  const [int, frac = '00'] = abs.toFixed(2).split('.');
  return `${groupInt(int)},${frac}`;
}

/** 1980 -> "1.980" (rounded, no decimals) */
function fmt0(value: number): string {
  return groupInt(String(Math.round(Math.abs(value))));
}

/** "R$ 1.850,00" — pass sign:'always' for "+ R$ …" / "− R$ …" */
export function brl(value: number, opts?: { sign?: 'auto' | 'always' | 'none' }): string {
  const sign = opts?.sign ?? 'none';
  const body = `R$ ${fmt2(value)}`;
  if (sign === 'none') return value < 0 ? `-${body}` : body;
  if (sign === 'always') return `${value < 0 ? '−' : '+'} ${body}`;
  return value < 0 ? `− ${body}` : body;
}

/** "R$ 1.980" — no decimals, for compact chart labels */
export function brlShort(value: number): string {
  return `R$ ${fmt0(value)}`;
}

/** "1.850,00" without the currency prefix */
export function amount2(value: number): string {
  return fmt2(value);
}

export function pct(value: number): string {
  return `${Math.round(value)}%`;
}

/** "1.850,00" / "186,40" / "8400" -> number */
export function parseAmount(input: string): number {
  const cleaned = input.trim().replace(/\s/g, '').replace(/\./g, '').replace(',', '.');
  const n = Number.parseFloat(cleaned);
  return Number.isFinite(n) ? n : 0;
}

const MONTHS_PT = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

/** The design's "today" is 2026-09-05. */
export const APP_TODAY = '2026-09-05';

/** "Hoje · 5 set" / "Ontem · 4 set" / "2 set" */
export function groupLabel(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const short = `${d} ${MONTHS_PT[m - 1]}`;
  if (iso === APP_TODAY) return `Hoje · ${short}`;
  const yesterday = shiftIso(APP_TODAY, -1);
  if (iso === yesterday) return `Ontem · ${short}`;
  return short;
}

/** "5 de setembro de 2026" */
const MONTHS_PT_LONG = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
];
export function longDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} de ${MONTHS_PT_LONG[m - 1]} de ${y}`;
}

/** "05 set 2026" */
export function shortDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${String(d).padStart(2, '0')} ${MONTHS_PT[m - 1]} ${y}`;
}

function shiftIso(iso: string, days: number): string {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + days);
  return dt.toISOString().slice(0, 10);
}

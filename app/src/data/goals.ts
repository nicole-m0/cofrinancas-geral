import { brlShort } from '@/format';
import type { Goal } from './types';

/** Progress 0..100 — uses the explicit override when present. */
export function goalPct(g: Goal): number {
  if (typeof g.pct === 'number') return Math.max(0, Math.min(100, g.pct));
  if (!g.target) return 0;
  return Math.max(0, Math.min(100, Math.round((g.current / g.target) * 100)));
}

/** "de R$ 20.000" / "meta R$ 460" / "limite R$ 6.000" */
export function goalTargetLabel(g: Goal): string {
  switch (g.type) {
    case 'Poupança com prazo':
      return `de ${brlShort(g.target)}`;
    case 'Redução de gasto':
      return `meta ${brlShort(g.target)}`;
    default:
      return `limite ${brlShort(g.target)}`;
  }
}

export function goalRight(g: Goal): string {
  return g.rightLabel ?? g.deadlineLabel ?? '';
}

/** Only savings goals accept manual contributions. */
export function goalAcceptsContribution(g: Goal): boolean {
  return g.type === 'Poupança com prazo' && !g.done;
}

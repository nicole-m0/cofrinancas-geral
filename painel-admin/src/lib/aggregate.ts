/** Derived metrics computed from the mock dataset. Pure, deterministic. */
import {
  CATEGORY_COLORS,
  MONTHS,
  goals,
  recurring,
  transactions,
  users,
} from './mock';
import { monthLabel } from './format';
import type { Goal, MonthPoint, Transaction } from './types';

export const CURRENT_MONTH = '2026-09';

export function totalUsers() {
  return users.length;
}

export function activeUsers() {
  return users.filter((u) => u.status === 'ativo').length;
}

export function aggregateBalance() {
  return users.reduce((s, u) => s + u.balance, 0);
}

export function recurringIncomePerMonth() {
  return recurring
    .filter((r) => r.kind === 'income' && r.active && r.frequency === 'Mensal')
    .reduce((s, r) => s + r.amount, 0);
}

export function avgSavingsRate() {
  return users.reduce((s, u) => s + u.savingsRate, 0) / users.length;
}

export function txInMonth(month = CURRENT_MONTH, list: Transaction[] = transactions) {
  return list.filter((t) => t.date.startsWith(month));
}

export function sumBy(list: Transaction[], kind: 'income' | 'expense') {
  return list.filter((t) => t.kind === kind).reduce((s, t) => s + t.amount, 0);
}

/** receitas × despesas per month, across the 6 tracked months */
export function monthlyEvolution(list: Transaction[] = transactions): MonthPoint[] {
  return MONTHS.map((key) => {
    const rows = list.filter((t) => t.date.startsWith(key));
    return {
      key,
      label: monthLabel(`${key}-01`).split(' ')[0],
      income: Math.round(sumBy(rows, 'income')),
      expense: Math.round(sumBy(rows, 'expense')),
    };
  });
}

export type CategoryDatum = { name: string; amount: number; pct: number; color: string; count: number };

/** expense distribution by category for a given transaction set */
export function categoryDistribution(list: Transaction[] = transactions): CategoryDatum[] {
  const map = new Map<string, { amount: number; count: number }>();
  for (const t of list) {
    if (t.kind !== 'expense') continue;
    const row = map.get(t.categoryName) ?? { amount: 0, count: 0 };
    row.amount += t.amount;
    row.count += 1;
    map.set(t.categoryName, row);
  }
  const total = [...map.values()].reduce((s, r) => s + r.amount, 0) || 1;
  return [...map.entries()]
    .map(([name, r]) => ({
      name,
      amount: r.amount,
      count: r.count,
      pct: Math.round((r.amount / total) * 100),
      color: CATEGORY_COLORS[name] ?? '#9AA0A0',
    }))
    .sort((a, b) => b.amount - a.amount);
}

export function usersRankedByBalance() {
  return [...users].sort((a, b) => b.balance - a.balance);
}

export function goalProgress(g: Goal): number {
  if (typeof g.pct === 'number') return Math.max(0, Math.min(100, g.pct));
  if (!g.target) return 0;
  return Math.max(0, Math.min(100, Math.round((g.current / g.target) * 100)));
}

export function activeGoalsCount() {
  return goals.filter((g) => !g.done).length;
}

export function goalsAtRisk() {
  return goals.filter((g) => !g.done && goalProgress(g) >= 90).length;
}

export function savingsRateByMonth(list: Transaction[] = transactions) {
  return monthlyEvolution(list).map((m) => ({
    ...m,
    rate: m.income > 0 ? Math.round(((m.income - m.expense) / m.income) * 100) : 0,
  }));
}

/**
 * Métricas financeiras derivadas — puras e determinísticas.
 * Operam sobre linhas já lidas do banco (Prisma), convertendo Decimal/Date.
 */
import type { Goal, RecurringRule, Transaction } from "@prisma/client";

import { colorFor } from "@/lib/mock";

const MONTHS_PT = [
  "jan", "fev", "mar", "abr", "mai", "jun",
  "jul", "ago", "set", "out", "nov", "dez",
];

const n = (v: unknown): number => Number(v as never);
const ymd = (d: Date): string => d.toISOString().slice(0, 10);
const ym = (d: Date): string => ymd(d).slice(0, 7);

export type TxLike = Pick<Transaction, "kind" | "categoryName" | "date"> & { amount: number | { toString(): string } };

export function txAmount(t: { amount: unknown }): number {
  return n(t.amount);
}

/** Saldo acumulado (todas as transações): Σ receitas − Σ despesas. */
export function balanceOf(txs: Transaction[]): number {
  return txs.reduce((s, t) => s + (t.kind === "income" ? n(t.amount) : -n(t.amount)), 0);
}

export function sumKind(txs: Transaction[], kind: "income" | "expense"): number {
  return txs.filter((t) => t.kind === kind).reduce((s, t) => s + n(t.amount), 0);
}

export function savingsRate(income: number, expense: number): number {
  return income > 0 ? Math.round(((income - expense) / income) * 100) : 0;
}

/** Primeiro e último instante do mês de `ref`. */
export function monthWindow(ref = new Date()): { start: Date; end: Date; key: string } {
  const start = new Date(Date.UTC(ref.getUTCFullYear(), ref.getUTCMonth(), 1));
  const end = new Date(Date.UTC(ref.getUTCFullYear(), ref.getUTCMonth() + 1, 1));
  return { start, end, key: ym(start) };
}

export function inMonth(txs: Transaction[], ref = new Date()): Transaction[] {
  const { start, end } = monthWindow(ref);
  return txs.filter((t) => t.date >= start && t.date < end);
}

export type MonthPoint = { key: string; label: string; income: number; expense: number };

/** Receitas × despesas dos últimos `count` meses (mais antigo → mais novo). */
export function monthlyEvolution(txs: Transaction[], count = 6, ref = new Date()): MonthPoint[] {
  const out: MonthPoint[] = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(Date.UTC(ref.getUTCFullYear(), ref.getUTCMonth() - i, 1));
    const next = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1));
    const rows = txs.filter((t) => t.date >= d && t.date < next);
    out.push({
      key: ym(d),
      label: MONTHS_PT[d.getUTCMonth()],
      income: Math.round(sumKind(rows, "income")),
      expense: Math.round(sumKind(rows, "expense")),
    });
  }
  return out;
}

export type CategoryDatum = {
  name: string;
  amount: number;
  pct: number;
  color: string;
  count: number;
};

/** Distribuição de DESPESAS por categoria. `colors` opcional sobrepõe o mapa padrão. */
export function categoryDistribution(
  txs: Transaction[],
  colors: Record<string, string> = {},
): CategoryDatum[] {
  const map = new Map<string, { amount: number; count: number }>();
  for (const t of txs) {
    if (t.kind !== "expense") continue;
    const row = map.get(t.categoryName) ?? { amount: 0, count: 0 };
    row.amount += n(t.amount);
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
      color: colors[name] ?? colorFor(name),
    }))
    .sort((a, b) => b.amount - a.amount);
}

export type TxGroup = { key: string; label: string; total: number; items: Transaction[] };

const APP_TODAY_LABEL = (iso: string): string => {
  const [, m, d] = iso.split("-").map(Number);
  const short = `${d} ${MONTHS_PT[m - 1]}`;
  const today = ymd(new Date());
  const y = new Date();
  y.setUTCDate(y.getUTCDate() - 1);
  if (iso === today) return `Hoje · ${short}`;
  if (iso === ymd(y)) return `Ontem · ${short}`;
  return short;
};

/** Agrupa transações por dia, mais recente primeiro. */
export function groupByDate(txs: Transaction[]): TxGroup[] {
  const byDate = new Map<string, Transaction[]>();
  for (const t of txs) {
    const key = ymd(t.date);
    const list = byDate.get(key) ?? [];
    list.push(t);
    byDate.set(key, list);
  }
  return [...byDate.entries()]
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .map(([key, items]) => ({
      key,
      label: APP_TODAY_LABEL(key),
      total: items.reduce((s, t) => s + (t.kind === "expense" ? -n(t.amount) : n(t.amount)), 0),
      items,
    }));
}

export type UpcomingBill = {
  id: string;
  title: string;
  meta: string;
  amount: number;
  kind: "income" | "expense";
  icon: string;
  color: string;
  tint: string;
};

type CatMeta = { name: string; color: string; tint: string; icon: string };

/** "A vencer" a partir das regras recorrentes ativas, ordenado por data. */
export function upcomingFromRecurring(
  rules: RecurringRule[],
  categories: CatMeta[] = [],
): UpcomingBill[] {
  const metaBy = new Map(categories.map((c) => [c.name, c]));
  return rules
    .filter((r) => r.active)
    .slice()
    .sort((a, b) => {
      const da = a.nextDate ? a.nextDate.getTime() : Infinity;
      const db = b.nextDate ? b.nextDate.getTime() : Infinity;
      return da - db;
    })
    .slice(0, 6)
    .map((r) => {
      const m = metaBy.get(r.categoryName);
      return {
        id: r.id,
        title: r.name,
        meta: `${r.nextDate ? ymd(r.nextDate) : r.frequency} · ${r.categoryName}`,
        amount: r.kind === "income" ? n(r.amount) : -n(r.amount),
        kind: r.kind,
        icon: m?.icon ?? (r.kind === "income" ? "briefcase" : "wallet"),
        color: m?.color ?? colorFor(r.categoryName),
        tint: m?.tint ?? "#EFEFEE",
      };
    });
}

export function goalProgress(g: Pick<Goal, "pct" | "current" | "target">): number {
  if (typeof g.pct === "number") return Math.max(0, Math.min(100, g.pct));
  const target = n(g.target);
  if (!target) return 0;
  return Math.max(0, Math.min(100, Math.round((n(g.current) / target) * 100)));
}

/**
 * Domain types for Saldo.
 *
 * Field names are kept in sync with the admin panel (`painel-admin/src/lib/types.ts`)
 * so swapping the mock module for a real API later is a drop-in change.
 */
import type { IconName } from '@/icons';

export type TxKind = 'expense' | 'income';

export interface Category {
  id: string;
  name: string;
  kind: TxKind;
  icon: IconName;
  color: string;
  tint: string;
  /** e.g. "18 lançamentos" / "4 recorrentes" */
  sub?: string;
}

export interface Transaction {
  id: string;
  title: string;
  /** always positive; the sign is derived from `kind` */
  amount: number;
  kind: TxKind;
  categoryName: string;
  /** ISO yyyy-mm-dd */
  date: string;
  recurring: boolean;
  account?: string;
}

export type GoalType =
  | 'Poupança com prazo'
  | 'Redução de gasto'
  | 'Limite de gasto'
  | 'Limite por categoria';

export interface GoalEntry {
  id: string;
  title: string;
  meta: string;
  /** signed */
  amount: number;
}

export interface Goal {
  id: string;
  title: string;
  type: GoalType;
  current: number;
  target: number;
  color: string;
  /** explicit progress override (0..100) for goals whose % is not current/target */
  pct?: number;
  /** e.g. "até dez 2026" / "set 2026" */
  deadlineLabel?: string;
  /** e.g. "−20% vs. jul" */
  rightLabel?: string;
  done?: boolean;
  doneLabel?: string;
  categoryName?: string;
  history?: GoalEntry[];
  /** projection copy shown on the detail screen */
  projection?: string;
  projectionTitle?: string;
  /** suggested monthly contribution (detail screen stat) */
  monthly?: number;
  /** e.g. "4 meses" */
  termLabel?: string;
}

export type Frequency = 'Mensal' | 'Semanal' | 'Quinzenal' | 'Anual';

export interface RecurringRule {
  id: string;
  name: string;
  kind: TxKind;
  amount: number;
  frequency: Frequency;
  /** e.g. "dia 5 · Moradia" */
  sub: string;
  categoryName: string;
  active: boolean;
}

export interface UpcomingBill {
  id: string;
  title: string;
  meta: string;
  /** signed */
  amount: number;
  kind: TxKind;
  icon: IconName;
  color: string;
  tint: string;
}

export interface CategorySpend {
  name: string;
  amount: number;
  pct: number;
  color: string;
}

export interface MonthPoint {
  label: string;
  /** relative bar heights, 0..100, matching the design's chart scale */
  income: number;
  expense: number;
}

export interface Profile {
  name: string;
  firstName: string;
  email: string;
  initials: string;
  monthLabel: string;
}

export type ChartStyle = 'donut' | 'bars';

export interface NotificationPrefs {
  dueBill: boolean;
  goalLimit80: boolean;
  weeklyDigest: boolean;
}

export interface Balance {
  current: number;
  income: number;
  expense: number;
  savedPct: number;
}

/**
 * Domain types for the Cofrinanças admin panel.
 *
 * Field names mirror the app (`app/src/data/types.ts`) so that, once a real
 * backend exists, both clients can share it without reshaping data.
 */

export type TxKind = 'expense' | 'income';
export type UserStatus = 'ativo' | 'inativo';

export type GoalType =
  | 'Poupança com prazo'
  | 'Redução de gasto'
  | 'Limite de gasto'
  | 'Limite por categoria';

export type Frequency = 'Mensal' | 'Semanal' | 'Quinzenal' | 'Anual';

export interface Category {
  id: string;
  name: string;
  kind: TxKind;
  color: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  initials: string;
  status: UserStatus;
  /** ISO yyyy-mm-dd */
  joinedAt: string;
  city: string;
  plan: 'Gratuito' | 'Pro';
  balance: number;
  monthIncome: number;
  monthExpense: number;
  savingsRate: number;
}

export interface Transaction {
  id: string;
  userId: string;
  title: string;
  /** always positive; sign derived from `kind` */
  amount: number;
  kind: TxKind;
  categoryName: string;
  /** ISO yyyy-mm-dd */
  date: string;
  recurring: boolean;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  type: GoalType;
  current: number;
  target: number;
  /** explicit progress override (0..100) when it is not current/target */
  pct?: number;
  color: string;
  deadlineLabel?: string;
  done?: boolean;
  categoryName?: string;
}

export interface RecurringRule {
  id: string;
  userId: string;
  name: string;
  kind: TxKind;
  amount: number;
  frequency: Frequency;
  categoryName: string;
  active: boolean;
  /** ISO yyyy-mm-dd */
  nextDate: string;
}

export interface MonthPoint {
  /** yyyy-mm */
  key: string;
  label: string;
  income: number;
  expense: number;
}

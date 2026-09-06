/**
 * In-memory finance store. No persistence — state resets on reload.
 * This is the "mock data" layer the whole app reads and writes through.
 */
import React, { createContext, useContext, useMemo, useReducer } from 'react';

import { groupLabel } from '@/format';
import * as seed from './mock';
import type {
  Balance,
  Category,
  CategorySpend,
  ChartStyle,
  Frequency,
  Goal,
  GoalType,
  NotificationPrefs,
  RecurringRule,
  Transaction,
  TxKind,
} from './types';

const SEED_TX_IDS = new Set(seed.transactions.map((t) => t.id));

type State = {
  transactions: Transaction[];
  goals: Goal[];
  goalsDone: Goal[];
  categories: Category[];
  recurring: RecurringRule[];
  notifications: NotificationPrefs;
  chartStyle: ChartStyle;
  balanceHidden: boolean;
  showTags: boolean;
};

const initialState: State = {
  transactions: [...seed.transactions],
  goals: seed.goals.map((g) => ({ ...g })),
  goalsDone: seed.goalsDone.map((g) => ({ ...g })),
  categories: [...seed.categories],
  recurring: [...seed.recurring],
  notifications: { ...seed.notifications },
  chartStyle: 'donut',
  balanceHidden: false,
  showTags: true,
};

type NewTx = {
  amount: number;
  description: string;
  categoryName: string;
  date: string;
  recurring?: boolean;
  frequency?: Frequency;
};

type Action =
  | { type: 'addTransaction'; kind: TxKind; payload: NewTx }
  | { type: 'addGoal'; payload: { title: string; goalType: GoalType; target: number; categoryName?: string; color?: string } }
  | { type: 'contributeToGoal'; payload: { goalId: string; amount: number } }
  | { type: 'addCategory'; payload: { name: string; kind: TxKind; color: string } }
  | { type: 'deleteCategory'; payload: { id: string } }
  | { type: 'toggleRecurring'; payload: { id: string } }
  | { type: 'toggleNotification'; payload: { key: keyof NotificationPrefs } }
  | { type: 'setChartStyle'; payload: ChartStyle }
  | { type: 'toggleBalanceHidden' }
  | { type: 'setShowTags'; payload: boolean };

let uid = 0;
const nextId = (p: string) => `${p}-new-${Date.now().toString(36)}-${uid++}`;

const TINT_FOR_COLOR: Record<string, string> = {
  '#3E5C76': '#ECF0F4',
  '#0F7A56': '#E4F1EB',
  '#5B5BD6': '#EDEDFB',
  '#C0512F': '#FBEAE4',
  '#C08A2F': '#F7EFDF',
  '#2E8B8B': '#E6F2F2',
  '#9AA0A0': '#EFEFEE',
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'addTransaction': {
      const p = action.payload;
      const tx: Transaction = {
        id: nextId('t'),
        title: p.description || (action.kind === 'income' ? 'Receita' : 'Despesa'),
        amount: Math.abs(p.amount),
        kind: action.kind,
        categoryName: p.categoryName,
        date: p.date,
        recurring: !!p.recurring,
      };
      const next: State = { ...state, transactions: [tx, ...state.transactions] };
      if (p.recurring) {
        next.recurring = [
          {
            id: nextId('r'),
            name: tx.title,
            kind: tx.kind,
            amount: tx.amount,
            frequency: p.frequency ?? 'Mensal',
            sub: `${p.frequency ?? 'Mensal'} · ${p.categoryName}`,
            categoryName: p.categoryName,
            active: true,
          },
          ...state.recurring,
        ];
      }
      return next;
    }

    case 'addGoal': {
      const { title, goalType, target, categoryName, color } = action.payload;
      const goal: Goal = {
        id: nextId('g'),
        title: title || 'Nova meta',
        type: goalType,
        current: 0,
        target: target || 0,
        color: color ?? '#0F7A56',
        deadlineLabel: 'set 2026',
        categoryName,
        history: [],
      };
      return { ...state, goals: [goal, ...state.goals] };
    }

    case 'contributeToGoal': {
      const { goalId, amount } = action.payload;
      return {
        ...state,
        goals: state.goals.map((g) =>
          g.id === goalId
            ? {
                ...g,
                current: g.current + amount,
                history: [
                  { id: nextId('h'), title: 'Aporte manual', meta: 'agora · Transferência', amount },
                  ...(g.history ?? []),
                ],
              }
            : g,
        ),
      };
    }

    case 'addCategory': {
      const { name, kind, color } = action.payload;
      const cat: Category = {
        id: nextId('c'),
        name: name || 'Categoria',
        kind,
        icon: 'film',
        color,
        tint: TINT_FOR_COLOR[color] ?? '#F1EFEA',
        sub: '0 lançamentos',
      };
      return { ...state, categories: [...state.categories, cat] };
    }

    case 'deleteCategory':
      return { ...state, categories: state.categories.filter((c) => c.id !== action.payload.id) };

    case 'toggleRecurring':
      return {
        ...state,
        recurring: state.recurring.map((r) =>
          r.id === action.payload.id ? { ...r, active: !r.active } : r,
        ),
      };

    case 'toggleNotification':
      return {
        ...state,
        notifications: {
          ...state.notifications,
          [action.payload.key]: !state.notifications[action.payload.key],
        },
      };

    case 'setChartStyle':
      return { ...state, chartStyle: action.payload };

    case 'toggleBalanceHidden':
      return { ...state, balanceHidden: !state.balanceHidden };

    case 'setShowTags':
      return { ...state, showTags: action.payload };

    default:
      return state;
  }
}

export type TxGroup = { key: string; label: string; total: number; items: Transaction[] };

type FinanceValue = State & {
  balance: Balance;
  groupedTransactions: TxGroup[];
  categorySpend: CategorySpend[];
  addExpense: (tx: NewTx) => void;
  addIncome: (tx: NewTx) => void;
  addGoal: (g: { title: string; goalType: GoalType; target: number; categoryName?: string; color?: string }) => void;
  contributeToGoal: (goalId: string, amount: number) => void;
  addCategory: (c: { name: string; kind: TxKind; color: string }) => void;
  deleteCategory: (id: string) => void;
  toggleRecurring: (id: string) => void;
  toggleNotification: (key: keyof NotificationPrefs) => void;
  setChartStyle: (style: ChartStyle) => void;
  toggleBalanceHidden: () => void;
  setShowTags: (v: boolean) => void;
  getGoal: (id: string) => Goal | undefined;
};

const FinanceContext = createContext<FinanceValue | null>(null);

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value = useMemo<FinanceValue>(() => {
    const sessionTx = state.transactions.filter((t) => !SEED_TX_IDS.has(t.id));
    const deltaIncome = sessionTx.filter((t) => t.kind === 'income').reduce((s, t) => s + t.amount, 0);
    const deltaExpense = sessionTx.filter((t) => t.kind === 'expense').reduce((s, t) => s + t.amount, 0);

    const income = seed.balance.income + deltaIncome;
    const expense = seed.balance.expense + deltaExpense;
    const balance: Balance = {
      current: seed.balance.current + deltaIncome - deltaExpense,
      income,
      expense,
      savedPct: income > 0 ? Math.max(0, Math.round(((income - expense) / income) * 100)) : 0,
    };

    // group transactions by date, newest first
    const byDate = new Map<string, Transaction[]>();
    for (const t of state.transactions) {
      const list = byDate.get(t.date) ?? [];
      list.push(t);
      byDate.set(t.date, list);
    }
    const groupedTransactions: TxGroup[] = [...byDate.entries()]
      .sort((a, b) => (a[0] < b[0] ? 1 : -1))
      .map(([key, items]) => ({
        key,
        label: groupLabel(key),
        total: items.reduce((s, t) => s + (t.kind === 'expense' ? -t.amount : t.amount), 0),
        items,
      }));

    // categorySpend = curated seed + session expense deltas per category
    const spendMap = new Map(seed.categorySpend.map((c) => [c.name, { ...c }]));
    for (const t of sessionTx) {
      if (t.kind !== 'expense') continue;
      const key = spendMap.has(t.categoryName) ? t.categoryName : 'Outros';
      const row = spendMap.get(key);
      if (row) row.amount += t.amount;
    }
    const spendRows = [...spendMap.values()].sort((a, b) => b.amount - a.amount);
    const spendTotal = spendRows.reduce((s, r) => s + r.amount, 0) || 1;
    const categorySpend: CategorySpend[] = spendRows.map((r) => ({
      ...r,
      pct: Math.round((r.amount / spendTotal) * 100),
    }));

    return {
      ...state,
      balance,
      groupedTransactions,
      categorySpend,
      addExpense: (tx) => dispatch({ type: 'addTransaction', kind: 'expense', payload: tx }),
      addIncome: (tx) => dispatch({ type: 'addTransaction', kind: 'income', payload: tx }),
      addGoal: (g) => dispatch({ type: 'addGoal', payload: g }),
      contributeToGoal: (goalId, amount) =>
        dispatch({ type: 'contributeToGoal', payload: { goalId, amount } }),
      addCategory: (c) => dispatch({ type: 'addCategory', payload: c }),
      deleteCategory: (id) => dispatch({ type: 'deleteCategory', payload: { id } }),
      toggleRecurring: (id) => dispatch({ type: 'toggleRecurring', payload: { id } }),
      toggleNotification: (key) => dispatch({ type: 'toggleNotification', payload: { key } }),
      setChartStyle: (style) => dispatch({ type: 'setChartStyle', payload: style }),
      toggleBalanceHidden: () => dispatch({ type: 'toggleBalanceHidden' }),
      setShowTags: (v) => dispatch({ type: 'setShowTags', payload: v }),
      getGoal: (id) => [...state.goals, ...state.goalsDone].find((g) => g.id === id),
    };
  }, [state]);

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

export function useFinance(): FinanceValue {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error('useFinance must be used within <FinanceProvider>');
  return ctx;
}

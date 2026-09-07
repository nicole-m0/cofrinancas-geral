/**
 * Estado financeiro do app — agora servido pela API (painel-admin).
 * A superfície de `useFinance()` é a mesma de antes: as telas não mudam.
 */
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { apiRequest } from './api';
import { useAuth } from './auth';
import type {
  Balance,
  Category,
  CategorySpend,
  ChartStyle,
  Frequency,
  Goal,
  GoalType,
  MonthPoint,
  NotificationPrefs,
  Profile,
  RecurringRule,
  Transaction,
  TxKind,
  UpcomingBill,
} from './types';

export type NewTx = {
  amount: number;
  description: string;
  categoryName: string;
  date: string;
  recurring?: boolean;
  frequency?: Frequency;
};

export type TxGroup = { key: string; label: string; total: number; items: Transaction[] };

type DashboardResponse = {
  profile: Profile;
  balance: Balance;
  categorySpend: CategorySpend[];
  months: MonthPoint[];
  groupedTransactions: TxGroup[];
  upcoming: UpcomingBill[];
  goals: Goal[];
};

type PreferencesResponse = {
  notifications: NotificationPrefs;
  chartStyle: ChartStyle;
  balanceHidden: boolean;
  showTags: boolean;
};

const EMPTY_BALANCE: Balance = { current: 0, income: 0, expense: 0, savedPct: 0 };
const EMPTY_PROFILE: Profile = {
  name: '',
  firstName: '',
  email: '',
  initials: '',
  monthLabel: '',
};

type FinanceValue = {
  loading: boolean;
  profile: Profile;
  balance: Balance;
  categorySpend: CategorySpend[];
  months: MonthPoint[];
  upcoming: UpcomingBill[];
  groupedTransactions: TxGroup[];
  transactions: Transaction[];
  goals: Goal[];
  goalsDone: Goal[];
  categories: Category[];
  recurring: RecurringRule[];
  notifications: NotificationPrefs;
  chartStyle: ChartStyle;
  balanceHidden: boolean;
  showTags: boolean;

  refresh: () => Promise<void>;
  addExpense: (tx: NewTx) => Promise<void>;
  addIncome: (tx: NewTx) => Promise<void>;
  addGoal: (g: {
    title: string;
    goalType: GoalType;
    target: number;
    categoryName?: string;
    color?: string;
  }) => Promise<void>;
  contributeToGoal: (goalId: string, amount: number) => Promise<void>;
  addCategory: (c: { name: string; kind: TxKind; color: string }) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  toggleRecurring: (id: string) => void;
  toggleNotification: (key: keyof NotificationPrefs) => void;
  setChartStyle: (style: ChartStyle) => void;
  toggleBalanceHidden: () => void;
  setShowTags: (v: boolean) => void;
  getGoal: (id: string) => Goal | undefined;
};

const FinanceContext = createContext<FinanceValue | null>(null);

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const { status, token } = useAuth();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile>(EMPTY_PROFILE);
  const [balance, setBalance] = useState<Balance>(EMPTY_BALANCE);
  const [categorySpend, setCategorySpend] = useState<CategorySpend[]>([]);
  const [months, setMonths] = useState<MonthPoint[]>([]);
  const [upcoming, setUpcoming] = useState<UpcomingBill[]>([]);
  const [groups, setGroups] = useState<TxGroup[]>([]);
  const [allGoals, setAllGoals] = useState<Goal[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [recurring, setRecurring] = useState<RecurringRule[]>([]);
  const [notifications, setNotifications] = useState<NotificationPrefs>({
    dueBill: true,
    goalLimit80: true,
    weeklyDigest: false,
  });
  const [chartStyle, setChartStyleState] = useState<ChartStyle>('donut');
  const [balanceHidden, setBalanceHidden] = useState(false);
  const [showTags, setShowTagsState] = useState(true);

  const tokenRef = useRef<string | null>(null);
  useEffect(() => {
    tokenRef.current = token;
  }, [token]);

  const call = useCallback(
    <T,>(path: string, opts: { method?: string; body?: unknown } = {}) =>
      apiRequest<T>(path, { ...opts, token: tokenRef.current }),
    [],
  );

  const refresh = useCallback(async () => {
    if (!tokenRef.current) return;
    setLoading(true);
    try {
      const [dash, prefs, cats, recs] = await Promise.all([
        call<DashboardResponse>('/api/dashboard'),
        call<PreferencesResponse>('/api/preferences'),
        call<Category[]>('/api/categories'),
        call<RecurringRule[]>('/api/recurring'),
      ]);
      setProfile(dash.profile);
      setBalance(dash.balance);
      setCategorySpend(dash.categorySpend);
      setMonths(dash.months);
      setUpcoming(dash.upcoming);
      setGroups(dash.groupedTransactions);
      setAllGoals(dash.goals);
      setNotifications(prefs.notifications);
      setChartStyleState(prefs.chartStyle);
      setBalanceHidden(prefs.balanceHidden);
      setShowTagsState(prefs.showTags);
      setCategories(cats);
      setRecurring(recs);
    } finally {
      setLoading(false);
    }
  }, [call]);

  // O provider é remontado (via `key`) quando a identidade do usuário muda,
  // então o estado inicial já vem "zerado" — não precisamos limpar na mão.
  useEffect(() => {
    if (status === 'authed') void refresh();
  }, [status, refresh]);

  // ---- mutações ----
  const addTransaction = useCallback(
    async (kind: TxKind, p: NewTx) => {
      await call('/api/transactions', {
        method: 'POST',
        body: {
          title: p.description || (kind === 'income' ? 'Receita' : 'Despesa'),
          amount: Math.abs(p.amount),
          kind,
          categoryName: p.categoryName,
          date: p.date,
          recurring: !!p.recurring,
          ...(p.recurring ? { frequency: p.frequency ?? 'Mensal' } : {}),
        },
      });
      await refresh();
    },
    [call, refresh],
  );

  const value = useMemo<FinanceValue>(() => {
    const transactions = groups.flatMap((g) => g.items);
    const goals = allGoals.filter((g) => !g.done);
    const goalsDone = allGoals.filter((g) => g.done);

    const patchPrefs = (body: Record<string, unknown>) => {
      call('/api/preferences', { method: 'PATCH', body }).catch(() => void refresh());
    };

    return {
      loading,
      profile,
      balance,
      categorySpend,
      months,
      upcoming,
      groupedTransactions: groups,
      transactions,
      goals,
      goalsDone,
      categories,
      recurring,
      notifications,
      chartStyle,
      balanceHidden,
      showTags,

      refresh,
      addExpense: (tx) => addTransaction('expense', tx),
      addIncome: (tx) => addTransaction('income', tx),
      addGoal: async (g) => {
        await call('/api/goals', {
          method: 'POST',
          body: {
            title: g.title,
            type: g.goalType,
            target: g.target,
            ...(g.categoryName ? { categoryName: g.categoryName } : {}),
            ...(g.color ? { color: g.color } : {}),
          },
        });
        await refresh();
      },
      contributeToGoal: async (goalId, amount) => {
        await call(`/api/goals/${goalId}/contribute`, { method: 'POST', body: { amount } });
        await refresh();
      },
      addCategory: async (c) => {
        await call('/api/categories', { method: 'POST', body: c });
        await refresh();
      },
      deleteCategory: async (id) => {
        await call(`/api/categories/${id}`, { method: 'DELETE' });
        await refresh();
      },
      toggleRecurring: (id) => {
        const rule = recurring.find((r) => r.id === id);
        if (!rule) return;
        const next = !rule.active;
        setRecurring((list) => list.map((r) => (r.id === id ? { ...r, active: next } : r)));
        call(`/api/recurring/${id}`, { method: 'PATCH', body: { active: next } }).catch(
          () => void refresh(),
        );
      },
      toggleNotification: (key) => {
        const next = !notifications[key];
        setNotifications((n) => ({ ...n, [key]: next }));
        patchPrefs({ notifications: { [key]: next } });
      },
      setChartStyle: (style) => {
        setChartStyleState(style);
        patchPrefs({ chartStyle: style });
      },
      toggleBalanceHidden: () => {
        const next = !balanceHidden;
        setBalanceHidden(next);
        patchPrefs({ balanceHidden: next });
      },
      setShowTags: (v) => {
        setShowTagsState(v);
        patchPrefs({ showTags: v });
      },
      getGoal: (id) => allGoals.find((g) => g.id === id),
    };
  }, [
    loading,
    profile,
    balance,
    categorySpend,
    months,
    upcoming,
    groups,
    allGoals,
    categories,
    recurring,
    notifications,
    chartStyle,
    balanceHidden,
    showTags,
    refresh,
    call,
    addTransaction,
  ]);

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

export function useFinance(): FinanceValue {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error('useFinance must be used within <FinanceProvider>');
  return ctx;
}

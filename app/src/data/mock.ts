/**
 * Mock dataset — ported verbatim from the Claude Design project
 * "Finanças Pessoais - App" (`renderVals()` plus the values baked into the markup).
 *
 * No backend: this is the single source of truth the in-memory store is seeded from.
 */
import type {
  Balance,
  Category,
  CategorySpend,
  Goal,
  MonthPoint,
  NotificationPrefs,
  Profile,
  RecurringRule,
  Transaction,
  UpcomingBill,
} from './types';

export const profile: Profile = {
  name: 'Marina Alcântara',
  firstName: 'Marina',
  email: 'marina@studiovetro.co',
  initials: 'M',
  monthLabel: 'Setembro 2026',
};

export const balance: Balance = {
  current: 14286.4,
  income: 9600,
  expense: 5209,
  savedPct: 45,
};

export const categories: Category[] = [
  { id: 'c-mercado', name: 'Mercado', kind: 'expense', icon: 'cart', color: '#0F7A56', tint: '#E4F1EB', sub: '18 lançamentos' },
  { id: 'c-moradia', name: 'Moradia', kind: 'expense', icon: 'house', color: '#3E5C76', tint: '#ECF0F4', sub: '4 recorrentes' },
  { id: 'c-transporte', name: 'Transporte', kind: 'expense', icon: 'car', color: '#5B5BD6', tint: '#EDEDFB', sub: '9 lançamentos' },
  { id: 'c-delivery', name: 'Delivery', kind: 'expense', icon: 'bag', color: '#C0512F', tint: '#FBEAE4', sub: '12 lançamentos' },
  { id: 'c-lazer', name: 'Lazer', kind: 'expense', icon: 'film', color: '#C08A2F', tint: '#F7EFDF', sub: '6 lançamentos' },
  { id: 'c-saude', name: 'Saúde', kind: 'expense', icon: 'heart', color: '#2E8B8B', tint: '#E6F2F2', sub: '3 recorrentes' },
  { id: 'c-salario', name: 'Salário', kind: 'income', icon: 'briefcase', color: '#0F7A56', tint: '#E4F1EB', sub: '1 recorrente' },
  { id: 'c-freelance', name: 'Freelance', kind: 'income', icon: 'wallet', color: '#3E5C76', tint: '#ECF0F4', sub: '5 lançamentos' },
  { id: 'c-investimentos', name: 'Investimentos', kind: 'income', icon: 'chart', color: '#5B5BD6', tint: '#EDEDFB', sub: '2 lançamentos' },
];

/** Curated month-view breakdown used by the dashboard donut / reports bars */
export const categorySpend: CategorySpend[] = [
  { name: 'Moradia', amount: 1980, pct: 38, color: '#3E5C76' },
  { name: 'Mercado', amount: 1146, pct: 22, color: '#0F7A56' },
  { name: 'Transporte', amount: 729, pct: 14, color: '#5B5BD6' },
  { name: 'Delivery', amount: 573, pct: 11, color: '#C0512F' },
  { name: 'Lazer', amount: 469, pct: 9, color: '#C08A2F' },
  { name: 'Outros', amount: 312, pct: 6, color: '#9AA0A0' },
];

export const upcoming: UpcomingBill[] = [
  { id: 'u-aluguel', title: 'Aluguel', meta: '05 set · Moradia', amount: -1850, kind: 'expense', icon: 'house', color: '#3E5C76', tint: '#ECF0F4' },
  { id: 'u-salario', title: 'Salário', meta: '05 set · Trabalho', amount: 8400, kind: 'income', icon: 'briefcase', color: '#0F7A56', tint: '#E4F1EB' },
  { id: 'u-internet', title: 'Internet fibra', meta: '07 set · Casa', amount: -129.9, kind: 'expense', icon: 'wifi', color: '#5B5BD6', tint: '#EDEDFB' },
  { id: 'u-academia', title: 'Academia', meta: '10 set · Saúde', amount: -119, kind: 'expense', icon: 'heart', color: '#2E8B8B', tint: '#E6F2F2' },
];

export const goals: Goal[] = [
  {
    id: 'g-reserva',
    title: 'Reserva de emergência',
    type: 'Poupança com prazo',
    current: 12800,
    target: 20000,
    color: '#0F7A56',
    deadlineLabel: 'até dez 2026',
    projectionTitle: 'Projeção: meta atingida em nov 2026',
    projection:
      'No ritmo atual de R$ 900/mês, você chega a R$ 20.000 um mês antes do prazo. Para garantir, mantenha aportes acima de R$ 720/mês.',
    monthly: 720,
    termLabel: '4 meses',
    history: [
      { id: 'h1', title: 'Aporte manual', meta: '28 ago · Transferência', amount: 1200 },
      { id: 'h2', title: 'Aporte automático', meta: '05 ago · Recorrente', amount: 800 },
      { id: 'h3', title: 'Resgate parcial', meta: '19 jul · Ajuste', amount: -350 },
      { id: 'h4', title: 'Aporte automático', meta: '05 jul · Recorrente', amount: 800 },
    ],
  },
  {
    id: 'g-delivery-reducao',
    title: 'Gastar menos com Delivery',
    type: 'Redução de gasto',
    current: 573,
    target: 460,
    pct: 71,
    color: '#C08A2F',
    rightLabel: '−20% vs. jul',
    deadlineLabel: 'set 2026',
    categoryName: 'Delivery',
  },
  {
    id: 'g-limite-geral',
    title: 'Limite mensal geral',
    type: 'Limite de gasto',
    current: 2820,
    target: 6000,
    color: '#0F7A56',
    deadlineLabel: 'set 2026',
  },
  {
    id: 'g-limite-delivery',
    title: 'Limite Delivery',
    type: 'Limite por categoria',
    current: 410,
    target: 500,
    color: '#C0512F',
    deadlineLabel: 'set 2026',
    categoryName: 'Delivery',
  },
];

export const goalsDone: Goal[] = [
  {
    id: 'gd-chile',
    title: 'Viagem Chile',
    type: 'Poupança com prazo',
    current: 6000,
    target: 6000,
    color: '#0F7A56',
    done: true,
    doneLabel: 'concluída em jul 2026',
  },
  {
    id: 'gd-agosto',
    title: 'Limite mensal · agosto',
    type: 'Limite de gasto',
    current: 5410,
    target: 6000,
    color: '#0F7A56',
    done: true,
    doneLabel: 'dentro do limite',
  },
];

/** txGroups from the design, flattened; "today" in the design is 2026-09-05 */
export const transactions: Transaction[] = [
  { id: 't-mercado-oba', title: 'Mercado Oba', amount: 186.4, kind: 'expense', categoryName: 'Mercado', date: '2026-09-05', recurring: false },
  { id: 't-uber', title: 'Uber', amount: 28.4, kind: 'expense', categoryName: 'Transporte', date: '2026-09-05', recurring: false },
  { id: 't-freela-landing', title: 'Freelance — landing', amount: 1200, kind: 'income', categoryName: 'Freelance', date: '2026-09-04', recurring: false },
  { id: 't-ifood', title: 'iFood', amount: 72.9, kind: 'expense', categoryName: 'Delivery', date: '2026-09-04', recurring: false },
  { id: 't-spotify', title: 'Spotify', amount: 57, kind: 'expense', categoryName: 'Lazer', date: '2026-09-04', recurring: true },
  { id: 't-aluguel', title: 'Aluguel', amount: 1850, kind: 'expense', categoryName: 'Moradia', date: '2026-09-02', recurring: true },
  { id: 't-academia', title: 'Academia', amount: 119, kind: 'expense', categoryName: 'Saúde', date: '2026-09-02', recurring: true },
];

export const months: MonthPoint[] = [
  { label: 'abr', income: 68, expense: 52 },
  { label: 'mai', income: 72, expense: 61 },
  { label: 'jun', income: 66, expense: 49 },
  { label: 'jul', income: 80, expense: 71 },
  { label: 'ago', income: 74, expense: 58 },
  { label: 'set', income: 84, expense: 34 },
];

export const recurring: RecurringRule[] = [
  { id: 'r-aluguel', name: 'Aluguel', kind: 'expense', amount: 1850, frequency: 'Mensal', sub: 'Mensal · dia 5 · Moradia', categoryName: 'Moradia', active: true },
  { id: 'r-salario', name: 'Salário', kind: 'income', amount: 8400, frequency: 'Mensal', sub: 'Mensal · dia 5 · Trabalho', categoryName: 'Salário', active: true },
  { id: 'r-internet', name: 'Internet fibra', kind: 'expense', amount: 129.9, frequency: 'Mensal', sub: 'Mensal · dia 7 · Casa', categoryName: 'Moradia', active: true },
  { id: 'r-spotify', name: 'Spotify', kind: 'expense', amount: 57, frequency: 'Mensal', sub: 'Mensal · dia 4 · Lazer', categoryName: 'Lazer', active: true },
];

export const reportStats = {
  rangeLabel: 'abr – set 2026',
  avgPerMonth: 5640,
  avgDeltaLabel: '−7% vs. jul',
  savingsRate: 31,
  savingsRateDeltaLabel: '+4 p.p.',
};

export const notifications: NotificationPrefs = {
  dueBill: true,
  goalLimit80: true,
  weeklyDigest: false,
};

/** Defaults pre-filled on the "nova despesa" / "nova receita" forms in the design */
export const formDefaults = {
  expense: {
    amount: 186.4,
    description: 'Mercado Oba',
    categoryName: 'Mercado',
    dateLabel: '5 de setembro de 2026',
    account: 'Nubank · Corrente',
  },
  income: {
    amount: 8400,
    description: 'Salário — Studio Vetro',
    categoryName: 'Salário',
    frequency: 'Mensal' as const,
    startLabel: '05 set 2026',
  },
};

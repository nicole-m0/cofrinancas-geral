/**
 * Mock dataset for the admin panel. No backend, no database.
 *
 * user[0] "Marina Alcântara" carries the exact numbers from the Claude Design
 * project "Finanças Pessoais - App". The other 7 users are generated
 * deterministically (seeded PRNG) so `next build` output is stable.
 */
import type {
  Category,
  Goal,
  RecurringRule,
  Transaction,
  User,
} from './types';

export const CATEGORY_COLORS: Record<string, string> = {
  Moradia: '#3E5C76',
  Mercado: '#0F7A56',
  Transporte: '#5B5BD6',
  Delivery: '#C0512F',
  Lazer: '#C08A2F',
  'Saúde': '#2E8B8B',
  Outros: '#9AA0A0',
  'Salário': '#0F7A56',
  Freelance: '#3E5C76',
  Investimentos: '#5B5BD6',
};

export const categories: Category[] = [
  { id: 'c-moradia', name: 'Moradia', kind: 'expense', color: CATEGORY_COLORS.Moradia },
  { id: 'c-mercado', name: 'Mercado', kind: 'expense', color: CATEGORY_COLORS.Mercado },
  { id: 'c-transporte', name: 'Transporte', kind: 'expense', color: CATEGORY_COLORS.Transporte },
  { id: 'c-delivery', name: 'Delivery', kind: 'expense', color: CATEGORY_COLORS.Delivery },
  { id: 'c-lazer', name: 'Lazer', kind: 'expense', color: CATEGORY_COLORS.Lazer },
  { id: 'c-saude', name: 'Saúde', kind: 'expense', color: CATEGORY_COLORS['Saúde'] },
  { id: 'c-outros', name: 'Outros', kind: 'expense', color: CATEGORY_COLORS.Outros },
  { id: 'c-salario', name: 'Salário', kind: 'income', color: CATEGORY_COLORS['Salário'] },
  { id: 'c-freelance', name: 'Freelance', kind: 'income', color: CATEGORY_COLORS.Freelance },
  { id: 'c-investimentos', name: 'Investimentos', kind: 'income', color: CATEGORY_COLORS.Investimentos },
];

export const users: User[] = [
  { id: 'u-marina', name: 'Marina Alcântara', email: 'marina@studiovetro.co', initials: 'MA', status: 'ativo', joinedAt: '2025-11-02', city: 'São Paulo', plan: 'Pro', balance: 14286.4, monthIncome: 9600, monthExpense: 5209, savingsRate: 45 },
  { id: 'u-rafael', name: 'Rafael Nogueira', email: 'rafael.nogueira@gmail.com', initials: 'RN', status: 'ativo', joinedAt: '2026-01-14', city: 'Campinas', plan: 'Pro', balance: 8210.3, monthIncome: 7200, monthExpense: 5480, savingsRate: 24 },
  { id: 'u-beatriz', name: 'Beatriz Lima', email: 'bia.lima@hotmail.com', initials: 'BL', status: 'ativo', joinedAt: '2026-02-20', city: 'Belo Horizonte', plan: 'Gratuito', balance: 3120.9, monthIncome: 4300, monthExpense: 3910, savingsRate: 9 },
  { id: 'u-thiago', name: 'Thiago Santos', email: 'thiago.santos@outlook.com', initials: 'TS', status: 'inativo', joinedAt: '2025-09-30', city: 'Curitiba', plan: 'Gratuito', balance: 1580, monthIncome: 3800, monthExpense: 3720, savingsRate: 2 },
  { id: 'u-camila', name: 'Camila Duarte', email: 'camila.duarte@gmail.com', initials: 'CD', status: 'ativo', joinedAt: '2026-03-08', city: 'Recife', plan: 'Pro', balance: 21750.6, monthIncome: 12800, monthExpense: 7300, savingsRate: 43 },
  { id: 'u-lucas', name: 'Lucas Prado', email: 'lucas.prado@gmail.com', initials: 'LP', status: 'ativo', joinedAt: '2026-04-01', city: 'Porto Alegre', plan: 'Gratuito', balance: 5040.15, monthIncome: 5600, monthExpense: 4820, savingsRate: 14 },
  { id: 'u-aline', name: 'Aline Rocha', email: 'aline.rocha@yahoo.com', initials: 'AR', status: 'ativo', joinedAt: '2025-12-11', city: 'Salvador', plan: 'Pro', balance: 16920, monthIncome: 8900, monthExpense: 5100, savingsRate: 43 },
  { id: 'u-diego', name: 'Diego Martins', email: 'diego.martins@gmail.com', initials: 'DM', status: 'inativo', joinedAt: '2026-05-19', city: 'Fortaleza', plan: 'Gratuito', balance: 890.4, monthIncome: 3200, monthExpense: 3450, savingsRate: -8 },
];

// ── Goals ────────────────────────────────────────────────────────────────────

export const goals: Goal[] = [
  // Marina — verbatim from the design
  { id: 'g-marina-1', userId: 'u-marina', title: 'Reserva de emergência', type: 'Poupança com prazo', current: 12800, target: 20000, color: '#0F7A56', deadlineLabel: 'até dez 2026' },
  { id: 'g-marina-2', userId: 'u-marina', title: 'Gastar menos com Delivery', type: 'Redução de gasto', current: 573, target: 460, pct: 71, color: '#C08A2F', deadlineLabel: 'set 2026', categoryName: 'Delivery' },
  { id: 'g-marina-3', userId: 'u-marina', title: 'Limite mensal geral', type: 'Limite de gasto', current: 2820, target: 6000, color: '#0F7A56', deadlineLabel: 'set 2026' },
  { id: 'g-marina-4', userId: 'u-marina', title: 'Limite Delivery', type: 'Limite por categoria', current: 410, target: 500, color: '#C0512F', deadlineLabel: 'set 2026', categoryName: 'Delivery' },
  { id: 'g-marina-5', userId: 'u-marina', title: 'Viagem Chile', type: 'Poupança com prazo', current: 6000, target: 6000, color: '#0F7A56', deadlineLabel: 'jul 2026', done: true },
  { id: 'g-marina-6', userId: 'u-marina', title: 'Limite mensal · agosto', type: 'Limite de gasto', current: 5410, target: 6000, color: '#0F7A56', deadlineLabel: 'ago 2026', done: true },
  // Rafael
  { id: 'g-rafael-1', userId: 'u-rafael', title: 'Entrada do apê', type: 'Poupança com prazo', current: 18400, target: 60000, color: '#0F7A56', deadlineLabel: 'até jun 2027' },
  { id: 'g-rafael-2', userId: 'u-rafael', title: 'Limite mensal geral', type: 'Limite de gasto', current: 5480, target: 5000, pct: 100, color: '#C0512F', deadlineLabel: 'set 2026' },
  { id: 'g-rafael-3', userId: 'u-rafael', title: 'Troca de carro', type: 'Poupança com prazo', current: 9200, target: 25000, color: '#3E5C76', deadlineLabel: 'até dez 2026' },
  // Beatriz
  { id: 'g-beatriz-1', userId: 'u-beatriz', title: 'Reserva de emergência', type: 'Poupança com prazo', current: 2400, target: 12000, color: '#0F7A56', deadlineLabel: 'até mar 2027' },
  { id: 'g-beatriz-2', userId: 'u-beatriz', title: 'Gastar menos com Delivery', type: 'Redução de gasto', current: 420, target: 300, pct: 58, color: '#C08A2F', deadlineLabel: 'set 2026', categoryName: 'Delivery' },
  // Thiago
  { id: 'g-thiago-1', userId: 'u-thiago', title: 'Sair do vermelho', type: 'Limite de gasto', current: 3720, target: 3500, pct: 100, color: '#C0512F', deadlineLabel: 'set 2026' },
  // Camila
  { id: 'g-camila-1', userId: 'u-camila', title: 'Casamento 2027', type: 'Poupança com prazo', current: 32000, target: 80000, color: '#0F7A56', deadlineLabel: 'até out 2027' },
  { id: 'g-camila-2', userId: 'u-camila', title: 'Reserva de emergência', type: 'Poupança com prazo', current: 24000, target: 30000, color: '#0F7A56', deadlineLabel: 'até dez 2026' },
  { id: 'g-camila-3', userId: 'u-camila', title: 'Limite Lazer', type: 'Limite por categoria', current: 640, target: 900, color: '#C08A2F', deadlineLabel: 'set 2026', categoryName: 'Lazer' },
  // Lucas
  { id: 'g-lucas-1', userId: 'u-lucas', title: 'Notebook novo', type: 'Poupança com prazo', current: 3100, target: 8000, color: '#3E5C76', deadlineLabel: 'até dez 2026' },
  { id: 'g-lucas-2', userId: 'u-lucas', title: 'Limite mensal geral', type: 'Limite de gasto', current: 4820, target: 5200, color: '#0F7A56', deadlineLabel: 'set 2026' },
  // Aline
  { id: 'g-aline-1', userId: 'u-aline', title: 'Intercâmbio', type: 'Poupança com prazo', current: 28000, target: 45000, color: '#0F7A56', deadlineLabel: 'até ago 2027' },
  { id: 'g-aline-2', userId: 'u-aline', title: 'Reserva de emergência', type: 'Poupança com prazo', current: 15000, target: 25000, color: '#0F7A56', deadlineLabel: 'até fev 2027' },
  { id: 'g-aline-3', userId: 'u-aline', title: 'Gastar menos com Transporte', type: 'Redução de gasto', current: 610, target: 480, pct: 64, color: '#C08A2F', deadlineLabel: 'set 2026', categoryName: 'Transporte' },
  // Diego
  { id: 'g-diego-1', userId: 'u-diego', title: 'Sair do vermelho', type: 'Limite de gasto', current: 3450, target: 3000, pct: 100, color: '#C0512F', deadlineLabel: 'set 2026' },
];

// ── Recurring rules ──────────────────────────────────────────────────────────

export const recurring: RecurringRule[] = [
  { id: 'r-marina-1', userId: 'u-marina', name: 'Aluguel', kind: 'expense', amount: 1850, frequency: 'Mensal', categoryName: 'Moradia', active: true, nextDate: '2026-10-05' },
  { id: 'r-marina-2', userId: 'u-marina', name: 'Salário', kind: 'income', amount: 8400, frequency: 'Mensal', categoryName: 'Salário', active: true, nextDate: '2026-10-05' },
  { id: 'r-marina-3', userId: 'u-marina', name: 'Internet fibra', kind: 'expense', amount: 129.9, frequency: 'Mensal', categoryName: 'Moradia', active: true, nextDate: '2026-10-07' },
  { id: 'r-marina-4', userId: 'u-marina', name: 'Spotify', kind: 'expense', amount: 57, frequency: 'Mensal', categoryName: 'Lazer', active: true, nextDate: '2026-10-04' },
  { id: 'r-rafael-1', userId: 'u-rafael', name: 'Salário', kind: 'income', amount: 7200, frequency: 'Mensal', categoryName: 'Salário', active: true, nextDate: '2026-10-05' },
  { id: 'r-rafael-2', userId: 'u-rafael', name: 'Financiamento carro', kind: 'expense', amount: 1240, frequency: 'Mensal', categoryName: 'Transporte', active: true, nextDate: '2026-10-10' },
  { id: 'r-rafael-3', userId: 'u-rafael', name: 'Aluguel', kind: 'expense', amount: 2100, frequency: 'Mensal', categoryName: 'Moradia', active: true, nextDate: '2026-10-05' },
  { id: 'r-beatriz-1', userId: 'u-beatriz', name: 'Salário', kind: 'income', amount: 4300, frequency: 'Mensal', categoryName: 'Salário', active: true, nextDate: '2026-10-05' },
  { id: 'r-beatriz-2', userId: 'u-beatriz', name: 'Netflix', kind: 'expense', amount: 44.9, frequency: 'Mensal', categoryName: 'Lazer', active: true, nextDate: '2026-10-12' },
  { id: 'r-thiago-1', userId: 'u-thiago', name: 'Salário', kind: 'income', amount: 3800, frequency: 'Mensal', categoryName: 'Salário', active: false, nextDate: '2026-10-05' },
  { id: 'r-thiago-2', userId: 'u-thiago', name: 'Aluguel', kind: 'expense', amount: 1500, frequency: 'Mensal', categoryName: 'Moradia', active: true, nextDate: '2026-10-05' },
  { id: 'r-camila-1', userId: 'u-camila', name: 'Salário', kind: 'income', amount: 12800, frequency: 'Mensal', categoryName: 'Salário', active: true, nextDate: '2026-10-05' },
  { id: 'r-camila-2', userId: 'u-camila', name: 'Aluguel', kind: 'expense', amount: 3200, frequency: 'Mensal', categoryName: 'Moradia', active: true, nextDate: '2026-10-05' },
  { id: 'r-camila-3', userId: 'u-camila', name: 'Plano de saúde', kind: 'expense', amount: 480, frequency: 'Mensal', categoryName: 'Saúde', active: true, nextDate: '2026-10-15' },
  { id: 'r-lucas-1', userId: 'u-lucas', name: 'Salário', kind: 'income', amount: 5600, frequency: 'Mensal', categoryName: 'Salário', active: true, nextDate: '2026-10-05' },
  { id: 'r-lucas-2', userId: 'u-lucas', name: 'Aluguel', kind: 'expense', amount: 1650, frequency: 'Mensal', categoryName: 'Moradia', active: true, nextDate: '2026-10-05' },
  { id: 'r-aline-1', userId: 'u-aline', name: 'Salário', kind: 'income', amount: 8900, frequency: 'Mensal', categoryName: 'Salário', active: true, nextDate: '2026-10-05' },
  { id: 'r-aline-2', userId: 'u-aline', name: 'Aluguel', kind: 'expense', amount: 1900, frequency: 'Mensal', categoryName: 'Moradia', active: true, nextDate: '2026-10-05' },
  { id: 'r-aline-3', userId: 'u-aline', name: 'Academia', kind: 'expense', amount: 149, frequency: 'Mensal', categoryName: 'Saúde', active: true, nextDate: '2026-10-08' },
  { id: 'r-diego-1', userId: 'u-diego', name: 'Salário', kind: 'income', amount: 3200, frequency: 'Mensal', categoryName: 'Salário', active: false, nextDate: '2026-10-05' },
  { id: 'r-diego-2', userId: 'u-diego', name: 'Aluguel', kind: 'expense', amount: 1400, frequency: 'Mensal', categoryName: 'Moradia', active: true, nextDate: '2026-10-05' },
];

// ── Transactions (deterministically generated) ───────────────────────────────

const MONTHS = ['2026-04', '2026-05', '2026-06', '2026-07', '2026-08', '2026-09'];

const EXPENSE_WEIGHTS: Record<string, number> = {
  Moradia: 38,
  Mercado: 22,
  Transporte: 14,
  Delivery: 11,
  Lazer: 9,
  'Saúde': 4,
  Outros: 2,
};

const TITLE_POOL: Record<string, string[]> = {
  Moradia: ['Aluguel', 'Condomínio', 'Energia elétrica', 'Internet fibra', 'Conta de água'],
  Mercado: ['Mercado Oba', 'Supermercado Extra', 'Hortifruti', 'Padaria', 'Açougue'],
  Transporte: ['Uber', '99 Pop', 'Combustível', 'Recarga bilhete', 'Estacionamento'],
  Delivery: ['iFood', 'Rappi', 'Zé Delivery', 'Lanchonete'],
  Lazer: ['Spotify', 'Netflix', 'Cinema', 'Bar do Zé', 'Livraria'],
  'Saúde': ['Academia', 'Farmácia', 'Consulta', 'Plano de saúde'],
  Outros: ['Presente', 'Assinatura', 'Diversos'],
  Freelance: ['Freelance — landing', 'Projeto freela', 'Consultoria'],
  Investimentos: ['Dividendos', 'Resgate CDB'],
};

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

const MARINA_SEPT: Omit<Transaction, 'userId'>[] = [
  { id: 't-marina-sep-1', title: 'Mercado Oba', amount: 186.4, kind: 'expense', categoryName: 'Mercado', date: '2026-09-05', recurring: false },
  { id: 't-marina-sep-2', title: 'Uber', amount: 28.4, kind: 'expense', categoryName: 'Transporte', date: '2026-09-05', recurring: false },
  { id: 't-marina-sep-3', title: 'Freelance — landing', amount: 1200, kind: 'income', categoryName: 'Freelance', date: '2026-09-04', recurring: false },
  { id: 't-marina-sep-4', title: 'iFood', amount: 72.9, kind: 'expense', categoryName: 'Delivery', date: '2026-09-04', recurring: false },
  { id: 't-marina-sep-5', title: 'Spotify', amount: 57, kind: 'expense', categoryName: 'Lazer', date: '2026-09-04', recurring: true },
  { id: 't-marina-sep-6', title: 'Aluguel', amount: 1850, kind: 'expense', categoryName: 'Moradia', date: '2026-09-02', recurring: true },
  { id: 't-marina-sep-7', title: 'Academia', amount: 119, kind: 'expense', categoryName: 'Saúde', date: '2026-09-02', recurring: true },
];

function generateForUser(user: User): Transaction[] {
  const rnd = mulberry32(hash(user.id));
  const jitter = (base: number, spread: number) => base * (1 - spread + rnd() * spread * 2);
  const out: Transaction[] = [];
  let n = 0;
  const tid = () => `t-${user.id}-${n++}`;

  const catNames = Object.keys(EXPENSE_WEIGHTS);
  const totalWeight = catNames.reduce((s, c) => s + EXPENSE_WEIGHTS[c], 0);

  for (const month of MONTHS) {
    const isMarinaSept = user.id === 'u-marina' && month === '2026-09';
    if (isMarinaSept) {
      out.push(...MARINA_SEPT.map((t) => ({ ...t, userId: user.id })));
      continue;
    }

    // salary
    out.push({
      id: tid(),
      userId: user.id,
      title: 'Salário',
      amount: round2(jitter(user.monthIncome, 0.02)),
      kind: 'income',
      categoryName: 'Salário',
      date: `${month}-05`,
      recurring: true,
    });

    // occasional extra income
    if (rnd() > 0.55) {
      const pool = rnd() > 0.5 ? TITLE_POOL.Freelance : TITLE_POOL.Investimentos;
      out.push({
        id: tid(),
        userId: user.id,
        title: pool[Math.floor(rnd() * pool.length)],
        amount: round2(jitter(user.monthIncome * 0.16, 0.4)),
        kind: 'income',
        categoryName: pool === TITLE_POOL.Freelance ? 'Freelance' : 'Investimentos',
        date: `${month}-${String(9 + Math.floor(rnd() * 15)).padStart(2, '0')}`,
        recurring: false,
      });
    }

    // expenses — allocate the month's budget across categories by weight
    const monthBudget = jitter(user.monthExpense, 0.14);
    for (const cat of catNames) {
      const share = (EXPENSE_WEIGHTS[cat] / totalWeight) * monthBudget;
      const parts = cat === 'Moradia' || cat === 'Mercado' ? 2 : rnd() > 0.5 ? 2 : 1;
      for (let p = 0; p < parts; p++) {
        const pool = TITLE_POOL[cat];
        const amount = round2(jitter(share / parts, 0.3));
        if (amount < 3) continue;
        out.push({
          id: tid(),
          userId: user.id,
          title: pool[Math.floor(rnd() * pool.length)],
          amount,
          kind: 'expense',
          categoryName: cat,
          date: `${month}-${String(2 + Math.floor(rnd() * 26)).padStart(2, '0')}`,
          recurring: cat === 'Moradia' && p === 0,
        });
      }
    }
  }

  return out.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export const transactions: Transaction[] = users.flatMap(generateForUser);

// ── Selectors ───────────────────────────────────────────────────────────────

export const getUser = (id: string) => users.find((u) => u.id === id);
export const userTransactions = (id: string) => transactions.filter((t) => t.userId === id);
export const userGoals = (id: string) => goals.filter((g) => g.userId === id);
export const userRecurring = (id: string) => recurring.filter((r) => r.userId === id);
export const userName = (id: string) => getUser(id)?.name ?? '—';

export { MONTHS };

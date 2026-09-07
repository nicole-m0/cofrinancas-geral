/**
 * Constantes de UI que não vêm da API: valores pré-preenchidos dos formulários
 * e rótulos da tela de Relatórios. O resto dos dados agora vem do backend.
 */

/** Defaults pré-preenchidos nos formulários "nova despesa" / "nova receita". */
export const formDefaults = {
  expense: {
    amount: 0,
    description: '',
    categoryName: 'Mercado',
    dateLabel: '',
    account: 'Conta corrente',
  },
  income: {
    amount: 0,
    description: '',
    categoryName: 'Salário',
    frequency: 'Mensal' as const,
    startLabel: 'hoje',
  },
};

/** Rótulos estáticos da tela de Relatórios (os números vêm de `useFinance()`). */
export const reportStats = {
  rangeLabel: 'últimos 6 meses',
  avgPerMonth: 0,
  avgDeltaLabel: '',
  savingsRate: 0,
  savingsRateDeltaLabel: '',
};

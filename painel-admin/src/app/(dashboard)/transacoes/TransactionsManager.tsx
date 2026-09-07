'use client';

import { CrudManager, type CrudConfig, type Field } from '@/components/CrudManager';
import { Badge, CategoryDot } from '@/components/ui';
import { brl, shortDate } from '@/lib/format';

type Row = {
  id: string;
  title: string;
  userId: string;
  userName: string;
  categoryName: string;
  date: string;
  amount: number;
  kind: 'income' | 'expense';
  recurring: boolean;
};

const today = () => new Date().toISOString().slice(0, 10);

export function TransactionsManager({
  rows,
  users,
  categoryNames,
}: {
  rows: Row[];
  users: { id: string; name: string }[];
  categoryNames: string[];
}) {
  const fields: Field[] = [
    {
      name: 'userId',
      label: 'Usuário (dono)',
      kind: 'select',
      required: true,
      options: users.map((u) => ({ value: u.id, label: u.name })),
    },
    { name: 'title', label: 'Descrição', kind: 'text', required: true },
    { name: 'amount', label: 'Valor', kind: 'number', required: true, step: '0.01' },
    {
      name: 'kind',
      label: 'Tipo',
      kind: 'select',
      required: true,
      options: [
        { value: 'expense', label: 'Despesa' },
        { value: 'income', label: 'Receita' },
      ],
    },
    {
      name: 'categoryName',
      label: 'Categoria',
      kind: 'select',
      required: true,
      options: categoryNames.map((c) => ({ value: c, label: c })),
    },
    { name: 'date', label: 'Data', kind: 'date', required: true },
    { name: 'recurring', label: 'Também criar regra recorrente', kind: 'checkbox' },
  ];

  const config: CrudConfig<Row> = {
    rows,
    getKey: (r) => r.id,
    searchText: (r) => `${r.title} ${r.userName} ${r.categoryName}`,
    searchPlaceholder: 'Buscar lançamento…',
    initialSort: { key: 'date', dir: 'desc' },
    emptyText: 'Nenhum lançamento ainda.',
    newLabel: 'Novo lançamento',
    createTitle: 'Novo lançamento',
    editTitle: 'Editar lançamento',
    fields,
    blank: {
      userId: '',
      title: '',
      amount: '',
      kind: 'expense',
      categoryName: '',
      date: today(),
      recurring: false,
    },
    toForm: (r) => ({
      userId: r.userId,
      title: r.title,
      amount: String(r.amount),
      kind: r.kind,
      categoryName: r.categoryName,
      date: r.date,
      recurring: r.recurring,
    }),
    createUrl: (f) => `/api/transactions?userId=${f.userId}`,
    itemUrl: (r) => `/api/transactions/${r.id}`,
    buildPayload: (f) => ({
      title: f.title,
      amount: Number(f.amount),
      kind: f.kind,
      categoryName: f.categoryName,
      date: f.date,
      recurring: Boolean(f.recurring),
      ...(f.recurring ? { frequency: 'Mensal' } : {}),
    }),
    describe: (r) => `"${r.title}" de ${r.userName}`,
    columns: [
      {
        key: 'title',
        header: 'Lançamento',
        sortValue: (r) => r.title.toLowerCase(),
        render: (r) => (
          <div className="flex items-center gap-2.5">
            <CategoryDot name={r.categoryName} />
            <div>
              <div className="font-bold text-ink">{r.title}</div>
              <div className="text-xs font-medium text-muted">
                {r.categoryName}
                {r.recurring ? ' · recorrente' : ''}
              </div>
            </div>
          </div>
        ),
      },
      {
        key: 'user',
        header: 'Usuário',
        sortValue: (r) => r.userName.toLowerCase(),
        render: (r) => <span className="text-sm font-semibold text-muted">{r.userName}</span>,
      },
      {
        key: 'kind',
        header: 'Tipo',
        sortValue: (r) => r.kind,
        render: (r) => (
          <Badge tone={r.kind === 'income' ? 'green' : 'rust'}>
            {r.kind === 'income' ? 'Receita' : 'Despesa'}
          </Badge>
        ),
      },
      {
        key: 'date',
        header: 'Data',
        align: 'right',
        sortValue: (r) => r.date,
        render: (r) => <span className="text-sm font-semibold text-muted">{shortDate(r.date)}</span>,
      },
      {
        key: 'amount',
        header: 'Valor',
        align: 'right',
        sortValue: (r) => (r.kind === 'expense' ? -r.amount : r.amount),
        render: (r) => (
          <span className={`font-extrabold ${r.kind === 'income' ? 'text-brand' : 'text-ink'}`}>
            {r.kind === 'income' ? '+ ' : '− '}
            {brl(r.amount)}
          </span>
        ),
      },
    ],
  };

  return <CrudManager config={config} />;
}

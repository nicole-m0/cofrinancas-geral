'use client';

import Link from 'next/link';

import { CrudManager, type CrudConfig, type Field } from '@/components/CrudManager';
import { Badge, CategoryDot } from '@/components/ui';
import { brl, shortDate } from '@/lib/format';

type Row = {
  id: string;
  userId: string;
  userName: string;
  name: string;
  categoryName: string;
  frequency: string;
  amount: number;
  kind: 'income' | 'expense';
  active: boolean;
  nextDate: string;
};

const FREQ = ['Mensal', 'Semanal', 'Quinzenal', 'Anual'];

export function RecurringManager({
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
    { name: 'name', label: 'Nome', kind: 'text', required: true },
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
      name: 'frequency',
      label: 'Frequência',
      kind: 'select',
      required: true,
      options: FREQ.map((f) => ({ value: f, label: f })),
    },
    {
      name: 'categoryName',
      label: 'Categoria',
      kind: 'select',
      required: true,
      options: categoryNames.map((c) => ({ value: c, label: c })),
    },
    { name: 'nextDate', label: 'Próxima data', kind: 'date' },
    { name: 'active', label: 'Ativa', kind: 'checkbox' },
  ];

  const config: CrudConfig<Row> = {
    rows,
    getKey: (r) => r.id,
    searchText: (r) => `${r.name} ${r.userName} ${r.categoryName}`,
    searchPlaceholder: 'Buscar regra…',
    initialSort: { key: 'name', dir: 'asc' },
    emptyText: 'Nenhuma regra recorrente ainda.',
    newLabel: 'Nova regra',
    createTitle: 'Nova regra recorrente',
    editTitle: 'Editar regra recorrente',
    fields,
    blank: {
      userId: '',
      name: '',
      amount: '',
      kind: 'expense',
      frequency: 'Mensal',
      categoryName: '',
      nextDate: '',
      active: true,
    },
    toForm: (r) => ({
      userId: r.userId,
      name: r.name,
      amount: String(r.amount),
      kind: r.kind,
      frequency: r.frequency,
      categoryName: r.categoryName,
      nextDate: r.nextDate,
      active: r.active,
    }),
    createUrl: (f) => `/api/recurring?userId=${f.userId}`,
    itemUrl: (r) => `/api/recurring/${r.id}`,
    buildPayload: (f) => ({
      name: f.name,
      amount: Number(f.amount),
      kind: f.kind,
      frequency: f.frequency,
      categoryName: f.categoryName,
      active: Boolean(f.active),
      ...(f.nextDate ? { nextDate: String(f.nextDate) } : {}),
    }),
    describe: (r) => `a regra "${r.name}" de ${r.userName}`,
    columns: [
      {
        key: 'name',
        header: 'Regra',
        sortValue: (r) => r.name.toLowerCase(),
        render: (r) => (
          <div className="flex items-center gap-2.5">
            <CategoryDot name={r.categoryName} />
            <div>
              <div className="font-bold text-ink">{r.name}</div>
              <div className="text-xs font-medium text-muted">{r.categoryName}</div>
            </div>
          </div>
        ),
      },
      {
        key: 'user',
        header: 'Usuário',
        sortValue: (r) => r.userName.toLowerCase(),
        render: (r) => (
          <Link href={`/usuarios/${r.userId}`} className="text-sm font-semibold text-muted hover:text-ink">
            {r.userName}
          </Link>
        ),
      },
      {
        key: 'frequency',
        header: 'Frequência',
        sortValue: (r) => r.frequency,
        render: (r) => <span className="text-sm font-bold text-muted">{r.frequency}</span>,
      },
      {
        key: 'next',
        header: 'Próxima',
        align: 'right',
        sortValue: (r) => r.nextDate,
        render: (r) => (
          <span className="text-sm font-semibold text-muted">
            {r.nextDate ? shortDate(r.nextDate) : '—'}
          </span>
        ),
      },
      {
        key: 'amount',
        header: 'Valor',
        align: 'right',
        sortValue: (r) => r.amount,
        render: (r) => (
          <span className={`font-extrabold ${r.kind === 'income' ? 'text-brand' : 'text-ink'}`}>
            {r.kind === 'income' ? '+ ' : '− '}
            {brl(r.amount)}
          </span>
        ),
      },
      {
        key: 'active',
        header: 'Estado',
        align: 'right',
        sortValue: (r) => (r.active ? 1 : 0),
        render: (r) => (
          <Badge tone={r.active ? 'green' : 'neutral'}>{r.active ? 'ativa' : 'pausada'}</Badge>
        ),
      },
    ],
  };

  return <CrudManager config={config} />;
}

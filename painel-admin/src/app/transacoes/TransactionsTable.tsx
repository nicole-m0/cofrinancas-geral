'use client';

import { useMemo, useState } from 'react';

import { Column, DataTable } from '@/components/DataTable';
import { Badge, CategoryDot } from '@/components/ui';
import { brl, shortDate } from '@/lib/format';

export type TxRow = {
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

const columns: Column<TxRow>[] = [
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
];

const selectClass =
  'rounded-xl border border-hair bg-card px-3 py-2 text-sm font-bold text-ink outline-none';

export function TransactionsTable({
  rows,
  categories,
  users,
}: {
  rows: TxRow[];
  categories: string[];
  users: { id: string; name: string }[];
}) {
  const [tipo, setTipo] = useState<'todos' | 'income' | 'expense' | 'recurring'>('todos');
  const [cat, setCat] = useState('todas');
  const [user, setUser] = useState('todos');

  const filtered = useMemo(
    () =>
      rows.filter((r) => {
        if (tipo === 'income' && r.kind !== 'income') return false;
        if (tipo === 'expense' && r.kind !== 'expense') return false;
        if (tipo === 'recurring' && !r.recurring) return false;
        if (cat !== 'todas' && r.categoryName !== cat) return false;
        if (user !== 'todos' && r.userId !== user) return false;
        return true;
      }),
    [rows, tipo, cat, user],
  );

  const totalIn = filtered.filter((r) => r.kind === 'income').reduce((s, r) => s + r.amount, 0);
  const totalOut = filtered.filter((r) => r.kind === 'expense').reduce((s, r) => s + r.amount, 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-hair bg-card p-4">
          <div className="text-[11px] font-extrabold uppercase tracking-wide text-faint">
            Lançamentos
          </div>
          <div className="mt-1 text-xl font-extrabold text-ink">{filtered.length}</div>
        </div>
        <div className="rounded-2xl border border-hair bg-card p-4">
          <div className="text-[11px] font-extrabold uppercase tracking-wide text-faint">
            Σ receitas
          </div>
          <div className="mt-1 text-xl font-extrabold text-brand">{brl(totalIn)}</div>
        </div>
        <div className="rounded-2xl border border-hair bg-card p-4">
          <div className="text-[11px] font-extrabold uppercase tracking-wide text-faint">
            Σ despesas
          </div>
          <div className="mt-1 text-xl font-extrabold text-rust">{brl(totalOut)}</div>
        </div>
      </div>

      <DataTable
        rows={filtered}
        columns={columns}
        getKey={(r) => r.id}
        rowHref={(r) => `/usuarios/${r.userId}`}
        searchText={(r) => `${r.title} ${r.userName} ${r.categoryName}`}
        searchPlaceholder="Buscar lançamento…"
        initialSort={{ key: 'date', dir: 'desc' }}
        toolbar={
          <div className="flex flex-wrap gap-2">
            <select className={selectClass} value={tipo} onChange={(e) => setTipo(e.target.value as typeof tipo)}>
              <option value="todos">Todos os tipos</option>
              <option value="income">Receitas</option>
              <option value="expense">Despesas</option>
              <option value="recurring">Recorrentes</option>
            </select>
            <select className={selectClass} value={cat} onChange={(e) => setCat(e.target.value)}>
              <option value="todas">Todas as categorias</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select className={selectClass} value={user} onChange={(e) => setUser(e.target.value)}>
              <option value="todos">Todos os usuários</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
        }
      />
    </div>
  );
}

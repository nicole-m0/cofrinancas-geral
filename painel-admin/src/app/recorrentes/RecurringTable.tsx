'use client';

import { useMemo, useState } from 'react';

import { Column, DataTable } from '@/components/DataTable';
import { Badge, CategoryDot } from '@/components/ui';
import { brl, shortDate } from '@/lib/format';

export type RecRow = {
  id: string;
  name: string;
  userId: string;
  userName: string;
  categoryName: string;
  frequency: string;
  amount: number;
  kind: 'income' | 'expense';
  active: boolean;
  nextDate: string;
};

const columns: Column<RecRow>[] = [
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
    render: (r) => <span className="text-sm font-semibold text-muted">{r.userName}</span>,
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
    render: (r) => <span className="text-sm font-semibold text-muted">{shortDate(r.nextDate)}</span>,
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
];

const selectClass =
  'rounded-xl border border-hair bg-card px-3 py-2 text-sm font-bold text-ink outline-none';

export function RecurringTable({ rows }: { rows: RecRow[] }) {
  const [estado, setEstado] = useState<'todas' | 'ativa' | 'pausada'>('todas');
  const [tipo, setTipo] = useState<'todos' | 'income' | 'expense'>('todos');

  const filtered = useMemo(
    () =>
      rows.filter((r) => {
        if (estado === 'ativa' && !r.active) return false;
        if (estado === 'pausada' && r.active) return false;
        if (tipo !== 'todos' && r.kind !== tipo) return false;
        return true;
      }),
    [rows, estado, tipo],
  );

  return (
    <DataTable
      rows={filtered}
      columns={columns}
      getKey={(r) => r.id}
      rowHref={(r) => `/usuarios/${r.userId}`}
      searchText={(r) => `${r.name} ${r.userName} ${r.categoryName}`}
      searchPlaceholder="Buscar regra…"
      initialSort={{ key: 'next', dir: 'asc' }}
      toolbar={
        <div className="flex flex-wrap gap-2">
          <select className={selectClass} value={estado} onChange={(e) => setEstado(e.target.value as typeof estado)}>
            <option value="todas">Todos os estados</option>
            <option value="ativa">Ativas</option>
            <option value="pausada">Pausadas</option>
          </select>
          <select className={selectClass} value={tipo} onChange={(e) => setTipo(e.target.value as typeof tipo)}>
            <option value="todos">Receitas e despesas</option>
            <option value="income">Receitas</option>
            <option value="expense">Despesas</option>
          </select>
        </div>
      }
    />
  );
}

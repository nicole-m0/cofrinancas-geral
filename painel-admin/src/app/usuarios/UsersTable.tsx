'use client';

import { Column, DataTable } from '@/components/DataTable';
import { Avatar, Badge } from '@/components/ui';
import { brlShort, shortDate } from '@/lib/format';

export type UserRow = {
  id: string;
  name: string;
  email: string;
  initials: string;
  status: 'ativo' | 'inativo';
  plan: 'Gratuito' | 'Pro';
  city: string;
  joinedAt: string;
  balance: number;
  goals: number;
  transactions: number;
  savingsRate: number;
};

const columns: Column<UserRow>[] = [
  {
    key: 'name',
    header: 'Usuário',
    sortValue: (r) => r.name.toLowerCase(),
    render: (r) => (
      <div className="flex items-center gap-3">
        <Avatar initials={r.initials} size={36} />
        <div className="min-w-0">
          <div className="truncate font-bold text-ink">{r.name}</div>
          <div className="truncate text-xs font-medium text-muted">{r.email}</div>
        </div>
      </div>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    sortValue: (r) => r.status,
    render: (r) => (
      <Badge tone={r.status === 'ativo' ? 'green' : 'neutral'}>
        {r.status === 'ativo' ? 'Ativo' : 'Inativo'}
      </Badge>
    ),
  },
  {
    key: 'plan',
    header: 'Plano',
    sortValue: (r) => r.plan,
    render: (r) => (
      <span className="text-sm font-bold text-muted">{r.plan}</span>
    ),
  },
  { key: 'city', header: 'Cidade', sortValue: (r) => r.city, render: (r) => (
    <span className="text-sm font-semibold text-muted">{r.city}</span>
  ) },
  {
    key: 'balance',
    header: 'Saldo',
    align: 'right',
    sortValue: (r) => r.balance,
    render: (r) => <span className="font-extrabold text-ink">{brlShort(r.balance)}</span>,
  },
  {
    key: 'savingsRate',
    header: 'Poupança',
    align: 'right',
    sortValue: (r) => r.savingsRate,
    render: (r) => (
      <span className={`font-bold ${r.savingsRate < 0 ? 'text-rust' : 'text-muted'}`}>
        {r.savingsRate}%
      </span>
    ),
  },
  {
    key: 'goals',
    header: 'Metas',
    align: 'right',
    sortValue: (r) => r.goals,
    render: (r) => <span className="font-bold text-muted">{r.goals}</span>,
  },
  {
    key: 'transactions',
    header: 'Transações',
    align: 'right',
    sortValue: (r) => r.transactions,
    render: (r) => <span className="font-bold text-muted">{r.transactions}</span>,
  },
  {
    key: 'joinedAt',
    header: 'Entrou em',
    align: 'right',
    sortValue: (r) => r.joinedAt,
    render: (r) => <span className="text-sm font-semibold text-muted">{shortDate(r.joinedAt)}</span>,
  },
];

export function UsersTable({ rows }: { rows: UserRow[] }) {
  return (
    <DataTable
      rows={rows}
      columns={columns}
      getKey={(r) => r.id}
      rowHref={(r) => `/usuarios/${r.id}`}
      searchText={(r) => `${r.name} ${r.email} ${r.city}`}
      searchPlaceholder="Buscar por nome, e-mail ou cidade…"
      initialSort={{ key: 'name', dir: 'asc' }}
    />
  );
}

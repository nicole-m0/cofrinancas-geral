import { PageHeader } from '@/components/PageHeader';
import { goals, transactions, users } from '@/lib/mock';
import { UsersTable, type UserRow } from './UsersTable';

export default function UsuariosPage() {
  const rows: UserRow[] = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    initials: u.initials,
    status: u.status,
    plan: u.plan,
    city: u.city,
    joinedAt: u.joinedAt,
    balance: u.balance,
    savingsRate: u.savingsRate,
    goals: goals.filter((g) => g.userId === u.id).length,
    transactions: transactions.filter((t) => t.userId === u.id).length,
  }));

  return (
    <>
      <PageHeader
        title="Usuários"
        subtitle={`${users.length} contas · ${users.filter((u) => u.status === 'ativo').length} ativas`}
      />
      <UsersTable rows={rows} />
    </>
  );
}

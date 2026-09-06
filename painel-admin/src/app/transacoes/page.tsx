import { PageHeader } from '@/components/PageHeader';
import { categories, transactions, userName, users } from '@/lib/mock';
import { TransactionsTable, type TxRow } from './TransactionsTable';

export default function TransacoesPage() {
  const rows: TxRow[] = transactions.map((t) => ({
    id: t.id,
    title: t.title,
    userId: t.userId,
    userName: userName(t.userId),
    categoryName: t.categoryName,
    date: t.date,
    amount: t.amount,
    kind: t.kind,
    recurring: t.recurring,
  }));

  return (
    <>
      <PageHeader
        title="Transações"
        subtitle={`${transactions.length} lançamentos · abr–set 2026 · todos os usuários`}
      />
      <TransactionsTable
        rows={rows}
        categories={categories.map((c) => c.name)}
        users={users.map((u) => ({ id: u.id, name: u.name }))}
      />
    </>
  );
}

import { PageHeader } from '@/components/PageHeader';
import { listAllTransactions, requireAdminSession } from '@/lib/data';
import { TransactionsManager } from './TransactionsManager';

export const dynamic = 'force-dynamic';

export default async function TransacoesPage() {
  await requireAdminSession();
  const { rows, users, categoryNames } = await listAllTransactions();

  return (
    <>
      <PageHeader title="Transações" subtitle={`${rows.length} lançamentos · todos os usuários`} />
      <TransactionsManager rows={rows} users={users} categoryNames={categoryNames} />
    </>
  );
}

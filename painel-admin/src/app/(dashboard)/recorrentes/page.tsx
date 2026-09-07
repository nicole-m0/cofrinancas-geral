import { PageHeader } from '@/components/PageHeader';
import { StatCard } from '@/components/ui';
import { listAllRecurring, listAllTransactions, requireAdminSession } from '@/lib/data';
import { RecurringManager } from './RecurringManager';

export const dynamic = 'force-dynamic';

export default async function RecorrentesPage() {
  await requireAdminSession();
  const [rows, { users, categoryNames }] = await Promise.all([
    listAllRecurring(),
    listAllTransactions(),
  ]);

  const activeIncome = rows
    .filter((r) => r.active && r.kind === 'income')
    .reduce((s, r) => s + r.amount, 0);
  const activeExpense = rows
    .filter((r) => r.active && r.kind === 'expense')
    .reduce((s, r) => s + r.amount, 0);

  return (
    <>
      <PageHeader
        title="Recorrentes"
        subtitle={`${rows.length} regras · ${rows.filter((r) => r.active).length} ativas`}
      />

      <section className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Regras ativas" value={String(rows.filter((r) => r.active).length)} />
        <StatCard label="Receita recorrente / mês" value={`R$ ${Math.round(activeIncome)}`} />
        <StatCard label="Despesa recorrente / mês" value={`R$ ${Math.round(activeExpense)}`} />
      </section>

      <RecurringManager rows={rows} users={users} categoryNames={categoryNames} />
    </>
  );
}

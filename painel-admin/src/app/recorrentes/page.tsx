import { PageHeader } from '@/components/PageHeader';
import { StatCard } from '@/components/ui';
import { brlShort } from '@/lib/format';
import { recurring, userName } from '@/lib/mock';
import { RecurringTable, type RecRow } from './RecurringTable';

export default function RecorrentesPage() {
  const rows: RecRow[] = recurring.map((r) => ({
    id: r.id,
    name: r.name,
    userId: r.userId,
    userName: userName(r.userId),
    categoryName: r.categoryName,
    frequency: r.frequency,
    amount: r.amount,
    kind: r.kind,
    active: r.active,
    nextDate: r.nextDate,
  }));

  const activeIncome = recurring
    .filter((r) => r.active && r.kind === 'income')
    .reduce((s, r) => s + r.amount, 0);
  const activeExpense = recurring
    .filter((r) => r.active && r.kind === 'expense')
    .reduce((s, r) => s + r.amount, 0);

  return (
    <>
      <PageHeader
        title="Recorrentes"
        subtitle={`${recurring.length} regras · ${recurring.filter((r) => r.active).length} ativas`}
      />

      <section className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Regras ativas" value={String(recurring.filter((r) => r.active).length)} />
        <StatCard label="Receita recorrente / mês" value={brlShort(activeIncome)} />
        <StatCard label="Despesa recorrente / mês" value={brlShort(activeExpense)} />
      </section>

      <RecurringTable rows={rows} />
    </>
  );
}

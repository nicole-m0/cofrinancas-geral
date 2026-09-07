import { PageHeader } from '@/components/PageHeader';
import { StatCard } from '@/components/ui';
import { listAllGoals, listAllTransactions, requireAdminSession } from '@/lib/data';
import { GoalsManager } from './GoalsManager';

export const dynamic = 'force-dynamic';

export default async function MetasPage() {
  await requireAdminSession();
  const [goals, { users }] = await Promise.all([listAllGoals(), listAllTransactions()]);

  const active = goals.filter((g) => !g.done);
  const done = goals.filter((g) => g.done);
  const atRisk = active.filter((g) => g.progress >= 90).length;

  return (
    <>
      <PageHeader
        title="Metas"
        subtitle={`${goals.length} metas de ${new Set(goals.map((g) => g.userId)).size} usuários`}
      />

      <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total" value={String(goals.length)} />
        <StatCard label="Ativas" value={String(active.length)} />
        <StatCard label="Concluídas" value={String(done.length)} />
        <StatCard
          label="Perto do limite"
          value={String(atRisk)}
          delta={atRisk > 0 ? '≥ 90%' : undefined}
          deltaDir={atRisk > 0 ? 'down' : undefined}
        />
      </section>

      <GoalsManager rows={goals} users={users} />
    </>
  );
}

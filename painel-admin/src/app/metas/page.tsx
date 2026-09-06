import Link from 'next/link';

import { PageHeader } from '@/components/PageHeader';
import { Badge, Card, ProgressBar, StatCard } from '@/components/ui';
import { goalProgress } from '@/lib/aggregate';
import { brlShort } from '@/lib/format';
import { goals, userName } from '@/lib/mock';
import type { GoalType } from '@/lib/types';

const TYPE_ORDER: GoalType[] = [
  'Poupança com prazo',
  'Redução de gasto',
  'Limite de gasto',
  'Limite por categoria',
];

export default function MetasPage() {
  const active = goals.filter((g) => !g.done);
  const done = goals.filter((g) => g.done);
  const atRisk = active.filter((g) => goalProgress(g) >= 90).length;

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

      {TYPE_ORDER.map((type) => {
        const list = goals.filter((g) => g.type === type);
        if (list.length === 0) return null;
        return (
          <section key={type} className="mb-6">
            <h2 className="mb-3 text-xs font-extrabold uppercase tracking-wide text-faint">
              {type} · {list.length}
            </h2>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {list.map((g) => {
                const p = goalProgress(g);
                return (
                  <Card key={g.id}>
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/usuarios/${g.userId}`}
                        className="text-xs font-bold text-muted hover:text-ink">
                        {userName(g.userId)}
                      </Link>
                      {g.done ? (
                        <Badge tone="green">concluída</Badge>
                      ) : p >= 90 ? (
                        <Badge tone="rust">{p}%</Badge>
                      ) : (
                        <Badge>{p}%</Badge>
                      )}
                    </div>
                    <div className="mt-1.5 text-sm font-extrabold text-ink">{g.title}</div>
                    <div className="mt-3">
                      <ProgressBar value={p} color={g.color} />
                    </div>
                    <div className="mt-2 flex items-baseline justify-between text-xs">
                      <span className="font-extrabold text-ink">
                        {brlShort(g.current)}{' '}
                        <span className="font-medium text-muted">de {brlShort(g.target)}</span>
                      </span>
                      <span className="font-semibold text-faint">{g.deadlineLabel}</span>
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>
        );
      })}
    </>
  );
}

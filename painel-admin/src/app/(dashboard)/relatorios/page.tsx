import Link from 'next/link';

import { BarChart } from '@/components/charts';
import { PageHeader } from '@/components/PageHeader';
import { Card, CategoryDot, ProgressBar, StatCard } from '@/components/ui';
import { getReports, requireAdminSession } from '@/lib/data';
import { brlShort, pct } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default async function RelatoriosPage() {
  await requireAdminSession();
  const r = await getReports();
  const maxBalance = r.ranking[0]?.balance || 1;
  const maxRate = Math.max(1, ...r.savingsByMonth.map((s) => s.rate));

  return (
    <>
      <PageHeader title="Relatórios" subtitle="Dados agregados de todos os usuários" />

      <section className="mb-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Receitas (6 meses)" value={brlShort(r.totalIn)} />
        <StatCard label="Despesas (6 meses)" value={brlShort(r.totalOut)} />
        <StatCard label="Saldo agregado" value={brlShort(r.aggregateBalance)} />
        <StatCard label="Poupança média" value={pct(r.avgSavingsRate)} />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <div className="flex items-start justify-between">
            <h2 className="text-sm font-extrabold text-ink">Evolução mensal</h2>
            <div className="flex gap-3 pt-1 text-[11px] font-bold text-muted">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-[3px] bg-brand" /> Receitas
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-[3px] bg-rust-bright" /> Despesas
              </span>
            </div>
          </div>
          <div className="mt-5">
            <BarChart data={r.evolution} />
          </div>
        </Card>

        <Card>
          <h2 className="text-sm font-extrabold text-ink">Taxa de poupança por mês</h2>
          <div className="mt-5 flex items-end gap-3" style={{ height: 180 }}>
            {r.savingsByMonth.map((s) => (
              <div key={s.key} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full flex-1 items-end justify-center">
                  <div
                    className="w-6 rounded-t bg-brand"
                    style={{ height: `${Math.max(0, (s.rate / maxRate) * 100)}%` }}
                    title={`${s.rate}%`}
                  />
                </div>
                <span className="text-xs font-bold text-ink">{s.rate}%</span>
                <span className="text-[11px] font-bold text-faint">{s.label}</span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-sm font-extrabold text-ink">Distribuição por categoria</h2>
          {r.distribution.length === 0 ? (
            <p className="text-sm font-medium text-muted">Sem lançamentos ainda.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {r.distribution.map((c) => (
                <div key={c.name}>
                  <div className="mb-1.5 flex items-baseline justify-between text-xs">
                    <span className="flex items-center gap-2 font-bold text-ink">
                      <CategoryDot name={c.name} />
                      {c.name}
                    </span>
                    <span className="font-bold text-muted">
                      {brlShort(c.amount)} · {c.pct}%
                    </span>
                  </div>
                  <ProgressBar value={c.pct} color={c.color} height={9} />
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <h2 className="mb-4 text-sm font-extrabold text-ink">Ranking por saldo</h2>
          {r.ranking.length === 0 ? (
            <p className="text-sm font-medium text-muted">Nenhum usuário ainda.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {r.ranking.map((u, i) => (
                <div key={u.id}>
                  <div className="mb-1.5 flex items-baseline justify-between text-xs">
                    <Link
                      href={`/usuarios/${u.id}`}
                      className="font-bold text-ink hover:text-brand-dark">
                      {i + 1}. {u.name}
                    </Link>
                    <span className="font-extrabold text-ink">{brlShort(u.balance)}</span>
                  </div>
                  <ProgressBar
                    value={Math.max(0, (u.balance / maxBalance) * 100)}
                    color={u.balance < 0 ? '#C0512F' : '#0F7A56'}
                    height={9}
                  />
                </div>
              ))}
            </div>
          )}
        </Card>
      </section>
    </>
  );
}

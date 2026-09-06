import Link from 'next/link';

import { BarChart } from '@/components/charts';
import { PageHeader } from '@/components/PageHeader';
import { Card, CategoryDot, ProgressBar, StatCard } from '@/components/ui';
import {
  aggregateBalance,
  avgSavingsRate,
  categoryDistribution,
  monthlyEvolution,
  savingsRateByMonth,
  sumBy,
  usersRankedByBalance,
} from '@/lib/aggregate';
import { brlShort, pct } from '@/lib/format';
import { transactions } from '@/lib/mock';

export default function RelatoriosPage() {
  const evolution = monthlyEvolution();
  const savings = savingsRateByMonth();
  const dist = categoryDistribution();
  const ranking = usersRankedByBalance();
  const maxBalance = ranking[0]?.balance || 1;
  const maxRate = Math.max(1, ...savings.map((s) => s.rate));

  const totalIn = sumBy(transactions, 'income');
  const totalOut = sumBy(transactions, 'expense');

  return (
    <>
      <PageHeader title="Relatórios" subtitle="abr–set 2026 · dados agregados de todos os usuários" />

      <section className="mb-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Receitas (6 meses)" value={brlShort(totalIn)} />
        <StatCard label="Despesas (6 meses)" value={brlShort(totalOut)} />
        <StatCard label="Saldo agregado" value={brlShort(aggregateBalance())} />
        <StatCard label="Poupança média" value={pct(avgSavingsRate())} />
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
            <BarChart data={evolution} />
          </div>
        </Card>

        <Card>
          <h2 className="text-sm font-extrabold text-ink">Taxa de poupança por mês</h2>
          <div className="mt-5 flex items-end gap-3" style={{ height: 180 }}>
            {savings.map((s) => (
              <div key={s.key} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full flex-1 items-end justify-center">
                  <div
                    className="w-6 rounded-t bg-brand"
                    style={{ height: `${(s.rate / maxRate) * 100}%` }}
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
          <div className="flex flex-col gap-3">
            {dist.map((c) => (
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
        </Card>

        <Card>
          <h2 className="mb-4 text-sm font-extrabold text-ink">Ranking por saldo</h2>
          <div className="flex flex-col gap-3">
            {ranking.map((u, i) => (
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
                  value={(u.balance / maxBalance) * 100}
                  color={u.balance < 0 ? '#C0512F' : '#0F7A56'}
                  height={9}
                />
              </div>
            ))}
          </div>
        </Card>
      </section>
    </>
  );
}

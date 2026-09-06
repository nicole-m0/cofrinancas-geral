import Link from 'next/link';

import { BarChart } from '@/components/charts';
import { Icon } from '@/components/Icon';
import { PageHeader } from '@/components/PageHeader';
import { Avatar, Card, CategoryDot, ProgressBar, StatCard } from '@/components/ui';
import {
  activeUsers,
  aggregateBalance,
  avgSavingsRate,
  categoryDistribution,
  monthlyEvolution,
  recurringIncomePerMonth,
  sumBy,
  totalUsers,
  txInMonth,
} from '@/lib/aggregate';
import { brl, brlShort, pct, shortDate } from '@/lib/format';
import { transactions, users } from '@/lib/mock';

export default function VisaoGeralPage() {
  const evolution = monthlyEvolution();
  const distribution = categoryDistribution().slice(0, 6);
  const septTx = txInMonth();

  const latestUsers = [...users]
    .sort((a, b) => (a.joinedAt < b.joinedAt ? 1 : -1))
    .slice(0, 5);
  const latestTx = [...transactions]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 8);

  return (
    <>
      <PageHeader title="Visão geral" subtitle="Setembro 2026 · dados em mock, sem backend" />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Usuários" value={String(totalUsers())} hint={`${activeUsers()} ativos`} />
        <StatCard label="Saldo agregado" value={brlShort(aggregateBalance())} />
        <StatCard label="Receita recorrente / mês" value={brlShort(recurringIncomePerMonth())} />
        <StatCard label="Transações em set" value={String(septTx.length)} />
        <StatCard label="Poupança média" value={pct(avgSavingsRate())} />
      </section>

      <section className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-sm font-extrabold text-ink">Evolução mensal</h2>
              <p className="mt-0.5 text-xs font-medium text-muted">Receitas × despesas · todos os usuários</p>
            </div>
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
          <h2 className="text-sm font-extrabold text-ink">Distribuição por categoria</h2>
          <p className="mt-0.5 text-xs font-medium text-muted">Despesas acumuladas (abr–set)</p>
          <div className="mt-4 flex flex-col gap-3">
            {distribution.map((c) => (
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
                <ProgressBar value={c.pct} color={c.color} />
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card padding="p-0">
          <div className="flex items-center justify-between border-b border-hair p-4">
            <h2 className="text-sm font-extrabold text-ink">Últimos usuários</h2>
            <Link href="/usuarios" className="text-xs font-bold text-brand hover:text-brand-dark">
              Ver todos
            </Link>
          </div>
          <ul>
            {latestUsers.map((u) => (
              <li key={u.id} className="border-b border-hair last:border-0">
                <Link
                  href={`/usuarios/${u.id}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-sunken/60">
                  <Avatar initials={u.initials} size={36} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-bold text-ink">{u.name}</div>
                    <div className="truncate text-xs font-medium text-muted">
                      Entrou em {shortDate(u.joinedAt)} · {u.city}
                    </div>
                  </div>
                  <span className="text-sm font-extrabold text-ink">{brlShort(u.balance)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>

        <Card padding="p-0">
          <div className="flex items-center justify-between border-b border-hair p-4">
            <h2 className="text-sm font-extrabold text-ink">Últimas transações</h2>
            <Link href="/transacoes" className="text-xs font-bold text-brand hover:text-brand-dark">
              Ver todas
            </Link>
          </div>
          <ul>
            {latestTx.map((t) => {
              const u = users.find((x) => x.id === t.userId);
              return (
                <li
                  key={t.id}
                  className="flex items-center gap-3 border-b border-hair px-4 py-3 last:border-0">
                  <CategoryDot name={t.categoryName} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-bold text-ink">{t.title}</div>
                    <div className="truncate text-xs font-medium text-muted">
                      {u?.name} · {shortDate(t.date)}
                    </div>
                  </div>
                  <span
                    className={`text-sm font-extrabold ${
                      t.kind === 'income' ? 'text-brand' : 'text-ink'
                    }`}>
                    {t.kind === 'income' ? '+ ' : '− '}
                    {brl(t.amount)}
                  </span>
                </li>
              );
            })}
          </ul>
        </Card>
      </section>

      <section className="mt-4">
        <Card>
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-sunken text-muted">
              <Icon name="wallet" size={18} />
            </span>
            <p className="text-xs font-medium leading-relaxed text-muted">
              Receitas × despesas do mês:{' '}
              <strong className="text-ink">{brlShort(sumBy(septTx, 'income'))}</strong> entraram e{' '}
              <strong className="text-ink">{brlShort(sumBy(septTx, 'expense'))}</strong> saíram em
              setembro.
            </p>
          </div>
        </Card>
      </section>
    </>
  );
}

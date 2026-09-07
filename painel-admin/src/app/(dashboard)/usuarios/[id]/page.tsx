import { notFound } from 'next/navigation';

import { DonutChart } from '@/components/charts';
import { PageHeader } from '@/components/PageHeader';
import { Avatar, Badge, Card, CategoryDot, ProgressBar, StatCard } from '@/components/ui';
import { getUserDetail, requireAdminSession } from '@/lib/data';
import { brl, brlShort, pct, shortDate } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default async function UsuarioDetalhePage({ params }: PageProps<'/usuarios/[id]'>) {
  await requireAdminSession();
  const { id } = await params;
  const user = await getUserDetail(id);
  if (!user) notFound();

  const dist = user.distribution;
  const recent = user.transactions.slice(0, 12);

  return (
    <>
      <PageHeader
        title={user.name}
        subtitle={`${user.email} · ${user.city || '—'}`}
        backHref="/usuarios"
        backLabel="Usuários"
        actions={
          <>
            <Badge tone={user.role === 'ADMIN' ? 'gold' : 'neutral'}>{user.role}</Badge>
            <Badge>{user.plan}</Badge>
          </>
        }
      />

      <div className="mb-4 flex items-center gap-4 rounded-2xl border border-hair bg-card p-5">
        <Avatar initials={user.initials} size={56} />
        <div>
          <div className="text-base font-extrabold text-ink">{user.name}</div>
          <div className="text-xs font-medium text-muted">
            Entrou em {shortDate(user.joinedAt)} · {user.goals.length} metas ·{' '}
            {user.transactions.length} transações
          </div>
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Saldo atual" value={brl(user.balance)} />
        <StatCard label="Receitas / mês" value={brlShort(user.monthIncome)} />
        <StatCard label="Despesas / mês" value={brlShort(user.monthExpense)} />
        <StatCard
          label="Taxa de poupança"
          value={pct(user.savingsRate)}
          delta={user.savingsRate < 0 ? 'no vermelho' : undefined}
          deltaDir={user.savingsRate < 0 ? 'down' : undefined}
        />
      </section>

      <section className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="mb-3 text-sm font-extrabold text-ink">Metas ({user.goals.length})</h2>
          <div className="flex flex-col gap-4">
            {user.goals.length === 0 && (
              <p className="text-sm font-medium text-muted">Nenhuma meta cadastrada.</p>
            )}
            {user.goals.map((g) => (
              <div key={g.id}>
                <div className="mb-1.5 flex items-baseline justify-between gap-3">
                  <span className="truncate text-sm font-bold text-ink">{g.title}</span>
                  <span className="shrink-0 text-xs font-bold text-muted">
                    {brlShort(g.current)} / {brlShort(g.target)}
                  </span>
                </div>
                <ProgressBar value={g.progress} color={g.color} />
                <div className="mt-1 flex justify-between text-[11px] font-semibold text-faint">
                  <span>{g.type}</span>
                  <span>{g.done ? 'concluída' : g.deadlineLabel}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="mb-3 text-sm font-extrabold text-ink">Recorrentes ({user.recurring.length})</h2>
          <ul className="flex flex-col">
            {user.recurring.length === 0 && (
              <p className="text-sm font-medium text-muted">Nenhuma regra recorrente.</p>
            )}
            {user.recurring.map((r) => (
              <li
                key={r.id}
                className="flex items-center gap-3 border-b border-hair py-3 last:border-0">
                <CategoryDot name={r.categoryName} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-bold text-ink">{r.name}</div>
                  <div className="text-xs font-medium text-muted">
                    {r.frequency}
                    {r.nextDate ? ` · próx. ${shortDate(r.nextDate)}` : ''}
                  </div>
                </div>
                <span className="text-sm font-extrabold text-ink">
                  {r.kind === 'income' ? '+ ' : '− '}
                  {brl(r.amount)}
                </span>
                <Badge tone={r.active ? 'green' : 'neutral'}>{r.active ? 'ativa' : 'pausada'}</Badge>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <section className="mt-4 grid gap-4 lg:grid-cols-[1fr_1.4fr]">
        <Card>
          <h2 className="mb-4 text-sm font-extrabold text-ink">Distribuição por categoria</h2>
          {dist.length === 0 ? (
            <p className="text-sm font-medium text-muted">Sem despesas classificadas.</p>
          ) : (
            <div className="flex items-center gap-5">
              <DonutChart
                size={128}
                strokeWidth={20}
                segments={dist.map((d) => ({ value: d.amount, color: d.color }))}
                centerLabel="TOTAL"
                centerValue={brlShort(dist.reduce((s, d) => s + d.amount, 0))}
              />
              <div className="flex-1">
                {dist.map((d) => (
                  <div key={d.name} className="flex items-center gap-2 py-1 text-xs">
                    <CategoryDot name={d.name} />
                    <span className="flex-1 font-semibold text-ink-soft">{d.name}</span>
                    <span className="font-bold text-muted">{d.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        <Card padding="p-0">
          <h2 className="border-b border-hair p-4 text-sm font-extrabold text-ink">
            Transações recentes
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-sm">
              <tbody>
                {recent.length === 0 && (
                  <tr>
                    <td className="px-4 py-8 text-center text-sm font-medium text-muted">
                      Nenhuma transação.
                    </td>
                  </tr>
                )}
                {recent.map((t) => (
                  <tr key={t.id} className="border-b border-hair last:border-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <CategoryDot name={t.categoryName} />
                        <div>
                          <div className="font-bold text-ink">{t.title}</div>
                          <div className="text-xs font-medium text-muted">
                            {t.categoryName}
                            {t.recurring ? ' · recorrente' : ''}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right text-xs font-semibold text-muted">
                      {shortDate(t.date)}
                    </td>
                    <td
                      className={`whitespace-nowrap px-4 py-3 text-right font-extrabold ${
                        t.kind === 'income' ? 'text-brand' : 'text-ink'
                      }`}>
                      {t.kind === 'income' ? '+ ' : '− '}
                      {brl(t.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>
    </>
  );
}

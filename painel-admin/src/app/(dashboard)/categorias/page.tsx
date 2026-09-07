import { DonutChart } from '@/components/charts';
import { PageHeader } from '@/components/PageHeader';
import { Badge, Card, CategoryDot } from '@/components/ui';
import { getCategoryStats, requireAdminSession } from '@/lib/data';
import { brl, brlShort } from '@/lib/format';

export const dynamic = 'force-dynamic';

type StatRow = {
  id: string;
  name: string;
  kind: 'income' | 'expense';
  amount: number;
  count: number;
  usersUsing: number;
  avg: number;
};

export default async function CategoriasPage() {
  await requireAdminSession();
  const stats = await getCategoryStats();

  return (
    <>
      <PageHeader
        title="Categorias"
        subtitle={`${stats.total} categorias · ${stats.classified} lançamentos classificados`}
      />

      <section className="mb-6 grid gap-4 lg:grid-cols-[1fr_1.6fr]">
        <Card>
          <h2 className="mb-4 text-sm font-extrabold text-ink">Peso das despesas</h2>
          {stats.distribution.length === 0 ? (
            <p className="text-sm font-medium text-muted">Sem despesas ainda.</p>
          ) : (
            <div className="flex items-center gap-5">
              <DonutChart
                size={132}
                strokeWidth={20}
                segments={stats.distribution.map((d) => ({ value: d.amount, color: d.color }))}
                centerLabel="TOTAL"
                centerValue={brlShort(stats.distribution.reduce((s, d) => s + d.amount, 0))}
              />
              <div className="flex-1">
                {stats.distribution.map((d) => (
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
          <h2 className="border-b border-hair p-4 text-sm font-extrabold text-ink">Despesas</h2>
          <CategoryTable rows={stats.expense} />
        </Card>
      </section>

      <Card padding="p-0">
        <h2 className="border-b border-hair p-4 text-sm font-extrabold text-ink">Receitas</h2>
        <CategoryTable rows={stats.income} />
      </Card>
    </>
  );
}

function CategoryTable({ rows }: { rows: StatRow[] }) {
  if (rows.length === 0) {
    return <p className="p-4 text-sm font-medium text-muted">Nada por aqui ainda.</p>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] text-sm">
        <thead>
          <tr className="border-b border-hair text-left text-[11px] font-extrabold uppercase tracking-wide text-faint">
            <th className="px-4 py-3">Categoria</th>
            <th className="px-4 py-3 text-right">Total</th>
            <th className="px-4 py-3 text-right">Lançamentos</th>
            <th className="px-4 py-3 text-right">Usuários</th>
            <th className="px-4 py-3 text-right">Média</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-b border-hair last:border-0">
              <td className="px-4 py-3">
                <span className="flex items-center gap-2.5 font-bold text-ink">
                  <CategoryDot name={r.name} />
                  {r.name}
                  <Badge tone={r.kind === 'income' ? 'green' : 'neutral'}>
                    {r.kind === 'income' ? 'receita' : 'despesa'}
                  </Badge>
                </span>
              </td>
              <td className="px-4 py-3 text-right font-extrabold text-ink">{brlShort(r.amount)}</td>
              <td className="px-4 py-3 text-right font-bold text-muted">{r.count}</td>
              <td className="px-4 py-3 text-right font-bold text-muted">{r.usersUsing}</td>
              <td className="px-4 py-3 text-right font-semibold text-muted">{brl(r.avg)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

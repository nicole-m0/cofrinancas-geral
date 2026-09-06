import { DonutChart } from '@/components/charts';
import { PageHeader } from '@/components/PageHeader';
import { Badge, Card, CategoryDot } from '@/components/ui';
import { categoryDistribution } from '@/lib/aggregate';
import { brl, brlShort } from '@/lib/format';
import { categories, transactions } from '@/lib/mock';

export default function CategoriasPage() {
  const stats = categories.map((c) => {
    const rows = transactions.filter((t) => t.categoryName === c.name);
    const amount = rows.reduce((s, t) => s + t.amount, 0);
    const usersUsing = new Set(rows.map((t) => t.userId)).size;
    return {
      ...c,
      amount,
      count: rows.length,
      usersUsing,
      avg: rows.length ? amount / rows.length : 0,
    };
  });

  const expenseStats = stats.filter((s) => s.kind === 'expense').sort((a, b) => b.amount - a.amount);
  const incomeStats = stats.filter((s) => s.kind === 'income').sort((a, b) => b.amount - a.amount);
  const dist = categoryDistribution();

  return (
    <>
      <PageHeader
        title="Categorias"
        subtitle={`${categories.length} categorias · ${transactions.length} lançamentos classificados`}
      />

      <section className="mb-6 grid gap-4 lg:grid-cols-[1fr_1.6fr]">
        <Card>
          <h2 className="mb-4 text-sm font-extrabold text-ink">Peso das despesas</h2>
          <div className="flex items-center gap-5">
            <DonutChart
              size={132}
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
        </Card>

        <Card padding="p-0">
          <h2 className="border-b border-hair p-4 text-sm font-extrabold text-ink">Despesas</h2>
          <CategoryTable rows={expenseStats} />
        </Card>
      </section>

      <Card padding="p-0">
        <h2 className="border-b border-hair p-4 text-sm font-extrabold text-ink">Receitas</h2>
        <CategoryTable rows={incomeStats} />
      </Card>
    </>
  );
}

function CategoryTable({
  rows,
}: {
  rows: {
    id: string;
    name: string;
    kind: 'income' | 'expense';
    amount: number;
    count: number;
    usersUsing: number;
    avg: number;
  }[];
}) {
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

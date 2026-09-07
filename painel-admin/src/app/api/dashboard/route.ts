import { prisma } from "@/lib/prisma";
import { requireUser, targetUserId, toErrorResponse, serializeGoal, serializeTransaction } from "@/lib/api";
import {
  balanceOf,
  categoryDistribution,
  groupByDate,
  inMonth,
  monthlyEvolution,
  savingsRate,
  sumKind,
  upcomingFromRecurring,
} from "@/lib/finance";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const me = await requireUser(req);
    const userId = targetUserId(req, me);

    const [user, txs, goals, recurring, categories] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.transaction.findMany({ where: { userId }, orderBy: [{ date: "desc" }, { createdAt: "desc" }] }),
      prisma.goal.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        include: { entries: { orderBy: { createdAt: "desc" } } },
      }),
      prisma.recurringRule.findMany({ where: { userId } }),
      prisma.category.findMany({ where: { userId } }),
    ]);

    if (!user) return Response.json({ error: "Usuário não encontrado" }, { status: 404 });

    const colorMap = Object.fromEntries(categories.map((c) => [c.name, c.color]));
    const monthTx = inMonth(txs);
    const income = sumKind(monthTx, "income");
    const expense = sumKind(monthTx, "expense");

    return Response.json({
      profile: {
        name: user.name,
        firstName: user.name.split(/\s+/)[0],
        email: user.email,
        initials: user.initials || user.name.slice(0, 1).toUpperCase(),
        monthLabel: new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" }),
      },
      balance: {
        current: balanceOf(txs),
        income,
        expense,
        savedPct: savingsRate(income, expense),
      },
      categorySpend: categoryDistribution(monthTx, colorMap).map((c) => ({
        name: c.name,
        amount: c.amount,
        pct: c.pct,
        color: c.color,
      })),
      months: monthlyEvolution(txs).map((m) => ({
        label: m.label,
        income: m.income,
        expense: m.expense,
      })),
      groupedTransactions: groupByDate(txs).map((g) => ({
        key: g.key,
        label: g.label,
        total: g.total,
        items: g.items.map(serializeTransaction),
      })),
      upcoming: upcomingFromRecurring(recurring, categories),
      goals: goals.map(serializeGoal),
    });
  } catch (err) {
    return toErrorResponse(err);
  }
}

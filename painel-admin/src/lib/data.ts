import "server-only";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CATEGORY_COLORS } from "@/lib/mock";
import {
  balanceOf,
  categoryDistribution,
  goalProgress,
  monthWindow,
  monthlyEvolution,
  savingsRate,
  sumKind,
} from "@/lib/finance";

/** Garante sessão de ADMIN nas páginas do painel. Redireciona se faltar. */
export async function requireAdminSession() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/login?error=forbidden");
  return session.user;
}

const num = (v: unknown) => Number(v as never);

export type UserKpi = {
  id: string;
  name: string;
  email: string;
  initials: string;
  city: string;
  plan: string;
  role: "USER" | "ADMIN";
  joinedAt: string;
  status: "ativo" | "inativo";
  balance: number;
  monthIncome: number;
  monthExpense: number;
  savingsRate: number;
  goals: number;
  transactions: number;
};

/** Lista de usuários com KPIs financeiros calculados no banco. */
export async function listUsersWithKpis(): Promise<UserKpi[]> {
  const { start, end } = monthWindow();
  const [users, allSums, monthSums, goalCounts, txCounts, lastTx] = await Promise.all([
    prisma.user.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.transaction.groupBy({ by: ["userId", "kind"], _sum: { amount: true } }),
    prisma.transaction.groupBy({
      by: ["userId", "kind"],
      _sum: { amount: true },
      where: { date: { gte: start, lt: end } },
    }),
    prisma.goal.groupBy({ by: ["userId"], _count: { _all: true } }),
    prisma.transaction.groupBy({ by: ["userId"], _count: { _all: true } }),
    prisma.transaction.groupBy({ by: ["userId"], _max: { date: true } }),
  ]);

  const pick = (rows: typeof allSums, userId: string, kind: "income" | "expense") =>
    num(rows.find((r) => r.userId === userId && r.kind === kind)?._sum.amount ?? 0);

  const goalsBy = new Map(goalCounts.map((g) => [g.userId, g._count._all]));
  const txBy = new Map(txCounts.map((t) => [t.userId, t._count._all]));
  const lastBy = new Map(lastTx.map((t) => [t.userId, t._max.date]));
  const cutoff = new Date(Date.now() - 1000 * 60 * 60 * 24 * 45);

  return users.map((u) => {
    const monthIncome = pick(monthSums, u.id, "income");
    const monthExpense = pick(monthSums, u.id, "expense");
    const last = lastBy.get(u.id) ?? null;
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      initials: u.initials || u.name.slice(0, 2).toUpperCase(),
      city: u.city,
      plan: u.plan,
      role: u.role,
      joinedAt: u.createdAt.toISOString().slice(0, 10),
      status: last && last >= cutoff ? "ativo" : "inativo",
      balance: pick(allSums, u.id, "income") - pick(allSums, u.id, "expense"),
      monthIncome,
      monthExpense,
      savingsRate: savingsRate(monthIncome, monthExpense),
      goals: goalsBy.get(u.id) ?? 0,
      transactions: txBy.get(u.id) ?? 0,
    };
  });
}

export async function getOverview() {
  const users = await listUsersWithKpis();
  const txs = await prisma.transaction.findMany({ orderBy: { date: "desc" } });
  const { start, end } = monthWindow();
  const monthTx = txs.filter((t) => t.date >= start && t.date < end);

  const recurring = await prisma.recurringRule.findMany({ where: { active: true } });
  const recurringIncome = recurring
    .filter((r) => r.kind === "income" && r.frequency === "Mensal")
    .reduce((s, r) => s + num(r.amount), 0);

  const latestUsers = users.slice(0, 5);
  const latestTx = txs.slice(0, 8);

  return {
    totalUsers: users.length,
    activeUsers: users.filter((u) => u.status === "ativo").length,
    aggregateBalance: users.reduce((s, u) => s + u.balance, 0),
    recurringIncome,
    monthTxCount: monthTx.length,
    avgSavingsRate: users.length ? users.reduce((s, u) => s + u.savingsRate, 0) / users.length : 0,
    monthIncome: sumKind(monthTx, "income"),
    monthExpense: sumKind(monthTx, "expense"),
    evolution: monthlyEvolution(txs),
    distribution: categoryDistribution(txs, CATEGORY_COLORS).slice(0, 6),
    latestUsers,
    latestTx: latestTx.map((t) => ({
      id: t.id,
      title: t.title,
      userId: t.userId,
      categoryName: t.categoryName,
      date: t.date.toISOString().slice(0, 10),
      amount: num(t.amount),
      kind: t.kind,
    })),
  };
}

export async function getUserDetail(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      goals: { orderBy: { createdAt: "desc" } },
      recurring: { orderBy: { createdAt: "desc" } },
      transactions: { orderBy: [{ date: "desc" }, { createdAt: "desc" }] },
    },
  });
  if (!user) return null;

  const { start, end } = monthWindow();
  const monthTx = user.transactions.filter((t) => t.date >= start && t.date < end);
  const monthIncome = sumKind(monthTx, "income");
  const monthExpense = sumKind(monthTx, "expense");

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    initials: user.initials || user.name.slice(0, 2).toUpperCase(),
    city: user.city,
    plan: user.plan,
    role: user.role,
    joinedAt: user.createdAt.toISOString().slice(0, 10),
    balance: balanceOf(user.transactions),
    monthIncome,
    monthExpense,
    savingsRate: savingsRate(monthIncome, monthExpense),
    distribution: categoryDistribution(user.transactions, CATEGORY_COLORS),
    goals: user.goals.map((g) => ({
      id: g.id,
      title: g.title,
      type: g.type,
      current: num(g.current),
      target: num(g.target),
      color: g.color,
      done: g.done,
      deadlineLabel: g.deadlineLabel ?? "",
      progress: goalProgress(g),
    })),
    recurring: user.recurring.map((r) => ({
      id: r.id,
      name: r.name,
      categoryName: r.categoryName,
      frequency: r.frequency,
      amount: num(r.amount),
      kind: r.kind,
      active: r.active,
      nextDate: r.nextDate ? r.nextDate.toISOString().slice(0, 10) : "",
    })),
    transactions: user.transactions.map((t) => ({
      id: t.id,
      title: t.title,
      categoryName: t.categoryName,
      date: t.date.toISOString().slice(0, 10),
      amount: num(t.amount),
      kind: t.kind,
      recurring: t.recurring,
    })),
  };
}

export async function listCategoryNames(): Promise<string[]> {
  const cats = await prisma.category.findMany({ select: { name: true }, distinct: ["name"], orderBy: { name: "asc" } });
  const names = new Set(cats.map((c) => c.name));
  for (const n of Object.keys(CATEGORY_COLORS)) names.add(n);
  return [...names].sort((a, b) => a.localeCompare(b, "pt-BR"));
}

export async function listAllTransactions() {
  const [rows, users, categoryNames] = await Promise.all([
    prisma.transaction.findMany({ orderBy: [{ date: "desc" }, { createdAt: "desc" }], take: 2000 }),
    prisma.user.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    listCategoryNames(),
  ]);
  const nameBy = new Map(users.map((u) => [u.id, u.name]));
  return {
    users,
    categoryNames,
    rows: rows.map((t) => ({
      id: t.id,
      title: t.title,
      userId: t.userId,
      userName: nameBy.get(t.userId) ?? "—",
      categoryName: t.categoryName,
      date: t.date.toISOString().slice(0, 10),
      amount: num(t.amount),
      kind: t.kind,
      recurring: t.recurring,
    })),
  };
}

export async function listAllGoals() {
  const [rows, users] = await Promise.all([
    prisma.goal.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.user.findMany({ select: { id: true, name: true } }),
  ]);
  const nameBy = new Map(users.map((u) => [u.id, u.name]));
  return rows.map((g) => ({
    id: g.id,
    userId: g.userId,
    userName: nameBy.get(g.userId) ?? "—",
    title: g.title,
    type: g.type,
    current: num(g.current),
    target: num(g.target),
    color: g.color,
    done: g.done,
    deadlineLabel: g.deadlineLabel ?? "",
    progress: goalProgress(g),
  }));
}

export async function listAllRecurring() {
  const [rows, users] = await Promise.all([
    prisma.recurringRule.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.user.findMany({ select: { id: true, name: true } }),
  ]);
  const nameBy = new Map(users.map((u) => [u.id, u.name]));
  return rows.map((r) => ({
    id: r.id,
    userId: r.userId,
    userName: nameBy.get(r.userId) ?? "—",
    name: r.name,
    categoryName: r.categoryName,
    frequency: r.frequency,
    amount: num(r.amount),
    kind: r.kind,
    active: r.active,
    nextDate: r.nextDate ? r.nextDate.toISOString().slice(0, 10) : "",
  }));
}

export async function getCategoryStats() {
  const [cats, txs] = await Promise.all([
    prisma.category.findMany(),
    prisma.transaction.findMany(),
  ]);

  // agrega por NOME (as categorias são por usuário, mas o painel vê o conjunto)
  const byName = new Map<string, { kind: string; color: string }>();
  for (const c of cats) if (!byName.has(c.name)) byName.set(c.name, { kind: c.kind, color: c.color });

  const stats = [...byName.entries()].map(([name, meta]) => {
    const rows = txs.filter((t) => t.categoryName === name);
    const amount = rows.reduce((s, t) => s + num(t.amount), 0);
    return {
      id: name,
      name,
      kind: meta.kind as "income" | "expense",
      color: meta.color,
      amount,
      count: rows.length,
      usersUsing: new Set(rows.map((t) => t.userId)).size,
      avg: rows.length ? amount / rows.length : 0,
    };
  });

  return {
    total: byName.size,
    classified: txs.length,
    expense: stats.filter((s) => s.kind === "expense").sort((a, b) => b.amount - a.amount),
    income: stats.filter((s) => s.kind === "income").sort((a, b) => b.amount - a.amount),
    distribution: categoryDistribution(txs, CATEGORY_COLORS),
  };
}

export async function getReports() {
  const users = await listUsersWithKpis();
  const txs = await prisma.transaction.findMany();
  const evolution = monthlyEvolution(txs);
  return {
    totalIn: sumKind(txs, "income"),
    totalOut: sumKind(txs, "expense"),
    aggregateBalance: users.reduce((s, u) => s + u.balance, 0),
    avgSavingsRate: users.length ? users.reduce((s, u) => s + u.savingsRate, 0) / users.length : 0,
    evolution,
    savingsByMonth: evolution.map((m) => ({
      ...m,
      rate: m.income > 0 ? Math.round(((m.income - m.expense) / m.income) * 100) : 0,
    })),
    distribution: categoryDistribution(txs, CATEGORY_COLORS),
    ranking: [...users].sort((a, b) => b.balance - a.balance),
  };
}

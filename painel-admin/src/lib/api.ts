import { ZodError } from "zod";
import type {
  Category,
  Goal,
  GoalEntry,
  Preferences,
  RecurringRule,
  Transaction,
} from "@prisma/client";

import { auth } from "@/auth";
import { verifyMobileToken } from "@/lib/tokens";

export type AuthUser = {
  id: string;
  role: "USER" | "ADMIN";
  name: string;
  email: string;
};

/**
 * Resolve o usuário da requisição por qualquer um dos dois caminhos:
 *  - cookie de sessão Auth.js (painel-admin, mesma origem)
 *  - header `Authorization: Bearer <jwt>` (app Expo)
 */
export async function getAuthUser(req: Request): Promise<AuthUser | null> {
  const session = await auth();
  if (session?.user?.id) {
    return {
      id: session.user.id,
      role: session.user.role,
      name: session.user.name ?? "",
      email: session.user.email ?? "",
    };
  }

  const header = req.headers.get("authorization");
  if (header?.toLowerCase().startsWith("bearer ")) {
    const payload = await verifyMobileToken(header.slice(7).trim());
    if (payload) {
      return { id: payload.sub, role: payload.role, name: payload.name, email: payload.email };
    }
  }

  return null;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export async function requireUser(req: Request): Promise<AuthUser> {
  const user = await getAuthUser(req);
  if (!user) throw new ApiError(401, "Não autenticado");
  return user;
}

export async function requireAdmin(req: Request): Promise<AuthUser> {
  const user = await requireUser(req);
  if (user.role !== "ADMIN") throw new ApiError(403, "Acesso restrito a administradores");
  return user;
}

/**
 * Qual usuário a rota deve operar. Usuário comum: sempre ele mesmo.
 * Admin: pode passar `?userId=` para agir sobre outra conta.
 */
export function targetUserId(req: Request, me: AuthUser): string {
  const q = new URL(req.url).searchParams.get("userId");
  if (q && q !== me.id) {
    if (me.role !== "ADMIN") throw new ApiError(403, "Sem permissão sobre dados de outro usuário");
    return q;
  }
  return me.id;
}

export async function readJson(req: Request): Promise<unknown> {
  try {
    return await req.json();
  } catch {
    throw new ApiError(400, "Corpo JSON inválido");
  }
}

/** Converte qualquer erro num Response JSON coerente. */
export function toErrorResponse(err: unknown): Response {
  if (err instanceof ApiError) {
    return Response.json({ error: err.message }, { status: err.status });
  }
  if (err instanceof ZodError) {
    return Response.json(
      { error: "Dados inválidos", issues: err.flatten().fieldErrors },
      { status: 422 },
    );
  }
  // Erro de unicidade do Prisma (ex.: e-mail/categoria repetida)
  if (typeof err === "object" && err !== null && (err as { code?: string }).code === "P2002") {
    return Response.json({ error: "Registro já existe" }, { status: 409 });
  }
  console.error("[api] erro não tratado:", err);
  return Response.json({ error: "Erro interno" }, { status: 500 });
}

/* ------------------------------------------------------------------ */
/* Serializers — Decimal -> number, Date -> "yyyy-mm-dd"              */
/* ------------------------------------------------------------------ */

const num = (v: unknown): number => Number(v as never);
const day = (d: Date | null): string | null => (d ? d.toISOString().slice(0, 10) : null);

export function serializeTransaction(t: Transaction) {
  return {
    id: t.id,
    userId: t.userId,
    title: t.title,
    amount: num(t.amount),
    kind: t.kind,
    categoryName: t.categoryName,
    date: day(t.date)!,
    recurring: t.recurring,
    account: t.account ?? undefined,
  };
}

export function serializeCategory(c: Category) {
  return {
    id: c.id,
    name: c.name,
    kind: c.kind,
    icon: c.icon,
    color: c.color,
    tint: c.tint,
  };
}

export function serializeGoal(g: Goal & { entries?: GoalEntry[] }) {
  return {
    id: g.id,
    userId: g.userId,
    title: g.title,
    type: g.type,
    current: num(g.current),
    target: num(g.target),
    color: g.color,
    pct: g.pct ?? undefined,
    deadlineLabel: g.deadlineLabel ?? undefined,
    rightLabel: g.rightLabel ?? undefined,
    done: g.done,
    doneLabel: g.doneLabel ?? undefined,
    categoryName: g.categoryName ?? undefined,
    projection: g.projection ?? undefined,
    projectionTitle: g.projectionTitle ?? undefined,
    monthly: g.monthly != null ? num(g.monthly) : undefined,
    termLabel: g.termLabel ?? undefined,
    history: (g.entries ?? []).map((e) => ({
      id: e.id,
      title: e.title,
      meta: e.meta,
      amount: num(e.amount),
    })),
  };
}

export function serializeRecurring(r: RecurringRule) {
  return {
    id: r.id,
    userId: r.userId,
    name: r.name,
    kind: r.kind,
    amount: num(r.amount),
    frequency: r.frequency,
    sub: r.sub,
    categoryName: r.categoryName,
    active: r.active,
    nextDate: day(r.nextDate) ?? undefined,
  };
}

export function serializePreferences(p: Preferences) {
  return {
    notifications: {
      dueBill: p.dueBill,
      goalLimit80: p.goalLimit80,
      weeklyDigest: p.weeklyDigest,
    },
    chartStyle: p.chartStyle as "donut" | "bars",
    balanceHidden: p.balanceHidden,
    showTags: p.showTags,
  };
}

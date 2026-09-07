import type { NextRequest } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireUser, readJson, toErrorResponse, ApiError, serializeRecurring } from "@/lib/api";
import { recurringUpdate, toDate } from "@/lib/schemas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function loadOwned(id: string, meId: string, isAdmin: boolean) {
  const rule = await prisma.recurringRule.findUnique({ where: { id } });
  if (!rule) throw new ApiError(404, "Regra não encontrada");
  if (rule.userId !== meId && !isAdmin) throw new ApiError(403, "Sem permissão");
  return rule;
}

export async function PATCH(req: NextRequest, ctx: RouteContext<"/api/recurring/[id]">) {
  try {
    const me = await requireUser(req);
    const { id } = await ctx.params;
    const current = await loadOwned(id, me.id, me.role === "ADMIN");
    const input = recurringUpdate.parse(await readJson(req));

    const nextCategory = input.categoryName ?? current.categoryName;
    const nextFrequency = input.frequency ?? current.frequency;

    const updated = await prisma.recurringRule.update({
      where: { id },
      data: {
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.kind !== undefined ? { kind: input.kind } : {}),
        ...(input.amount !== undefined ? { amount: input.amount } : {}),
        ...(input.frequency !== undefined ? { frequency: input.frequency } : {}),
        ...(input.categoryName !== undefined ? { categoryName: input.categoryName } : {}),
        ...(input.active !== undefined ? { active: input.active } : {}),
        ...(input.nextDate !== undefined ? { nextDate: toDate(input.nextDate) } : {}),
        ...(input.frequency !== undefined || input.categoryName !== undefined
          ? { sub: `${nextFrequency} · ${nextCategory}` }
          : {}),
      },
    });
    return Response.json(serializeRecurring(updated));
  } catch (err) {
    return toErrorResponse(err);
  }
}

export async function DELETE(req: NextRequest, ctx: RouteContext<"/api/recurring/[id]">) {
  try {
    const me = await requireUser(req);
    const { id } = await ctx.params;
    await loadOwned(id, me.id, me.role === "ADMIN");
    await prisma.recurringRule.delete({ where: { id } });
    return new Response(null, { status: 204 });
  } catch (err) {
    return toErrorResponse(err);
  }
}

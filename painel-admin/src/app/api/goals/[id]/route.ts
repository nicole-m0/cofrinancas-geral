import type { NextRequest } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireUser, readJson, toErrorResponse, ApiError, serializeGoal } from "@/lib/api";
import { goalUpdate } from "@/lib/schemas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function loadOwned(id: string, meId: string, isAdmin: boolean) {
  const goal = await prisma.goal.findUnique({ where: { id } });
  if (!goal) throw new ApiError(404, "Meta não encontrada");
  if (goal.userId !== meId && !isAdmin) throw new ApiError(403, "Sem permissão");
  return goal;
}

export async function PATCH(req: NextRequest, ctx: RouteContext<"/api/goals/[id]">) {
  try {
    const me = await requireUser(req);
    const { id } = await ctx.params;
    await loadOwned(id, me.id, me.role === "ADMIN");
    const input = goalUpdate.parse(await readJson(req));

    const updated = await prisma.goal.update({
      where: { id },
      data: {
        ...(input.title !== undefined ? { title: input.title } : {}),
        ...(input.type !== undefined ? { type: input.type } : {}),
        ...(input.target !== undefined ? { target: input.target } : {}),
        ...(input.current !== undefined ? { current: input.current } : {}),
        ...(input.color !== undefined ? { color: input.color } : {}),
        ...(input.pct !== undefined ? { pct: input.pct } : {}),
        ...(input.deadlineLabel !== undefined ? { deadlineLabel: input.deadlineLabel } : {}),
        ...(input.categoryName !== undefined ? { categoryName: input.categoryName } : {}),
        ...(input.done !== undefined ? { done: input.done } : {}),
        ...(input.doneLabel !== undefined ? { doneLabel: input.doneLabel } : {}),
      },
      include: { entries: { orderBy: { createdAt: "desc" } } },
    });
    return Response.json(serializeGoal(updated));
  } catch (err) {
    return toErrorResponse(err);
  }
}

export async function DELETE(req: NextRequest, ctx: RouteContext<"/api/goals/[id]">) {
  try {
    const me = await requireUser(req);
    const { id } = await ctx.params;
    await loadOwned(id, me.id, me.role === "ADMIN");
    await prisma.goal.delete({ where: { id } });
    return new Response(null, { status: 204 });
  } catch (err) {
    return toErrorResponse(err);
  }
}

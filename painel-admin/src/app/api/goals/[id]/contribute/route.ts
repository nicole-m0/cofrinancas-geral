import type { NextRequest } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireUser, readJson, toErrorResponse, ApiError, serializeGoal } from "@/lib/api";
import { goalContribute } from "@/lib/schemas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, ctx: RouteContext<"/api/goals/[id]/contribute">) {
  try {
    const me = await requireUser(req);
    const { id } = await ctx.params;
    const input = goalContribute.parse(await readJson(req));

    const goal = await prisma.goal.findUnique({ where: { id } });
    if (!goal) throw new ApiError(404, "Meta não encontrada");
    if (goal.userId !== me.id && me.role !== "ADMIN") throw new ApiError(403, "Sem permissão");

    const updated = await prisma.goal.update({
      where: { id },
      data: {
        current: { increment: input.amount },
        entries: {
          create: {
            title: input.amount >= 0 ? "Aporte manual" : "Resgate",
            meta: input.note ?? "agora · Transferência",
            amount: input.amount,
          },
        },
      },
      include: { entries: { orderBy: { createdAt: "desc" } } },
    });
    return Response.json(serializeGoal(updated));
  } catch (err) {
    return toErrorResponse(err);
  }
}

import type { NextRequest } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireUser, readJson, toErrorResponse, ApiError, serializeTransaction } from "@/lib/api";
import { transactionUpdate, toDate } from "@/lib/schemas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function loadOwned(id: string, meId: string, isAdmin: boolean) {
  const tx = await prisma.transaction.findUnique({ where: { id } });
  if (!tx) throw new ApiError(404, "Transação não encontrada");
  if (tx.userId !== meId && !isAdmin) throw new ApiError(403, "Sem permissão");
  return tx;
}

export async function PATCH(req: NextRequest, ctx: RouteContext<"/api/transactions/[id]">) {
  try {
    const me = await requireUser(req);
    const { id } = await ctx.params;
    await loadOwned(id, me.id, me.role === "ADMIN");
    const input = transactionUpdate.parse(await readJson(req));

    const updated = await prisma.transaction.update({
      where: { id },
      data: {
        ...(input.title !== undefined ? { title: input.title } : {}),
        ...(input.amount !== undefined ? { amount: input.amount } : {}),
        ...(input.kind !== undefined ? { kind: input.kind } : {}),
        ...(input.categoryName !== undefined ? { categoryName: input.categoryName } : {}),
        ...(input.date !== undefined ? { date: toDate(input.date) } : {}),
        ...(input.recurring !== undefined ? { recurring: input.recurring } : {}),
        ...(input.account !== undefined ? { account: input.account } : {}),
      },
    });
    return Response.json(serializeTransaction(updated));
  } catch (err) {
    return toErrorResponse(err);
  }
}

export async function DELETE(req: NextRequest, ctx: RouteContext<"/api/transactions/[id]">) {
  try {
    const me = await requireUser(req);
    const { id } = await ctx.params;
    await loadOwned(id, me.id, me.role === "ADMIN");
    await prisma.transaction.delete({ where: { id } });
    return new Response(null, { status: 204 });
  } catch (err) {
    return toErrorResponse(err);
  }
}

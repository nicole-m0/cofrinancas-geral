import type { NextRequest } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireUser, readJson, toErrorResponse, ApiError, serializeCategory } from "@/lib/api";
import { categoryUpdate } from "@/lib/schemas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function loadOwned(id: string, meId: string, isAdmin: boolean) {
  const cat = await prisma.category.findUnique({ where: { id } });
  if (!cat) throw new ApiError(404, "Categoria não encontrada");
  if (cat.userId !== meId && !isAdmin) throw new ApiError(403, "Sem permissão");
  return cat;
}

export async function PATCH(req: NextRequest, ctx: RouteContext<"/api/categories/[id]">) {
  try {
    const me = await requireUser(req);
    const { id } = await ctx.params;
    await loadOwned(id, me.id, me.role === "ADMIN");
    const input = categoryUpdate.parse(await readJson(req));

    const updated = await prisma.category.update({
      where: { id },
      data: {
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.kind !== undefined ? { kind: input.kind } : {}),
        ...(input.color !== undefined ? { color: input.color } : {}),
        ...(input.tint !== undefined ? { tint: input.tint } : {}),
        ...(input.icon !== undefined ? { icon: input.icon } : {}),
      },
    });
    return Response.json(serializeCategory(updated));
  } catch (err) {
    return toErrorResponse(err);
  }
}

export async function DELETE(req: NextRequest, ctx: RouteContext<"/api/categories/[id]">) {
  try {
    const me = await requireUser(req);
    const { id } = await ctx.params;
    await loadOwned(id, me.id, me.role === "ADMIN");
    await prisma.category.delete({ where: { id } });
    return new Response(null, { status: 204 });
  } catch (err) {
    return toErrorResponse(err);
  }
}

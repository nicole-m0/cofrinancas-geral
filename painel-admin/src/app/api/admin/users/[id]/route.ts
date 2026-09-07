import type { NextRequest } from "next/server";
import { hash } from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { requireAdmin, readJson, toErrorResponse, ApiError } from "@/lib/api";
import { adminUserUpdate } from "@/lib/schemas";
import { getUserDetail } from "@/lib/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, ctx: RouteContext<"/api/admin/users/[id]">) {
  try {
    await requireAdmin(req);
    const { id } = await ctx.params;
    const detail = await getUserDetail(id);
    if (!detail) throw new ApiError(404, "Usuário não encontrado");
    return Response.json(detail);
  } catch (err) {
    return toErrorResponse(err);
  }
}

export async function PATCH(req: NextRequest, ctx: RouteContext<"/api/admin/users/[id]">) {
  try {
    const admin = await requireAdmin(req);
    const { id } = await ctx.params;
    const input = adminUserUpdate.parse(await readJson(req));

    if (id === admin.id && input.role && input.role !== "ADMIN") {
      throw new ApiError(400, "Você não pode remover o próprio acesso de admin");
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.email !== undefined ? { email: input.email } : {}),
        ...(input.role !== undefined ? { role: input.role } : {}),
        ...(input.plan !== undefined ? { plan: input.plan } : {}),
        ...(input.city !== undefined ? { city: input.city } : {}),
        ...(input.password ? { passwordHash: await hash(input.password, 10) } : {}),
      },
    });
    return Response.json({ id: user.id, name: user.name, email: user.email, role: user.role, plan: user.plan });
  } catch (err) {
    return toErrorResponse(err);
  }
}

export async function DELETE(req: NextRequest, ctx: RouteContext<"/api/admin/users/[id]">) {
  try {
    const admin = await requireAdmin(req);
    const { id } = await ctx.params;
    if (id === admin.id) throw new ApiError(400, "Você não pode excluir a própria conta");
    await prisma.user.delete({ where: { id } });
    return new Response(null, { status: 204 });
  } catch (err) {
    return toErrorResponse(err);
  }
}

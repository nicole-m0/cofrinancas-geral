import { hash } from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { requireAdmin, readJson, toErrorResponse } from "@/lib/api";
import { adminUserCreate } from "@/lib/schemas";
import { listUsersWithKpis } from "@/lib/data";
import { DEFAULT_CATEGORIES } from "@/lib/mock";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    await requireAdmin(req);
    return Response.json(await listUsersWithKpis());
  } catch (err) {
    return toErrorResponse(err);
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin(req);
    const input = adminUserCreate.parse(await readJson(req));

    const initials = input.name
      .trim()
      .split(/\s+/)
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        passwordHash: await hash(input.password, 10),
        role: input.role,
        plan: input.plan,
        city: input.city ?? "",
        initials,
        preferences: { create: {} },
        categories: { create: DEFAULT_CATEGORIES },
      },
    });

    return Response.json(
      { id: user.id, name: user.name, email: user.email, role: user.role, plan: user.plan },
      { status: 201 },
    );
  } catch (err) {
    return toErrorResponse(err);
  }
}

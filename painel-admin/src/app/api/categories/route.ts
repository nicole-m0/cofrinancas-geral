import { prisma } from "@/lib/prisma";
import {
  requireUser,
  targetUserId,
  readJson,
  toErrorResponse,
  serializeCategory,
} from "@/lib/api";
import { categoryCreate } from "@/lib/schemas";
import { colorFor } from "@/lib/mock";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const me = await requireUser(req);
    const userId = targetUserId(req, me);
    const rows = await prisma.category.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    });
    return Response.json(rows.map(serializeCategory));
  } catch (err) {
    return toErrorResponse(err);
  }
}

export async function POST(req: Request) {
  try {
    const me = await requireUser(req);
    const userId = targetUserId(req, me);
    const input = categoryCreate.parse(await readJson(req));

    const cat = await prisma.category.create({
      data: {
        userId,
        name: input.name,
        kind: input.kind,
        color: input.color ?? colorFor(input.name),
        tint: input.tint ?? "#F1EFEA",
        icon: input.icon ?? "film",
      },
    });
    return Response.json(serializeCategory(cat), { status: 201 });
  } catch (err) {
    return toErrorResponse(err);
  }
}

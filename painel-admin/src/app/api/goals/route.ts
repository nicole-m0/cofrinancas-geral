import { prisma } from "@/lib/prisma";
import { requireUser, targetUserId, readJson, toErrorResponse, serializeGoal } from "@/lib/api";
import { goalCreate } from "@/lib/schemas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const me = await requireUser(req);
    const userId = targetUserId(req, me);
    const rows = await prisma.goal.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { entries: { orderBy: { createdAt: "desc" } } },
    });
    return Response.json(rows.map(serializeGoal));
  } catch (err) {
    return toErrorResponse(err);
  }
}

export async function POST(req: Request) {
  try {
    const me = await requireUser(req);
    const userId = targetUserId(req, me);
    const input = goalCreate.parse(await readJson(req));

    const goal = await prisma.goal.create({
      data: {
        userId,
        title: input.title,
        type: input.type,
        target: input.target,
        current: input.current ?? 0,
        color: input.color ?? "#0F7A56",
        pct: input.pct,
        deadlineLabel: input.deadlineLabel,
        categoryName: input.categoryName,
      },
      include: { entries: true },
    });
    return Response.json(serializeGoal(goal), { status: 201 });
  } catch (err) {
    return toErrorResponse(err);
  }
}

import { prisma } from "@/lib/prisma";
import { requireUser, targetUserId, readJson, toErrorResponse, serializeRecurring } from "@/lib/api";
import { recurringCreate, toDate } from "@/lib/schemas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const me = await requireUser(req);
    const userId = targetUserId(req, me);
    const rows = await prisma.recurringRule.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return Response.json(rows.map(serializeRecurring));
  } catch (err) {
    return toErrorResponse(err);
  }
}

export async function POST(req: Request) {
  try {
    const me = await requireUser(req);
    const userId = targetUserId(req, me);
    const input = recurringCreate.parse(await readJson(req));

    const rule = await prisma.recurringRule.create({
      data: {
        userId,
        name: input.name,
        kind: input.kind,
        amount: input.amount,
        frequency: input.frequency,
        sub: `${input.frequency} · ${input.categoryName}`,
        categoryName: input.categoryName,
        active: input.active,
        nextDate: input.nextDate ? toDate(input.nextDate) : null,
      },
    });
    return Response.json(serializeRecurring(rule), { status: 201 });
  } catch (err) {
    return toErrorResponse(err);
  }
}

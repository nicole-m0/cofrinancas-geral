import { prisma } from "@/lib/prisma";
import {
  requireUser,
  targetUserId,
  readJson,
  toErrorResponse,
  serializeTransaction,
} from "@/lib/api";
import { transactionCreate, toDate } from "@/lib/schemas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const me = await requireUser(req);
    const userId = targetUserId(req, me);
    const url = new URL(req.url);

    const kind = url.searchParams.get("kind");
    const categoryName = url.searchParams.get("categoryName");
    const from = url.searchParams.get("from");
    const to = url.searchParams.get("to");
    const limit = Math.min(Number(url.searchParams.get("limit")) || 500, 2000);

    const rows = await prisma.transaction.findMany({
      where: {
        userId,
        ...(kind === "income" || kind === "expense" ? { kind } : {}),
        ...(categoryName ? { categoryName } : {}),
        ...(from || to
          ? { date: { ...(from ? { gte: toDate(from) } : {}), ...(to ? { lte: toDate(to) } : {}) } }
          : {}),
      },
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
      take: limit,
    });

    return Response.json(rows.map(serializeTransaction));
  } catch (err) {
    return toErrorResponse(err);
  }
}

export async function POST(req: Request) {
  try {
    const me = await requireUser(req);
    const userId = targetUserId(req, me);
    const input = transactionCreate.parse(await readJson(req));

    const tx = await prisma.transaction.create({
      data: {
        userId,
        title: input.title,
        amount: input.amount,
        kind: input.kind,
        categoryName: input.categoryName,
        date: toDate(input.date),
        recurring: input.recurring,
        account: input.account,
      },
    });

    if (input.recurring) {
      const freq = input.frequency ?? "Mensal";
      await prisma.recurringRule.create({
        data: {
          userId,
          name: input.title,
          kind: input.kind,
          amount: input.amount,
          frequency: freq,
          sub: `${freq} · ${input.categoryName}`,
          categoryName: input.categoryName,
          active: true,
          nextDate: toDate(input.date),
        },
      });
    }

    return Response.json(serializeTransaction(tx), { status: 201 });
  } catch (err) {
    return toErrorResponse(err);
  }
}

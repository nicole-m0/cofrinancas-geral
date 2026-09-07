import { prisma } from "@/lib/prisma";
import { requireUser, targetUserId, readJson, toErrorResponse, serializePreferences } from "@/lib/api";
import { preferencesUpdate } from "@/lib/schemas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function ensure(userId: string) {
  return (
    (await prisma.preferences.findUnique({ where: { userId } })) ??
    (await prisma.preferences.create({ data: { userId } }))
  );
}

export async function GET(req: Request) {
  try {
    const me = await requireUser(req);
    const userId = targetUserId(req, me);
    return Response.json(serializePreferences(await ensure(userId)));
  } catch (err) {
    return toErrorResponse(err);
  }
}

export async function PATCH(req: Request) {
  try {
    const me = await requireUser(req);
    const userId = targetUserId(req, me);
    await ensure(userId);
    const input = preferencesUpdate.parse(await readJson(req));

    const updated = await prisma.preferences.update({
      where: { userId },
      data: {
        ...(input.notifications?.dueBill !== undefined ? { dueBill: input.notifications.dueBill } : {}),
        ...(input.notifications?.goalLimit80 !== undefined
          ? { goalLimit80: input.notifications.goalLimit80 }
          : {}),
        ...(input.notifications?.weeklyDigest !== undefined
          ? { weeklyDigest: input.notifications.weeklyDigest }
          : {}),
        ...(input.chartStyle !== undefined ? { chartStyle: input.chartStyle } : {}),
        ...(input.balanceHidden !== undefined ? { balanceHidden: input.balanceHidden } : {}),
        ...(input.showTags !== undefined ? { showTags: input.showTags } : {}),
      },
    });
    return Response.json(serializePreferences(updated));
  } catch (err) {
    return toErrorResponse(err);
  }
}

import { prisma } from "@/lib/prisma";
import { requireUser, toErrorResponse, serializePreferences } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const me = await requireUser(req);
    const user = await prisma.user.findUnique({
      where: { id: me.id },
      include: { preferences: true },
    });
    if (!user) return Response.json({ error: "Usuário não encontrado" }, { status: 404 });

    let prefs = user.preferences;
    if (!prefs) prefs = await prisma.preferences.create({ data: { userId: user.id } });

    return Response.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        initials: user.initials,
        plan: user.plan,
        city: user.city,
        monthLabel: new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" }),
        firstName: user.name.split(/\s+/)[0],
      },
      preferences: serializePreferences(prefs),
    });
  } catch (err) {
    return toErrorResponse(err);
  }
}

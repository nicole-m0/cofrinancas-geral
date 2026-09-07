import { toErrorResponse } from "@/lib/api";
import { createUser, publicUser } from "@/lib/users";
import { signMobileToken } from "@/lib/tokens";

// Registro do app Expo — devolve um Bearer token pronto pra uso.
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user = await createUser(body);
    const token = await signMobileToken({
      sub: user.id,
      role: user.role,
      name: user.name,
      email: user.email,
    });
    return Response.json({ token, user: publicUser(user) }, { status: 201 });
  } catch (err) {
    return toErrorResponse(err);
  }
}

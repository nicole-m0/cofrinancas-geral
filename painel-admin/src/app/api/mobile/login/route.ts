import { toErrorResponse } from "@/lib/api";
import { verifyCredentials, publicUser } from "@/lib/users";
import { signMobileToken } from "@/lib/tokens";

// Login do app Expo — devolve um Bearer token.
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user = await verifyCredentials(body);
    const token = await signMobileToken({
      sub: user.id,
      role: user.role,
      name: user.name,
      email: user.email,
    });
    return Response.json({ token, user: publicUser(user) });
  } catch (err) {
    return toErrorResponse(err);
  }
}

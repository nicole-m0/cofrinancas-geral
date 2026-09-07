import { toErrorResponse } from "@/lib/api";
import { createUser, publicUser } from "@/lib/users";

// Registro para o painel-admin. Depois de criar, o cliente faz signIn() do Auth.js.
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user = await createUser(body);
    return Response.json({ ok: true, user: publicUser(user) }, { status: 201 });
  } catch (err) {
    return toErrorResponse(err);
  }
}

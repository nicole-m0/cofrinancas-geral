import "server-only";
import { SignJWT, jwtVerify } from "jose";
import type { Role } from "@prisma/client";

const secret = process.env.AUTH_SECRET;
if (!secret) throw new Error("AUTH_SECRET ausente no ambiente");
const key = new TextEncoder().encode(secret);

export type MobileTokenPayload = {
  sub: string;
  role: Role;
  name: string;
  email: string;
};

/** Token portador (Bearer) para o app Expo — 30 dias. */
export async function signMobileToken(payload: MobileTokenPayload): Promise<string> {
  return new SignJWT({ role: payload.role, name: payload.name, email: payload.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(key);
}

export async function verifyMobileToken(token: string): Promise<MobileTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] });
    if (!payload.sub) return null;
    return {
      sub: String(payload.sub),
      role: (payload.role as Role) ?? "USER",
      name: String(payload.name ?? ""),
      email: String(payload.email ?? ""),
    };
  } catch {
    return null;
  }
}

import { hash, compare } from "bcryptjs";
import { z } from "zod";
import type { User } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { ApiError } from "@/lib/api";
import { DEFAULT_CATEGORIES } from "@/lib/mock";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Nome muito curto"),
  email: z.string().trim().toLowerCase().email("E-mail inválido"),
  password: z.string().min(6, "Senha precisa de ao menos 6 caracteres"),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("E-mail inválido"),
  password: z.string().min(1, "Informe a senha"),
});

function initialsFrom(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

/** Cria o usuário (o primeiro registrado vira ADMIN) já com Preferences padrão. */
export async function createUser(input: z.infer<typeof registerSchema>): Promise<User> {
  const data = registerSchema.parse(input);

  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) throw new ApiError(409, "E-mail já cadastrado");

  const isFirstUser = (await prisma.user.count()) === 0;

  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash: await hash(data.password, 10),
      role: isFirstUser ? "ADMIN" : "USER",
      initials: initialsFrom(data.name),
      preferences: { create: {} },
      categories: { create: DEFAULT_CATEGORIES },
    },
  });
}

/** Valida e-mail + senha; lança ApiError(401) se inválido. */
export async function verifyCredentials(input: z.infer<typeof loginSchema>): Promise<User> {
  const data = loginSchema.parse(input);
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user || !(await compare(data.password, user.passwordHash))) {
    throw new ApiError(401, "E-mail ou senha incorretos");
  }
  return user;
}

export function publicUser(u: User) {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    initials: u.initials,
    plan: u.plan,
    city: u.city,
  };
}

/**
 * Seed de desenvolvimento — garante credenciais conhecidas para testar:
 *   - um usuário comum para o app Expo / Expo Go
 *   - a senha do admin do painel (redefinida para um valor conhecido)
 *
 *   npm run db:seed
 *
 * Credenciais (app Expo):
 *   e-mail: demo@cofrinancas.app
 *   senha:  demo1234
 *
 * Credenciais (painel admin):
 *   e-mail: nicole@cofrinancas.dev
 *   senha:  Admin@2026
 *
 * Idempotente: rodar de novo só reafirma essas senhas.
 */
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

import { DEFAULT_CATEGORIES } from "../src/lib/mock";

const prisma = new PrismaClient();

const DEMO = {
  name: "Usuária Demo",
  email: "demo@cofrinancas.app",
  password: "demo1234",
  city: "São Paulo",
};

const ADMIN = {
  email: "nicole@cofrinancas.dev",
  password: "Admin@2026",
};

function initialsFrom(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

async function main() {
  const passwordHash = await hash(DEMO.password, 10);
  const isFirstUser = (await prisma.user.count()) === 0;

  const user = await prisma.user.upsert({
    where: { email: DEMO.email },
    update: { passwordHash },
    create: {
      name: DEMO.name,
      email: DEMO.email,
      passwordHash,
      role: isFirstUser ? "ADMIN" : "USER",
      initials: initialsFrom(DEMO.name),
      city: DEMO.city,
      preferences: { create: {} },
      categories: { create: DEFAULT_CATEGORIES },
    },
  });

  console.log("\n✅ Usuário de teste pronto:\n");
  console.log(`   e-mail: ${DEMO.email}`);
  console.log(`   senha:  ${DEMO.password}`);
  console.log(`   role:   ${user.role}`);
  console.log(`   id:     ${user.id}\n`);

  const admin = await prisma.user.update({
    where: { email: ADMIN.email },
    data: { passwordHash: await hash(ADMIN.password, 10) },
    select: { email: true, role: true, id: true },
  });

  console.log("✅ Senha do admin redefinida:\n");
  console.log(`   e-mail: ${admin.email}`);
  console.log(`   senha:  ${ADMIN.password}`);
  console.log(`   role:   ${admin.role}`);
  console.log(`   id:     ${admin.id}\n`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

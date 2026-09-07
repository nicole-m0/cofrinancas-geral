import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root so Next doesn't pick up an unrelated
  // package-lock.json from a parent directory.
  turbopack: {
    root: __dirname,
  },
  // Mantém Prisma / bcrypt fora do bundle do servidor (usam binários / require dinâmico).
  serverExternalPackages: ["@prisma/client", ".prisma/client", "bcryptjs"],
};

export default nextConfig;

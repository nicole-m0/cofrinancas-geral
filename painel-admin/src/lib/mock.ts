/**
 * Metadados de categoria (cores / ícones / tints) usados tanto para pintar
 * gráficos quanto para semear os defaults de uma conta nova.
 *
 * Não é mais "dados em mock": o banco (Prisma) é a fonte de verdade.
 */
import type { IconName } from "@/components/Icon";

export const CATEGORY_COLORS: Record<string, string> = {
  Moradia: "#3E5C76",
  Mercado: "#0F7A56",
  Transporte: "#5B5BD6",
  Delivery: "#C0512F",
  Lazer: "#C08A2F",
  "Saúde": "#2E8B8B",
  Outros: "#9AA0A0",
  "Salário": "#0F7A56",
  Freelance: "#3E5C76",
  Investimentos: "#5B5BD6",
};

export function colorFor(name: string): string {
  return CATEGORY_COLORS[name] ?? "#9AA0A0";
}

type CatSeed = {
  name: string;
  kind: "expense" | "income";
  color: string;
  tint: string;
  icon: string;
};

/** Categorias padrão criadas junto com uma conta nova. */
export const DEFAULT_CATEGORIES: CatSeed[] = [
  { name: "Mercado", kind: "expense", color: "#0F7A56", tint: "#E4F1EB", icon: "cart" },
  { name: "Moradia", kind: "expense", color: "#3E5C76", tint: "#ECF0F4", icon: "house" },
  { name: "Transporte", kind: "expense", color: "#5B5BD6", tint: "#EDEDFB", icon: "car" },
  { name: "Delivery", kind: "expense", color: "#C0512F", tint: "#FBEAE4", icon: "bag" },
  { name: "Lazer", kind: "expense", color: "#C08A2F", tint: "#F7EFDF", icon: "film" },
  { name: "Saúde", kind: "expense", color: "#2E8B8B", tint: "#E6F2F2", icon: "heart" },
  { name: "Outros", kind: "expense", color: "#9AA0A0", tint: "#EFEFEE", icon: "tag" },
  { name: "Salário", kind: "income", color: "#0F7A56", tint: "#E4F1EB", icon: "briefcase" },
  { name: "Freelance", kind: "income", color: "#3E5C76", tint: "#ECF0F4", icon: "wallet" },
  { name: "Investimentos", kind: "income", color: "#5B5BD6", tint: "#EDEDFB", icon: "chart" },
];

// Mantido só para compatibilidade de tipo com componentes que importavam daqui.
export type { IconName };

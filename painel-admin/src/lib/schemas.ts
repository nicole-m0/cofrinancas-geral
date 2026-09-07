import { z } from "zod";

export const txKind = z.enum(["expense", "income"]);
export const frequency = z.enum(["Mensal", "Semanal", "Quinzenal", "Anual"]);
export const goalType = z.enum([
  "Poupança com prazo",
  "Redução de gasto",
  "Limite de gasto",
  "Limite por categoria",
]);

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use o formato yyyy-mm-dd");

export const transactionCreate = z.object({
  title: z.string().trim().min(1).max(120),
  amount: z.number().positive(),
  kind: txKind,
  categoryName: z.string().trim().min(1).max(80),
  date: isoDate,
  recurring: z.boolean().optional().default(false),
  frequency: frequency.optional(),
  account: z.string().trim().max(80).optional(),
});
export const transactionUpdate = transactionCreate.partial().omit({ frequency: true });

export const categoryCreate = z.object({
  name: z.string().trim().min(1).max(80),
  kind: txKind,
  color: z.string().trim().max(9).optional(),
  tint: z.string().trim().max(9).optional(),
  icon: z.string().trim().max(40).optional(),
});
export const categoryUpdate = categoryCreate.partial();

export const goalCreate = z.object({
  title: z.string().trim().min(1).max(120),
  type: goalType,
  target: z.number().nonnegative().default(0),
  current: z.number().nonnegative().optional(),
  color: z.string().trim().max(9).optional(),
  pct: z.number().int().min(0).max(100).optional(),
  deadlineLabel: z.string().trim().max(60).optional(),
  categoryName: z.string().trim().max(80).optional(),
});
export const goalUpdate = goalCreate.partial().extend({
  done: z.boolean().optional(),
  doneLabel: z.string().trim().max(60).optional(),
});

export const goalContribute = z.object({
  amount: z.number(),
  note: z.string().trim().max(80).optional(),
});

export const recurringCreate = z.object({
  name: z.string().trim().min(1).max(120),
  kind: txKind,
  amount: z.number().positive(),
  frequency: frequency.default("Mensal"),
  categoryName: z.string().trim().min(1).max(80),
  active: z.boolean().optional().default(true),
  nextDate: isoDate.optional(),
});
export const recurringUpdate = recurringCreate.partial();

export const preferencesUpdate = z.object({
  notifications: z
    .object({
      dueBill: z.boolean().optional(),
      goalLimit80: z.boolean().optional(),
      weeklyDigest: z.boolean().optional(),
    })
    .optional(),
  chartStyle: z.enum(["donut", "bars"]).optional(),
  balanceHidden: z.boolean().optional(),
  showTags: z.boolean().optional(),
});

export const adminUserCreate = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(6),
  role: z.enum(["USER", "ADMIN"]).optional().default("USER"),
  plan: z.enum(["Gratuito", "Pro"]).optional().default("Gratuito"),
  city: z.string().trim().max(80).optional(),
});
export const adminUserUpdate = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  email: z.string().trim().toLowerCase().email().optional(),
  password: z.string().min(6).optional(),
  role: z.enum(["USER", "ADMIN"]).optional(),
  plan: z.enum(["Gratuito", "Pro"]).optional(),
  city: z.string().trim().max(80).optional(),
});

/** "2026-09-05" -> Date UTC meia-noite */
export function toDate(iso: string): Date {
  return new Date(`${iso}T00:00:00.000Z`);
}

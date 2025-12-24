import { z } from "zod";

export const rouletteCreateSchema = z.object({
  title: z.string().min(2).max(60),
  description: z.string().min(4).max(160),
  icon: z.string().min(1).max(8),
  options: z.array(z.string().min(1).max(60)).min(2),
});

export const optionCreateSchema = z.object({
  label: z.string().min(1).max(60),
  weight: z.number().min(1).max(10).optional(),
});

export const proposalCreateSchema = z.object({
  rouletteId: z.string().cuid(),
  label: z.string().min(1).max(60),
});

export const rouletteUpdateSchema = z.object({
  title: z.string().min(2).max(60).optional(),
  description: z.string().min(4).max(160).optional(),
  icon: z.string().min(1).max(8).optional(),
});

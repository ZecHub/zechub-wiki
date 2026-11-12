import { z } from "zod";

export const qrCodeBodySchema = z.object({
  address: z.string().min(1, "Address is required"),
  amount: z.union([z.number(), z.string()]).optional(),
  label: z.string().optional(),
  message: z.string().optional(),
  memo: z.string().optional(),
});


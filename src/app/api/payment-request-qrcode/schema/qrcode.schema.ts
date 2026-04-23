import { z } from "zod";

export const qrCodeBodySchema = z.object({
  address: z.string().min(10),
  amount: z.number().optional(),
  label: z.string(),
  memo: z.string().optional(),
});

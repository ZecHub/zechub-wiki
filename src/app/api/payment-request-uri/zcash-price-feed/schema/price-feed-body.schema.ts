import { z } from "zod";

const MAX_AMOUNT = 1_000_000_000;

export const priceFeedBodySchema = z.object({
  amount: z.coerce.number().positive().max(MAX_AMOUNT),
  from: z.enum(["usd", "zec"]),
  to: z.enum(["usd", "zec"]),
});

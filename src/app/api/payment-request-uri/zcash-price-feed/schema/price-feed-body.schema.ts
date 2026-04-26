import { z } from "zod";

export const priceFeedBodySchema = z.object({
  amount: z.coerce.number().positive(),
  from: z.enum(["usd", "zec"]),
  to: z.enum(["usd", "zec"]),
});

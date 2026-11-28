import { z } from "zod";

// Upper bounds on each field cap the input size (defence in depth alongside the
// 16 KB request-body limit in the route). These are generous ceilings that never
// reject a legitimate payment request; the exact ZIP-321 limits (e.g. the
// 512-byte memo) are enforced separately by validateZip321Payment.
export const qrCodeBodySchema = z.object({
  address: z.string().min(1, "Address is required").max(1024, "Address is too long"),
  amount: z.union([z.number(), z.string().max(64, "Amount is too long")]).optional(),
  label: z.string().max(256, "Label is too long").optional(),
  message: z.string().max(512, "Message is too long").optional(),
  memo: z.string().max(1024, "Memo is too long").optional(),
});


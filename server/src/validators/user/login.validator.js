import { z } from "zod";

export const loginValidator = z.object({
  email: z.string().email().trim(),

  otp: z.coerce.number(4).optional(),

  password: z.string().trim(),

  type: z.literal("login"),
});

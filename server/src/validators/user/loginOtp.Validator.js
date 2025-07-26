import { z } from "zod";
export const loginOtpValidator = z.object({
  email: z.string().email().trim(),
  type: z.literal("login"),
});

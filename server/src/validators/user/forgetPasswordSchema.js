import { z } from "zod";

export const forgetPasswordSchema = z.object({
  email: z.string().email().trim(),
  otp: z.string().length(4).optional(),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must include an uppercase letter")
    .regex(/[a-z]/, "Must include a lowercase letter")
    .regex(/[0-9]/, "Must include a number")
    .regex(/[@$!%*?&]/, "Must include a special character")
    .trim(),
});

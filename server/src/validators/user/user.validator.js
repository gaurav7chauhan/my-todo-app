import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be less than 30 characters")
    .trim(),

  email: z.string().email("Email is invalid").trim(),

  type: z.enum(["register", "login", "forget"]),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(18, "Password must not be more than 18 characters")
    .regex(/[A-Z]/, "At least one uppercase letter")
    .regex(/[a-z]/, "At least one lowercase letter")
    .regex(/[0-9]/, "At least one number")
    .trim(),

  avatar: z.string().url("Avatar must be a valid URL").optional(),

  otp: z.string().length(4).optional(),
});

import { z } from "zod";

export const loginValidate = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username must be less than 30 characters")
      .trim()
      .optional(),

    email: z.string().email("Email is invalid").trim().optional(),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(18, "Password must not be more than 18 characters")
      .regex(/[A-Z]/, "Password must include at least one uppercase letter")
      .regex(/[a-z]/, "Password must include at least one lowercase letter")
      .regex(/[0-9]/, "Password must include at least one number")
      .regex(
        /[@$!%*?&#]/,
        "Password must include at least one special character"
      )
      .trim(),
  })
  .refine((data) => data.username || data.email, {
    message: "Please provide either username or email",
    path: ["username"],
  });

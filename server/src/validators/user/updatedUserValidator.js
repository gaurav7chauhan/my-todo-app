import { z } from "zod";

export const updateUserSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be less than 30 characters")
    .trim()
    .optional(),

  email: z.string().email("Email is invalid").trim().optional(),

  avatar: z.string().url("Avatar must be a valid URL").trim().optional(),
});

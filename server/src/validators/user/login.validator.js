import { z } from "zod";

export const loginValidator = z
  .object({
    username: z.string().trim().optional(),

    email: z.string().trim().optional(),

    otp: z.number(4).optional(),

    password: z.string().trim(),
  })
  .refine((data) => data.username || data.email, {
    message: "Please provide either username or email",
    path: ["username"],
  });

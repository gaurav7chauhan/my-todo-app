import { z } from "zod";

export const changePasswordSchema = z
  .object({
    prevPassword: z.string("Previous password is required"),
    newPassword: z
      .string("Please provide a new password")
      .min(8, "New password must be at least 8 characters")
      .max(18, "Password must not exceed 18 characters")
      .regex(/[A-Z]/, "Must contain an uppercase letter")
      .regex(/[a-z]/, "Must contain a lowercase letter")
      .regex(/[0-9]/, "Must contain a number")
      .regex(/[@$!%*?&#]/, "Must contain a special character"),

    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New password and confirm password must match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.prevPassword !== data.newPassword, {
    message: "New password must be different from previous password",
    path: ["newPassword"],
  });

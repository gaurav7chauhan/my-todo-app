import { z } from "zod";

export const sendOtpSchema = z.object({
  email: z.string().email().trim(),
  type: z.enum(["register", "login", "reset"]),
});

export const verifyOtpSchema = z.object({
  email: z.string().email().trim(),
  type: z.enum(["register", "login", "reset"]),
  otp: z.string().length(4),
});

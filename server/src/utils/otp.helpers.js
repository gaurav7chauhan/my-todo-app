import { Otp } from "../models/otp.model.js";
import { generateOtp } from "./generateOtp.js";
import { sendOtpEmail } from "./sendMail.js";

export function isOtpValid(otpDoc) {
  return otpDoc && !otpDoc.used && otpDoc.expiresAt > Date.now();
}

export async function generateAndSendOtp(email, type) {
  const otp = generateOtp();
  if (!otp) throw new ApiError(500, "OTP not generated");
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await Otp.create({ email, otp, type, expiresAt, used: false });

  await sendOtpEmail(email, otp);
  return otp;
}

import { Otp } from "../models/otp.model.js";
import { ApiError } from "../utils/ApiError.js";

export const verifyAndUseOtp = async (email, otp, type) => {
  const existingOtp = await Otp.findOne({ email, otp, type });

  if (!existingOtp) {
    throw new ApiError(400, "Invalid OTP");
  }

  if (existingOtp.expiresAt < Date.now()) {
    throw new ApiError(400, "OTP has expired");
  }

  if (existingOtp.used) {
    throw new ApiError(400, "OTP already used");
  }

  existingOtp.used = true;
  await existingOtp.save(); //validatebeforesave not used beacuse it already have all prop above
};

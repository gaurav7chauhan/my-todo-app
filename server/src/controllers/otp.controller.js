import { Otp } from "../models/otp.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateOtp } from "../utils/generateOtp.js";
import { sendOtpEmail } from "../utils/sendMail.js";
import { sendOtpSchema, verifyOtpSchema } from "../validators/otp.validator.js";

export const sendOtp = asyncHandler(async (req, res) => {
  // validate with Zod (sendOtpSchema)
  // check if existing valid OTP already exists (optional)
  // generate OTP (4-digit)
  // save to DB (Otp.create)
  // send via sendOTPEmail()
  // return ApiResponse
  const { email, type } = sendOtpSchema.parse(req.body);

  const existingOtp = await Otp.findOne({ email, type });

  if (existingOtp && !existingOtp.used && existingOtp.expiresAt > Date.now()) {
    throw new ApiError(
      429,
      "OTP already sent. Please wait or check your Email."
    );
  }

  if (existingOtp && existingOtp.expiresAt < Date.now()) {
    await Otp.findByIdAndDelete(existingOtp._id);
  }

  const otp = generateOtp();
  if (!otp) {
    throw new ApiError(500, "OTP not generated");
  }

  await Otp.create({
    email,
    otp,
    type,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes expiry
    used: false,
  });

  await sendOtpEmail(email, otp);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "OTP sent to email successfully"));
});

import { Otp } from "../models/otp.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  generateAndSendOtp,
  getExistingOtp,
  isOtpValid,
} from "../utils/otp.helpers.js";
import { sendOtpEmail } from "../utils/sendMail.js";
import { registerSchema } from "../validators/user/user.validator.js";

export const sendOtp = asyncHandler(async (req, res) => {
  const { email, type, username, password } = registerSchema.parse(req.body);

  if (type === "register") {
    if (await User.findOne({ username }))
      throw new ApiError(409, "Username already exists!");
    if (await User.findOne({ email }))
      throw new ApiError(409, "Email already exists!");
  }

  const existingOtp = await Otp.findOne({ email, type });

  if (isOtpValid(existingOtp)) {
    // Resend the same OTP if still valid
    await sendOtpEmail(email, existingOtp.otp);
    return res
      .status(200)
      .json(new ApiResponse(200, null, "OTP resent successfully"));
  }

  // Generate/send/store new OTP
  await generateAndSendOtp(email, type);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "OTP sent to email successfully"));
});

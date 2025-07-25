import { Otp } from "../models/otp.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateOtp } from "../utils/generateOtp.js";
import { sendOtpEmail } from "../utils/sendMail.js";
import { registerSchema } from "../validators/user/user.validator.js";

export const sendOtp = asyncHandler(async (req, res) => {
  // validate with Zod (sendOtpSchema)
  // check if existing valid OTP already exists (optional)
  // generate OTP (4-digit)
  // save to DB (Otp.create)
  // send via sendOTPEmail()
  // return ApiResponse
  const { email, type, username, password } = registerSchema.parse(req.body);

  const existingUser = await User.findOne({ username });
  if (type === "register" && existingUser) {
    throw new ApiError(409, "Username already exists!");
  }

  const existingEmail = await User.findOne({ email });
  if (type === "register" && existingEmail) {
    throw new ApiError(409, "email already exists!");
  }

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
  // Continue to verify OTP...

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

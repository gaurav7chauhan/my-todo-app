import { Otp } from "../models/otp.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateAndSendOtp, isOtpValid } from "../utils/otp.helpers.js";
import { sendOtpEmail } from "../utils/sendMail.js";
import { registerSchema } from "../validators/user/user.validator.js";
import { loginValidator } from "../validators/user/login.validator.js";

export const sendOtp = asyncHandler(async (req, res) => {
  let parsed;
  let existingOtp;
  let email, username, password, type;

  if (req.body.type === "register") {
    parsed = registerSchema.parse(req.body);

    ({ email, username, password, type } = parsed);

    if (await User.findOne({ username }))
      throw new ApiError(409, "Username already exists!");

    if (await User.findOne({ email }))
      throw new ApiError(409, "Email already exists!");

    existingOtp = await Otp.findOne({ email, type });
  } else if (req.body.type === "login") {
    parsed = loginValidator.parse(req.body);

    ({ email, type, password } = parsed);

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      throw new ApiError(404, "User not found. Please register to continue.");
    }

    const verifyPassword = await existingUser.isPasswordMatch(password);
    if (!verifyPassword) {
      throw new ApiError(401, "Incorrect password. Please try again.");
    }

    existingOtp = await Otp.findOne({
      email,
      type,
      used: false,
      expiresAt: { $gt: new Date() },
    });
  } else {
    throw new ApiError(400, "Invalid type");
  }

  if (isOtpValid(existingOtp)) {
    await sendOtpEmail(email, existingOtp.otp);
    return res
      .status(200)
      .json(new ApiResponse(200, null, "OTP resent successfully"));
  }

  await generateAndSendOtp(email, type);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "OTP sent to email successfully"));
});

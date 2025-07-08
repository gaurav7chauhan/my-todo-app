import { Otp } from "../models/otp.model.js";
import { Todo } from "../models/todo.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/generateToken.js";
import { verifyAndUseOtp } from "../utils/verifyAndUseOtp.js";
import { loginValidator } from "../validators/login.validator.js";
import { verifyOtpSchema } from "../validators/otp.validator.js";
import { passwordValidator } from "../validators/password.validate.js";
import { updateUserSchema } from "../validators/updatedUserValidator.js";
import { registerSchema } from "../validators/user.validator.js";
import { sendOtp } from "./otp.controller.js";

//  controllers

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, otp } = registerSchema.parse(req.body);

  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    throw new ApiError(409, "User with this email already exists");
  }

  const existingUsername = await User.findOne({ username });
  if (existingUsername) {
    throw new ApiError(409, "Username is already taken");
  }

  if (!req.file) {
    throw new ApiError(400, "Avatar file is required");
  }

  const uploadAvatar = await uploadOnCloudinary(req.file.path);
  if (!uploadAvatar) {
    throw new ApiError(400, "Avatar file is not uploaded");
  }

  await verifyAndUseOtp(email, otp, "register");

  const createUser = await User.create({
    username,
    email,
    password,
    avatar: uploadAvatar.url,
  });

  const user = await User.findById(createUser._id).select("-password");

  return res
    .status(201)
    .json(new ApiResponse(201, user, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password, otp } = loginValidator.parse(req.body);

  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });
  if (!existingUser) {
    throw new ApiError(404, "User not found. Please register to continue.");
  }

  const verifyPassword = await existingUser.isPasswordMatch(password);
  if (!verifyPassword) {
    throw new ApiError(401, "Incorrect password. Please try again.");
  }

  const accessToken = generateAccessToken(existingUser._id);
  const refreshToken = generateRefreshToken(existingUser._id);

  existingUser.refreshToken = refreshToken;
  await existingUser.save({ validateBeforeSave: false });

  const user = await User.findById(existingUser._id).select(
    "-password -refreshToken"
  );

  await verifyAndUseOtp(email, otp, "login");

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
  };

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        user,
        { accessToken: accessToken },
        "User successfully logged in"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  const user = req.user._id; //  from auth.middleware
  await User.findByIdAndUpdate(
    user,
    {
      $set: { refreshToken: null },
    },
    { new: true }
  );

  res.clearCookie("refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User successfully logged out"));
});

const changePassword = asyncHandler(async (req, res) => {
  const { prevPassword, newPassword } = passwordValidator.parse(req.body);

  const user = await User.findById(req.user._id);

  const isMatch = await user.isPasswordMatch(prevPassword);
  if (!isMatch) {
    throw new ApiError(401, "Current password is incorrect.");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Password changed successfully."));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password -otp");
  if (!user) throw new ApiError(404, "User not found");

  const todos = await Todo.find({ owner: user._id }).select(
    "title description isCompleted"
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, { user, todos }, "User profile fetched successfully")
    );
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const { setUsername, setEmail } = updateUserSchema.parse(req.body);
  if (!setUsername && !setEmail) {
    throw new ApiError(400, "Please provide data to change");
  }

  const updates = {};

  if (setUsername) updates.username = setUsername;
  if (setEmail) updates.email = setEmail;

  if (!req.file) {
    throw new ApiError(400, "Avatar file is required");
  }

  const uploadAvatar = await uploadOnCloudinary(req.file.path);
  if (!uploadAvatar) {
    throw new ApiError(400, "Avatar file not uploaded");
  }
  updates.avatar = uploadAvatar.url;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { ...updates },
    },
    { new: true }
  ).select("-password -otp");
  if (!user) throw new ApiError(400, "User not found");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User profile updated successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const tokenFromCookie = req.cookies?.refreshToken;
  const tokenFromHeader = req.headers["authorization"].replace("Bearer ", "");

  const incomingRefreshToken = tokenFromCookie || tokenFromHeader;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh token missing");
  }

  const decoded = verifyRefreshToken(incomingRefreshToken);

  if (!decoded || !decoded._id) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const accessToken = generateAccessToken(decoded._id);
  const refreshToken = generateRefreshToken(decoded._id);

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
  };

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(new ApiResponse(200, accessToken, "Tokens regenerate successfully"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  changePassword,
  getCurrentUser,
  updateUserProfile,
  refreshAccessToken,
};

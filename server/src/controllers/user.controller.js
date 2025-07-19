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
import { loginValidator } from "../validators/user/login.validator.js";
import { passwordValidator } from "../validators/user/password.validate.js";
import { forgetPasswordSchema } from "../validators/user/forgetPasswordSchema.js";
import { updateUserSchema } from "../validators/user/updatedUserValidator.js";
import { registerSchema } from "../validators/user/user.validator.js";

//  controllers

export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, otp } = registerSchema.parse(req.body);

  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    throw new ApiError(409, "User with this email already exists");
  }

  const existingUsername = await User.findOne({ username });
  if (existingUsername) {
    throw new ApiError(409, "Username is already taken");
  }

  let avatarUrl = "";
  if (req.file) {
    const uploadAvatar = await uploadOnCloudinary(req.file.path);
    if (!uploadAvatar) {
      throw new ApiError(400, "Avatar file is not uploaded");
    }
    avatarUrl = uploadAvatar.url;
  }
  if (otp) {
    await verifyAndUseOtp(email, otp, "register");
  }

  const createUser = await User.create({
    username,
    email,
    password,
    ...(avatarUrl && { avatar: avatarUrl }),
  });

  const user = await User.findById(createUser._id).select("-password");

  return res
    .status(201)
    .json(new ApiResponse(201, user, "User registered successfully"));
});

export const loginUser = asyncHandler(async (req, res) => {
  const { identifier, password, otp } = loginValidator.parse(req.body);

  // 1. Better email format check (covers more than just Gmail)
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);

  // 2. Find user:
  const existingUser = await User.findOne(
    isEmail ? { email: identifier } : { username: identifier }
  );

  if (!existingUser) {
    throw new ApiError(404, "User not found. Please register to continue.");
  }

  // 3. Password check:
  const verifyPassword = await existingUser.isPasswordMatch(password);
  if (!verifyPassword) {
    throw new ApiError(401, "Incorrect password. Please try again.");
  }

  // 4. Tokens (no changes needed for this part):
  const accessToken = generateAccessToken(existingUser._id);
  const refreshToken = generateRefreshToken(existingUser._id);

  existingUser.refreshToken = refreshToken;
  await existingUser.save({ validateBeforeSave: false });

  const user = await User.findById(existingUser._id).select(
    "-password -refreshToken"
  );

  // 5. OTP check:
  if (otp) {
    await verifyAndUseOtp(existingUser.email, otp, "login");
  }

  // ...rest of your response logic

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
      new ApiResponse(200, user, "User Successfully Logged In", {
        accessToken: accessToken,
      })
    );
});

export const logoutUser = asyncHandler(async (req, res) => {
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

export const changePassword = asyncHandler(async (req, res) => {
  const { prevPassword, newPassword, confirmPassword } =
    passwordValidator.parse(req.body);

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

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select(
    "-password -refreshToken"
  );
  if (!user) throw new ApiError(404, "User not found");

  const todos = await Todo.find({ owner: user._id }).select(
    "title isCompleted"
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, { user, todos }, "User profile fetched successfully")
    );
});

export const updateUserProfile = asyncHandler(async (req, res) => {
  const { setUsername, setEmail } = updateUserSchema.parse(req.body);

  const updates = {};

  if (setUsername) updates.username = setUsername;
  if (setEmail) updates.email = setEmail;

  if (req.file) {
    const uploadAvatar = await uploadOnCloudinary(req.file.path);
    if (!uploadAvatar) {
      throw new ApiError(400, "Avatar file not uploaded");
    }
    updates.avatar = uploadAvatar.url;
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { ...updates },
    },
    { new: true }
  ).select("-password -refreshToken");
  if (!user) throw new ApiError(400, "User not found");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User profile updated successfully"));
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken ||
    req.body?.refreshToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!incomingRefreshToken || typeof incomingRefreshToken !== "string") {
    throw new ApiError(401, "Refresh token missing or invalid");
  }

  try {
    const decoded = verifyRefreshToken(incomingRefreshToken);

    const userId = decoded.userId;

    if (!userId) {
      throw new ApiError(401, "Invalid or expired refresh token");
    }

    const user = await User.findById(userId);

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

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
          { accessToken: accessToken },
          "Tokens regenerate successfully"
        )
      );
  } catch (error) {
    console.error("Error while verifying refresh token:", error);
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

export const forgetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = forgetPasswordSchema.parse(req.body);

  if (otp) {
    await verifyAndUseOtp(email, otp, "forget");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Password update successfully"));
});

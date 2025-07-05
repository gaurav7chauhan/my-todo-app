import { User } from "../models/user.schema.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, otp, avatar } = req.body;
  if (!username || !email || !password) {
    throw new ApiError(400, "Please provide username, email or password!");
  }

  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    throw new ApiError(409, "User with this email already exists");
  }

  const existingUsername = await User.findOne({ username });
  if (existingUsername) {
    throw new ApiError(409, "Username is already taken");
  }

  const createUser = await User.create({
    username,
    email,
    password,
    otp,
    avatar,
  });

  const user = await User.findById(createUser._id).select("-password -otp");

  return res
    .status(201)
    .json(new ApiResponse(201, user, "User successfully registered"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if ((!username && !email) || !password) {
    throw new ApiError(400, "Please provide email or username and password");
  }

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
    "-password -otp -refreshToken"
  );

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
  const user = req.user._id;
  await User.findByIdAndUpdate(
    user,
    {
      $set: { refreshToken: null },
    },
    { new: true }
  );

  res.clearCookie("refreshToken")

  return res.status(200).json(200, {}, "User successfully logged out");
});

export { registerUser, loginUser, logoutUser };

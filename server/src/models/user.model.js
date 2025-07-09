import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    refreshToken: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.isPasswordMatch = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model("User", userSchema);


// ✅ Must-Have User Controllers for a Todo App
// Controller Name            	   Purpose
// registerUser	                  For user signup
// loginUser	                    For user login
// logoutUser	                    To clear refresh token and logout
// getCurrentUser	                To fetch currently logged-in user’s info
// changePassword	                To update password after login
// updateUserProfile	            (Optional) Update username, email, etc.
// refreshAccessToken	             Regenerate access token using refresh token


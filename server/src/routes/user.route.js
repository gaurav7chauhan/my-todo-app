import { Router } from "express";
import { verifyJwt } from "../middleware/auth.middleware.js";
import {
  changePassword,
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  resetPassword,
  updateUserProfile,
} from "../controllers/user.controller.js";

const router = Router();

router.use(verifyJwt);

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/logout").get(logoutUser);

router.route("/password-change").patch(changePassword);

router.route("/current-user").get(getCurrentUser);

router.route("/update-profile").post(updateUserProfile);

router.route("/tokens").get(refreshAccessToken);

router.route("/password-reset").patch(resetPassword);

export default userRoute;

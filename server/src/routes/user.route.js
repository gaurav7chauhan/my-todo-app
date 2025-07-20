import { Router } from "express";
import { verifyJwt } from "../middleware/auth.middleware.js";
import {
  changePassword,
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  forgetPassword,
  updateUserProfile,
} from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.js";

const router = Router();

// ✅ Public routes — NO authentication required
router.route("/register").post(upload.single("avatar"), registerUser);

router.route("/login").post(loginUser);

router.route("/tokens").patch(refreshAccessToken);

router.route("/password-reset").patch(forgetPassword);

// ✅ Protected routes — Authentication required
router.use(verifyJwt);

router.route("/logout").post(logoutUser);

router.route("/password-change").patch(changePassword);

router.route("/current-user").get(getCurrentUser);

router
  .route("/update-profile")
  .patch(upload.single("avatar"), updateUserProfile);

export default router;

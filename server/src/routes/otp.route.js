import { Router } from "express";
import { sendOtp } from "../controllers/otp.controller";

const router = Router();

router.route("/send", sendOtp);

export default otpRoute;

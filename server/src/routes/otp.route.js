import { Router } from "express";
import { sendOtp } from "../controllers/otp.controller.js";

const otpRoute = Router();

otpRoute.route("/send", sendOtp);

export default otpRoute;

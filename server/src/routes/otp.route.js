import { Router } from "express";
import { sendOtp } from "../controllers/otp.controller.js";

const otpRoute = Router();

otpRoute.post("/send", sendOtp);

export default otpRoute;

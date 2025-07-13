import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

//middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN, //✔️ frontend kis origin se request bhej sakta hai
    credentials: true, //✔️ isse cookies, auth headers, etc. allow hote hain frontend → backend requests me
  })
);

app.use(express.json());
//✔️ Ye middleware JSON body parse karta hai (like POST request me { name: "Gaurav" }).

app.use(express.urlencoded({ extended: true }));
//✔️ Ye middleware HTML form data ko handle karta hai (like name=value in form submissions).

app.use(cookieParser());
//✔️ Ye middleware request ke cookies ko parse karega. Uske baad tum req.cookies ka use kar sakte ho.

app.use(express.static("public"));
//✔️ Ye static file serve karta hai — jaise images, CSS, HTML jo public/ folder me rakhe ho.

// routing
import otpRoute from "./routes/otp.route.js";
import router from "./routes/user.route.js";
import todoRoute from "./routes/todo.route.js";

// route
app.use("api/v1/otp", otpRoute);
app.use("/api/v1/user", router);
app.use("/api/v1/todos", todoRoute);

export { app };

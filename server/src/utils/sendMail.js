import nodemailer from "nodemailer";

export const sendOtpEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS, // your Gmail App Password (not your real password)
      },
    });

    const mailOptions = {
      from: `"Todo-App" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      html: `<div style="font-family: sans-serif; padding: 10px;">
          <h2>Hello,</h2>
          <p>Your OTP Code is:</p>
          <h1 style="color: #333;">${otp}</h1>
          <p>This code is valid for 10 minutes. Do not share it with anyone.</p>
          <br />
          <small>If you did not request this, please ignore this email.</small>
        </div>`, // <<< Fixed here
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ OTP Email sent:", info.messageId);

    return info;
  } catch (error) {
    console.error("❌ Failed to send OTP email:", error);
    throw new Error("Could not send email. Please try again later.");
  }
};

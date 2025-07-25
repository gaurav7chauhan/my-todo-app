import otpGenerator from "otp-generator";

export const generateOtp = () => {
  return otpGenerator.generate(4, {
    digits: true,
    alphabets: false,
    upperCase: false,
    specialChars: false,
  });
};

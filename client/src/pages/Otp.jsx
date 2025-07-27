import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { otpRequest } from "../utils/otp";
import { notifications } from "../utils/toastConfig"; // Import your toast config

const Otp = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleResendOtp = async () => {
    setLoading(true);

    const { ok, result } = await otpRequest({
      email: state.email,
      password: state.password,
      type: state.type,
    });

    if (!ok) {
      setLoading(false);
      notifications.error(result.message || "Failed to resend OTP");
      setResendTimer(5);
      return;
    }

    notifications.otpResent();
    setResendTimer(30); // Reset to 30 seconds after successful resend
    setLoading(false);
  };

  // checking the state is not null
  useEffect(() => {
    if (!state) {
      navigate("/");
    } else if (state.type === "login" && (!state.email || !state.password)) {
      navigate("/login");
    } else if (
      state.type === "register" &&
      (!state.email || !state.password || !state.username)
    ) {
      navigate("/register");
    }
  }, [state, navigate]);

  if (!state) return null;

  const handleOtpChange = (e) => {
    // Only allow numbers
    const value = e.target.value.replace(/[^0-9]/g, "");
    setOtp(value);
  };

  const handleSubmit = async () => {
    setLoading(true);

    const payload = {
      email: state.email,
      password: state.password,
      type: state.type,
      otp: otp,
    };

    if (!otp || otp.length !== 4) {
      setLoading(false);
      notifications.error("Please enter a 4-digit OTP");
      return;
    }

    // sending api requests for register, login
    if (state.type === "register") {
      payload.username = state.username;

      try {
        const res = await fetch("http://localhost:8000/api/v1/user/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        });

        const result = await res.json();
        if (!res.ok) {
          throw new Error(result?.message || "Registration Failed");
        }

        notifications.userRegistered();
        setTimeout(() => {
          navigate("/home");
        }, 2000);
      } catch (error) {
        notifications.error(error.message || "Registration failed");
      } finally {
        setLoading(false);
      }
    } else if (state.type === "login") {
      try {
        const res = await fetch("http://localhost:8000/api/v1/user/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        });

        const result = await res.json();
        if (!res.ok) {
          throw new Error(result.message);
        }

        notifications.userLoggedIn(state.username || "User");
        setTimeout(() => {
          navigate("/home");
        }, 1500);
      } catch (error) {
        notifications.error(error.message || "Login failed");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">📱</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Enter OTP</h2>
          <p className="text-gray-600">
            You are{" "}
            <span className="font-semibold text-blue-600">
              {state.type === "register" ? "registering" : "logging in"}
            </span>{" "}
            with
            <br />
            <span className="font-medium text-gray-800">{state.email}</span>
          </p>
        </div>

        {/* OTP Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
            Enter 4-digit OTP
          </label>
          <input
            type="text"
            value={otp}
            onChange={handleOtpChange}
            maxLength={4}
            autoFocus
            placeholder="0000"
            className="w-full px-4 py-4 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 tracking-widest"
          />
          <p className="text-xs text-gray-500 text-center mt-2">
            Check your email for the verification code
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          {/* Verify Button */}
          <button
            disabled={loading || otp.length !== 4}
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <span>✓</span>
                <span>Verify OTP</span>
              </>
            )}
          </button>

          {/* Resend Button */}
          <button
            onClick={handleResendOtp}
            disabled={loading || resendTimer > 0}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center space-x-2"
          >
            {resendTimer > 0 ? (
              <>
                <span>🕐</span>
                <span>Resend OTP in {resendTimer}s</span>
              </>
            ) : loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-600 border-t-transparent"></div>
                <span>Sending...</span>
              </>
            ) : (
              <>
                <span>📧</span>
                <span>Resend OTP</span>
              </>
            )}
          </button>

          {/* Change Email Link */}
          <div className="text-center pt-4 border-t border-gray-200">
            <Link
              to={state.username ? "/register" : "/login"}
              className="text-gray-600 hover:text-blue-600 transition-colors duration-200 cursor-pointer hover:underline flex items-center justify-center space-x-1"
            >
              <span>←</span>
              <span>Change email</span>
            </Link>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mt-6 flex justify-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Otp;

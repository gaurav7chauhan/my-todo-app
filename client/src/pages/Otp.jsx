import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Otp = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [serverMessage, setServerMessage] = useState("");
  const [loading, setLoading] = useState(false);

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

  if (!state) return null; // showing null for certain time
  // because upper navigate is async takes time

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setServerMessage("");

    const payload = {
      email: state.email,
      password: state.password,
      otp: otp,
    };

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
          throw new Error(result?.message || "Register Failed");
        }

        setServerMessage(result?.message || "Registeration successfull");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } catch (error) {
        setServerMessage(error.message);
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

        setServerMessage(result.message);
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } catch (error) {
        setServerMessage(error.message);
      }
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Enter OTP</h2>
          <p className="text-gray-600 text-sm">
            You are{" "}
            <span className="font-medium">
              {state.type === "register" ? "registering" : "logging in"}
            </span>{" "}
            with
            <br />
            <span className="font-semibold text-blue-600">{state.email}</span>
          </p>
        </div>

        {/* OTP Input */}
        <div className="mb-6">
          <input
            type="text"
            value={otp}
            onChange={handleOtpChange}
            maxLength={4}
            autoFocus
            placeholder="Enter 4-digit OTP"
            className="w-full px-4 py-3 text-center text-2xl font-mono border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 tracking-widest"
          />
        </div>

        {/* Server Message */}
        {serverMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm text-center">{serverMessage}</p>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <button
            disabled={loading}
            onClick={handleSubmit}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
              loading
                ? "bg-blue-400 text-white cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            }`}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          <Link
            to={state.type === "register" ? "/register" : "/login"}
            className="block text-center text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
          >
            Change email
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Otp;

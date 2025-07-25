import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { sendOtpRequest } from "../utils/otp";
const Login = () => {
  const [serverMessage, setServerMessage] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setServerMessage("");

    const { ok, result } = await sendOtpRequest({
      email: data.email,
      password: data.password,
      type: "login",
    });

    if (!ok) {
      setServerMessage(result.message);
      setLoading(false);
      return;
    }

    setTimeout(() => {
      navigate("/otp", {
        state: { ...data, type: "login" },
      });
    }, 1500);
    setLoading(false);
  };

  return (
    <div>
      {/* Left Side - Branding */}
      <div>
        <div>
          <h1>Welcome Back!</h1>
          <p>We're excited to see you again</p>
          <div>🌟</div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div>
        <div>
          {/* Server Message */}
          {serverMessage && (
            <div>
              <p>{serverMessage}</p>
            </div>
          )}

          <div>
            <h2>Login</h2>
            <div></div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Username or Email */}
            <div>
              <label htmlFor="email">Username or Email</label>
              <input
                id="email"
                type="text"
                placeholder="Enter username or email"
                {...register("email", {
                  required: "Username or Email is required",
                })}
                autoComplete="username"
              />
              {errors.email && <p>{errors.email.message}</p>}
            </div>

            {/* Password with Show/Hide */}
            <div>
              <label htmlFor="password">Password</label>
              <div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      />
                    </svg>
                  ) : (
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && <p>{errors.password.message}</p>}
            </div>

            {/* Submit Button */}
            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "🚀 Login"}
            </button>
          </form>

          <div>
            <a href="/register">Don't have an account? Sign up</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

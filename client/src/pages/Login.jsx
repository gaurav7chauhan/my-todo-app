import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
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
    try {
      // const payload = { identifier: data.identifier, password: data.password };

      const res = await fetch("http://localhost:8000/api/v1/otp/send", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        // credentials: "include", // for sending cookies (refresh token)
        body: JSON.stringify({ email: data.identifier, type: "login" }),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result?.message);

      setTimeout(() => {
        navigate("/otp", { state: { ...data, type: "login" } });
      }, 1500);
    } catch (error) {
      setServerMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 items-center justify-center p-12">
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold mb-4">Welcome Back!</h1>
          <p className="text-xl opacity-90">We're excited to see you again</p>
          <div className="mt-8 text-6xl">🌟</div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="max-w-md w-full">
          {/* Server Message */}
          {serverMessage && (
            <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
              <p className="text-blue-800 font-medium">{serverMessage}</p>
            </div>
          )}

          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-2">Login</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded"></div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Username or Email */}
            <div className="space-y-2">
              <label
                htmlFor="identifier"
                className="text-sm font-semibold text-gray-700 block"
              >
                Username or Email
              </label>
              <input
                id="identifier"
                type="text"
                placeholder="Enter username or email"
                {...register("identifier", {
                  required: "Username or Email is required",
                })}
                autoComplete="username"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-0 transition-all ${
                  errors.identifier
                    ? "border-red-400 focus:border-red-500 bg-red-50"
                    : "border-gray-200 focus:border-blue-500"
                }`}
              />
              {errors.identifier && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.identifier.message}
                </p>
              )}
            </div>

            {/* Password with Show/Hide */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-semibold text-gray-700 block"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                  autoComplete="current-password"
                  className={`w-full px-4 py-3 pr-12 border-2 rounded-xl focus:outline-none focus:ring-0 transition-all ${
                    errors.password
                      ? "border-red-400 focus:border-red-500 bg-red-50"
                      : "border-gray-200 focus:border-blue-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
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
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${
                loading
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transform hover:-translate-y-1 hover:shadow-xl"
              }`}
            >
              {loading ? "Logging in..." : "🚀 Login"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a
              href="/register"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Don't have an account? Sign up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

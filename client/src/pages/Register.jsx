import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [serverMessage, setServerMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    setServerMessage("");

    try {
      serverMessage && <p>serverMessage</p>;
      const res = await fetch("http://localhost:8000/api/v1/otp/send", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        // credentials: "include",
        body: JSON.stringify({
          email: data.email,
          username: data.username,
          password: data.password,
          type: "register",
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        setServerMessage(result.message);
        console.log(result)
        setLoading(false);
        return;
      }

      navigate("/otp", { state: { ...data, type: "register" } });
    } catch (error) {
      setServerMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <span>Loading...</span>;

  return (
    <div className="flex justify-center items-center bg-amber-400 w-full h-screen">
      {/* Left Side - Branding */}
      {/* <div>
        <div>
          <div>🎉</div>
          <h1>Join Us Today!</h1>
          <p>Create your account and start your amazing journey with us</p>
          <div>
            <div>
              <span>✨</span>
              <span>Easy to get started</span>
            </div>
            <div>
              <span>🔒</span>
              <span>Secure and private</span>
            </div>
            <div>
              <span>🚀</span>
              <span>Powerful features</span>
            </div>
          </div>
        </div>
      </div> */}

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
            <h2>Create Account</h2>
            <div></div>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex gap-5 items-right flex-col"
          >
            {/* Username */}
            <div>
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                placeholder="Choose a username"
                autoComplete="username"
                {...register("username", { required: "Username is required" })}
              />
              {errors.username && (
                <p>
                  <span>⚠️</span>
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                autoComplete="email"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p>
                  <span>⚠️</span>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password with Show/Hide */}
            <div>
              <label htmlFor="password">Password</label>
              <div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  {...register("password", {
                    required: "Password is required",
                  })}
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
              {errors.password && (
                <p>
                  <span>⚠️</span>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button type="submit" disabled={loading}>
              {loading ? (
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Creating Account...</span>
                </div>
              ) : (
                "Create Account"
              )}
            </button>

            {/* Login Link */}
            <div>
              <p>
                Already have an account? <Link to="/login">Sign in here</Link>
              </p>
            </div>
          </form>

          {/* Terms */}
          <div>
            <p>
              By creating an account, you agree to our{" "}
              <a href="/terms">Terms</a> and{" "}
              <a href="/privacy">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

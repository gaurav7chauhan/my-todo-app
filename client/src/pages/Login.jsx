import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const [serverMessage, setServerMessage] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setServerMessage("");
    try {
      const payload = { identifier: data.identifier, password: data.password };

      const res = await fetch("http://localhost:8000/api/v1/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // for sending cookies (refresh token)
        body: JSON.stringify(payload),
      });

      console.log(res);
      const result = await res.json();

      if (!res.ok) throw new Error(result?.message || "Login failed");

      setServerMessage(result?.message || "Login Successfull!");

      setTimeout(() => {
        navigate("/");
      }, [1500]);
    } catch (error) {
      setServerMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {serverMessage && <p>{serverMessage}</p>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2>Login</h2>
        {/* username or email */}
        <div>
          <label htmlFor="identifier">Username or Email</label>
          <input
            id="identifier"
            type="text"
            placeholder="Enter username or email"
            {...register("identifier", {
              required: "Username or Email is required",
            })}
            autoComplete="username"
          />
          {errors.identifier && <span>{errors.identifier.message}</span>}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            {...register("password", { required: "Password is required" })}
            autoComplete="current-password"
          />
          {errors.password && <span>{errors.password.message}</span>}
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "🚀 Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;

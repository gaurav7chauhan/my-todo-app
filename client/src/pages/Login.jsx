import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // for sending cookies (refresh token)
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result?.message || "Login failed");
      }

      alert(result?.message || "Login Successfull!");
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2>Login</h2>
        {/* username */}
        <div>
          <label>Username</label>
          <input
            type="text"
            {...register("username", { required: "Username is required" })}
          />
          {errors.username && <p>{errors.username.message}</p>}
        </div>
        {/* Email */}
        <div>
          <label>Email</label>
          <input
            type="email"
            {...register("email", { required: "email is required" })}
          />
          {errors.email && <p>{errors.email.message}</p>}
        </div>
        {/* Password */}
        <div>
          <label>Password</label>
          <input
            type="password"
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>
        <Button type="submit">🚀 Login</Button>
      </form>
    </div>
  );
};

export default Login;

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
const Login = () => {
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // for sending cookies (refresh token)
        body: JSON.stringify(data),
      });

      console.log(res);
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result?.message || "Login failed");
      }

      alert(result?.message || "Login Successfull!");
      navigate("/otp");
    } catch (error) {
      setServerError(error.message);
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
          {serverError && <p>{serverError}</p>}
        </div>
        {/* Email */}
        <div>
          <label>Email</label>
          <input
            type="email"
            {...register("email", { required: "email is required" })}
          />
          {serverError && <p>{serverError}</p>}
        </div>
        {/* Password */}
        <div>
          <label>Password</label>
          <input
            type="password"
            {...register("password", { required: "Password is required" })}
          />
          {serverError && <p>{serverError}</p>}
        </div>
        <Button type="submit">🚀 Login</Button>
      </form>
    </div>
  );
};

export default Login;

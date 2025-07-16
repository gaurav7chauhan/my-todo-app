import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";

const Register = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [serverMessage, setServerMessage] = useState("");

  const onSubmit = async (data) => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result?.message || "Register Failed");
      }

      alert(result?.message || "Registeration successfull");
        navigate("/otp");
    } catch (error) {
      setServerMessage(error.message);
    }
  };

  return (
    <div>
      {serverMessage && <p>{serverMessage}</p>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2>Register</h2>
        {/* username */}
        <div>
          <label>Username</label>
          <input
            type="text"
            {...register("username", { required: "Username is required" })}
          />
        </div>
        {/* email */}
        <div>
          <label>Email</label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
          />
        </div>
        {/* password */}
        <div>
          <label>Password</label>
          <input
            type="password"
            {...register("password", { required: "Password is required" })}
          />
        </div>
        <Button type="submit">Register</Button>

        <p>
          <span>Already</span> have an account?{" "}
          <Link to="/login">Login here</Link>{" "}
        </p>
      </form>
    </div>
  );
};

export default Register;

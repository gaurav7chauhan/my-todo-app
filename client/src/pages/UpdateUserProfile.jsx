import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const UpdateUserProfile = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [submitting, setSubmitting] = useState(false);
  const [serverMessage, setServerMessage] = useState("");

  const updateProfile = async (data) => {
    setSubmitting(true);
    setServerMessage("");
    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/user/update-profile/`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data), // 👈 this sends name, bio etc.
        }
      );
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message);
      }
      setServerMessage(result?.message);
      setTimeout(() => navigate("/"), 2000); //Delay to show message
    } catch (error) {
      setServerMessage(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {serverMessage && <p>{serverMessage}</p>}
      <h2>UpdateUserProfile</h2>
      <form onSubmit={handleSubmit(updateProfile)}>
        <div>
          <label htmlFor="username">Username</label>
          <input id="username" type="text" {...register("setUsername")} />
          {errors.setUsername && <span>{errors.setUsername.message}</span>}
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input id="email" type="text" {...register("setEmail")} />
          {errors.setEmail && <span>{errors.setEmail.message}</span>}
        </div>
        <button type="submit" disabled={submitting}>
          {submitting ? "Updating" : "Update"}
        </button>
      </form>
    </div>
  );
};

export default UpdateUserProfile;

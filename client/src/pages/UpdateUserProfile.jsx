import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const UpdateUserProfile = () => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const [serverMessage, setServerMessage] = useState("");

  const updateProfile = async (data) => {
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
      alert(result?.message);
      navigate("/");
    } catch (error) {
      setServerMessage(error.message);
    }
  };
  return (
    <div>
      {serverMessage && <p>{serverMessage}</p>}
      <h2>UpdateUserProfile</h2>
      <form onSubmit={handleSubmit(updateProfile)}>
        <input
          type="text"
          placeholder="Username"
          {...register("setUsername")}
        />
        <input type="text" placeholder="Email" {...register("setEmail")} />
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default UpdateUserProfile;

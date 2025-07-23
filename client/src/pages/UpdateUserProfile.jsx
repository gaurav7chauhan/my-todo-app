import React, { useEffect } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const UpdateUserProfile = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [submitting, setSubmitting] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [serverMessage, setServerMessage] = useState("");

  // fetch todo
  const fetchUserProfile = async () => {
    setLoadingProfile(true);
    try {
      const res = await fetch(`http://localhost:8000/api/v1/user/current-user`, {
        method: "GET",
        credentials: "include", // if using auth
      });

      const result = await res.json();

      if (res.ok && result.data) {
        reset({
          username: result.data.username || "",
          email: result.data.email || "",
        });
      } else {
        setServerMessage(result.message || "Failed to load profile");
      }
    } catch (error) {
      setServerMessage(error.message);
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [reset]);

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
    } catch (error) {
      setServerMessage(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingProfile) return <p>Loading profile...</p>

  return (
    <div>
      {serverMessage && <p>{serverMessage}</p>}
      <h2>UpdateUserProfile</h2>
      <form onSubmit={handleSubmit(updateProfile)}>
        <div>
          <label htmlFor="username">Username</label>
          <input id="username" type="text" {...register("username")} />
          {errors.username && <span>{errors.username.message}</span>}
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" {...register("email")} />
          {errors.email && <span>{errors.email.message}</span>}
        </div>
        <button type="submit" disabled={submitting}>
          {submitting ? "Updating" : "Update"}
        </button>
        <button onClick={() => navigate("/home")}>Back</button>
      </form>
    </div>
  );
};

export default UpdateUserProfile;

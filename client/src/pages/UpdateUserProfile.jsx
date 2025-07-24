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
      const res = await fetch(
        `http://localhost:8000/api/v1/user/current-user`,
        {
          method: "GET",
          credentials: "include", // if using auth
        }
      );

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

  if (loadingProfile) return <p>Loading profile...</p>;

  return (
    <div>
      <div>
        <div>
          {/* Server Message */}
          {serverMessage && (
            <div>
              <p>{serverMessage}</p>
            </div>
          )}

          {/* Header */}
          <div>
            <div>
              <span>👤</span>
            </div>
            <h2>Update Profile</h2>
            <p>Modify your account information</p>
          </div>

          <form onSubmit={handleSubmit(updateProfile)}>
            {/* Username */}
            <div>
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                placeholder="Enter username"
                {...register("username")}
              />
              {errors.username && <p>{errors.username.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Enter email"
                {...register("email")}
              />
              {errors.email && <p>{errors.email.message}</p>}
            </div>

            {/* Buttons */}
            <div>
              <button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
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
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <span>💾</span>
                    <span>Update Profile</span>
                  </>
                )}
              </button>

              <button type="button" onClick={() => navigate("/home")}>
                <span>←</span>
                <span>Back to Home</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateUserProfile;

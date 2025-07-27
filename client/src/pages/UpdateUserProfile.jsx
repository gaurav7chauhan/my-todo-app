import React, { useEffect } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { notifications } from "../utils/toastConfig"; // Import your toast config

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

  // fetch user profile
  const fetchUserProfile = async () => {
    setLoadingProfile(true);
    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/user/current-user`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const result = await res.json();

      if (res.ok && result.data) {
        reset({
          username: result.data.user?.username || "",
          email: result.data.user?.email || "",
        });
      } else {
        notifications.error(result.message || "Failed to load profile");
        navigate("/user-profile"); // Redirect if can't load
      }
    } catch (error) {
      notifications.error(error.message || "Failed to load profile");
      navigate("/user-profile");
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [reset]);

  const updateProfile = async (data) => {
    setSubmitting(true);

    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/user/update-profile/`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data),
        }
      );
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to update profile");
      }

      notifications.profileUpdated();
      setTimeout(() => {
        navigate("/user-profile");
      }, 1500);
    } catch (error) {
      notifications.error(error.message || "Failed to update profile");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
            <span className="text-3xl">👤</span>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-indigo-600 bg-clip-text text-transparent mb-2">
            Update Profile
          </h2>
          <p className="text-gray-600 text-lg">
            Modify your account information
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit(updateProfile)} className="space-y-6">
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Username <span className="text-red-500">*</span>
              </label>
              <input
                id="username"
                type="text"
                placeholder="Enter username"
                {...register("username", {
                  required: "Username is required",
                  minLength: {
                    value: 3,
                    message: "Username must be at least 3 characters",
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9_]+$/,
                    message:
                      "Username can only contain letters, numbers, and underscores",
                  },
                })}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.username
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.email
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Additional Profile Fields (Optional) */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Additional Information (Optional)
              </h3>

              {/* Bio Field */}
              <div className="mb-4">
                <label
                  htmlFor="bio"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Bio
                </label>
                <textarea
                  id="bio"
                  rows="3"
                  placeholder="Tell us about yourself..."
                  {...register("bio")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 transition-all duration-200 resize-none"
                />
              </div>

              {/* Location Field */}
              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Location
                </label>
                <input
                  id="location"
                  type="text"
                  placeholder="Where are you located?"
                  {...register("location")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 transition-all duration-200"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer flex items-center justify-center space-x-2"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <span>💾</span>
                    <span>Update Profile</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate("/user-profile")}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center space-x-2"
              >
                <span>←</span>
                <span>Back to Profile</span>
              </button>
            </div>
          </form>
        </div>

        {/* Profile Tips */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6">
          <h3 className="text-lg font-medium text-blue-800 mb-3 flex items-center">
            <span className="mr-2">💡</span>
            Profile Tips
          </h3>
          <ul className="space-y-2 text-sm text-blue-700">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Choose a unique username that represents you</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Use a valid email address for account notifications</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Add a bio to help others know more about you</span>
            </li>
          </ul>
        </div>

        {/* Back Navigation */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/home")}
            className="text-gray-600 hover:text-gray-800 transition-colors duration-200 cursor-pointer hover:underline"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateUserProfile;

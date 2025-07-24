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
  <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Server Message */}
        {serverMessage && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm text-center font-medium">{serverMessage}</p>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">👤</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Update Profile</h2>
          <p className="text-gray-600 text-sm mt-1">Modify your account information</p>
        </div>

        <form onSubmit={handleSubmit(updateProfile)} className="space-y-4">
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter username"
              {...register("username")}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.username ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter email"
              {...register("email")}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-col space-y-3 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                submitting
                  ? 'bg-blue-400 text-white cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:-translate-y-0.5'
              }`}
            >
              {submitting ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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

            <button
              type="button"
              onClick={() => navigate("/home")}
              className="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center space-x-2"
            >
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

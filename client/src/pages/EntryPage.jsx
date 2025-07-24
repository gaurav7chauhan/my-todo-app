import React from "react";
import { useNavigate } from "react-router-dom";

const EntryPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome</h1>
          <p className="text-gray-600">Choose an option to continue</p>
        </div>

        {/* Main Action Buttons */}
        <div className="space-y-4 mb-6">
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white p-4 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg flex items-center justify-start space-x-4"
          >
            <span className="text-2xl">👤</span>
            <div className="text-left">
              <h3 className="font-semibold text-lg">Login</h3>
              <p className="text-sm opacity-90">Already have an account?</p>
            </div>
          </button>

          <button
            onClick={() => navigate("/register")}
            className="w-full bg-gradient-to-r from-green-500 to-teal-400 hover:from-green-600 hover:to-teal-500 text-white p-4 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg flex items-center justify-start space-x-4"
          >
            <span className="text-2xl">✨</span>
            <div className="text-left">
              <h3 className="font-semibold text-lg">Register</h3>
              <p className="text-sm opacity-90">Create a new account</p>
            </div>
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-6">
          <div className="border-t border-gray-300 w-full"></div>
          <span className="bg-white px-4 text-gray-500 text-sm">or</span>
        </div>

        {/* Text Links */}
        <div className="text-center space-y-2">
          <a
            href="/login"
            className="block text-gray-600 hover:text-blue-600 transition-colors duration-200"
          >
            Already have an account?{" "}
            <span className="font-semibold">Sign in</span>
          </a>
          <a
            href="/register"
            className="block text-gray-600 hover:text-green-600 transition-colors duration-200"
          >
            New here? <span className="font-semibold">Create account</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default EntryPage;

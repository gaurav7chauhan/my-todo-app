import React from "react";
import { useNavigate } from "react-router-dom";

const EntryPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center p-4 animate-gradient-x">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full max-w-md border border-white/20">
        {/* Header with enhanced styling */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Welcome
          </h1>
          <p className="text-gray-600 text-lg">Choose an option to continue</p>
        </div>

        {/* Enhanced buttons with better hover effects */}
        <div className="space-y-4 mb-6">
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white p-4 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/25 flex items-center justify-start space-x-4 group cursor-pointer"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
              👤
            </span>
            <div className="text-left">
              <h3 className="font-semibold text-lg">Login</h3>
              <p className="text-sm opacity-90">Already have an account?</p>
            </div>
          </button>

          <button
            onClick={() => navigate("/register")}
            className="w-full bg-gradient-to-r from-green-500 to-teal-400 hover:from-green-600 hover:to-teal-500 text-white p-4 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-green-500/25 flex items-center justify-start space-x-4 group cursor-pointer"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
              ✨
            </span>
            <div className="text-left">
              <h3 className="font-semibold text-lg">Register</h3>
              <p className="text-sm opacity-90">Create a new account</p>
            </div>
          </button>
        </div>

        {/* Enhanced divider */}
        <div className="relative flex items-center justify-center my-6">
          <div className="border-t border-gray-300 w-full"></div>
          <span className="bg-white px-4 text-gray-500 text-sm font-medium">
            or
          </span>
        </div>

        {/* Enhanced text links */}
        <div className="text-center space-y-3">
          <a
            href="/login"
            className="block text-gray-600 hover:text-blue-600 transition-colors duration-200 hover:underline"
          >
            Already have an account?{" "}
            <span className="font-semibold text-blue-600">Sign in</span>
          </a>
          <a
            href="/register"
            className="block text-gray-600 hover:text-green-600 transition-colors duration-200 hover:underline"
          >
            New here?{" "}
            <span className="font-semibold text-green-600">Create account</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default EntryPage;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { notifications } from "../utils/toastConfig.js";

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    setShowLogoutModal(false);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/v1/user/logout", {
        method: "POST",
        credentials: "include",
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result?.message || "Logout failed");
      }

      notifications.userLoggedOut();
      navigate("/");
    } catch (error) {
      notifications.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      {/* Your existing hero section and cards remain the same */}
      <div className="text-center mb-12 pt-16">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-800 to-indigo-600 bg-clip-text text-transparent mb-4">
          Todo Dashboard
        </h1>
        <p className="text-xl text-gray-600 max-w-md mx-auto">
          Stay organized and get things done
        </p>
      </div>

      {/* Dashboard Cards */}
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
        {/* Your existing cards */}
        <div
          className="bg-white rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer p-8 border border-gray-100 hover:border-blue-200 group"
          onClick={() => navigate("/todos")}
        >
          <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">
            📋
          </div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-200">
            My Todos
          </h3>
          <p className="text-gray-600 text-lg">View and manage your tasks</p>
        </div>

        <div
          className="bg-white rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer p-8 border border-gray-100 hover:border-green-200 group"
          onClick={() => navigate("/create-todo")}
        >
          <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">
            ✨
          </div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-3 group-hover:text-green-600 transition-colors duration-200">
            Create Todo
          </h3>
          <p className="text-gray-600 text-lg">Add a new task to your list</p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="max-w-4xl mx-auto mt-12 flex justify-center space-x-4">
        <button
          onClick={() => navigate("/user-profile")}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg transition-colors duration-200 cursor-pointer hover:shadow-md"
        >
          👤 Profile
        </button>
        <button
          onClick={handleLogoutClick}
          disabled={loading}
          className="bg-red-100 hover:bg-red-200 text-red-700 px-6 py-3 rounded-lg transition-colors duration-200 cursor-pointer hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent"></div>
              <span>Logging out...</span>
            </>
          ) : (
            <>
              <span>🚪</span>
              <span>Logout</span>
            </>
          )}
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl">
            <div className="text-center">
              <div className="text-4xl mb-4">🚪</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Confirm Logout
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to logout? You'll need to login again to
                access your todos.
              </p>

              <div className="flex space-x-3">
                <button
                  onClick={cancelLogout}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors duration-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors duration-200 cursor-pointer"
                >
                  Yes, Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;

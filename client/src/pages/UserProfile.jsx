import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { notifications } from "../utils/toastConfig"; // Import your toast config

const UserProfile = () => {
  const navigate = useNavigate();
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const currentUser = async () => {
    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/user/current-user`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to fetch user data");
      }

      setTodos(result.data.todos || []);
      setUser(result.data.user);
      // Don't show success notification for initial load
    } catch (error) {
      notifications.error(error.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    currentUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto text-center">
          <div className="text-6xl mb-4">😕</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Profile not found
          </h3>
          <p className="text-gray-600 mb-6">
            Unable to load your profile information.
          </p>
          <button
            onClick={() => navigate("/home")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors duration-200 cursor-pointer"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-indigo-600 bg-clip-text text-transparent">
            My Profile
          </h1>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-8">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-white">
            <div className="flex items-center space-x-6">
              {/* Avatar */}
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-2xl font-bold">
                {user.username ? user.username.charAt(0).toUpperCase() : "U"}
              </div>

              {/* User Info */}
              <div>
                <h2 className="text-2xl font-bold mb-1">
                  {user.username || "User"}
                </h2>
                <p className="text-blue-100 text-lg">{user.email}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-sm bg-white text-blue-800 bg-opacity-20 px-3 py-1 rounded-full">
                    📅 Joined{" "}
                    {new Date(
                      user.createdAt || Date.now()
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Stats */}
          <div className="p-8">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {todos.length}
                </div>
                <div className="text-gray-600">Total Todos</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {todos.filter((todo) => todo.isCompleted).length}
                </div>
                <div className="text-gray-600">Completed</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {todos.filter((todo) => !todo.isCompleted).length}
                </div>
                <div className="text-gray-600">Pending</div>
              </div>
            </div>

            {/* Recent Todos Section */}
            <div className="border-t pt-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <span className="mr-2">📝</span>
                Recent Todos
              </h3>

              {todos.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">📋</div>
                  <p className="text-gray-600 mb-4">No todos created yet</p>
                  <button
                    onClick={() => navigate("/create-todo")}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors duration-200 cursor-pointer"
                  >
                    Create Your First Todo
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {todos.slice(0, 5).map((todo) => (
                    <div
                      key={todo._id}
                      onClick={() =>
                        navigate("/todo", { state: { id: todo._id } })
                      }
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800 mb-1">
                            {todo.title}
                          </h4>
                          <p className="text-sm text-gray-600 line-clamp-1">
                            {todo.textInput}
                          </p>
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          {/* Priority Badge */}
                          {todo.priority && (
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                todo.priority === "High"
                                  ? "bg-red-100 text-red-700"
                                  : todo.priority === "Medium"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-green-100 text-green-700"
                              }`}
                            >
                              {todo.priority === "High"
                                ? "🔴"
                                : todo.priority === "Medium"
                                ? "🟡"
                                : "🟢"}{" "}
                              {todo.priority}
                            </span>
                          )}

                          {/* Status Badge */}
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              todo.isCompleted
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {todo.isCompleted ? "✅ Done" : "⏳ Pending"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {todos.length > 5 && (
                    <div className="text-center pt-4">
                      <button
                        onClick={() => navigate("/todos")}
                        className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer hover:underline"
                      >
                        View all {todos.length} todos →
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => navigate("/update-profile")}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 cursor-pointer flex items-center space-x-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            <span>Edit Profile</span>
          </button>

          <button
            onClick={() => navigate("/todos")}
            className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 cursor-pointer flex items-center space-x-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <span>View All Todos</span>
          </button>

          <button
            onClick={() => navigate("/create-todo")}
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 cursor-pointer flex items-center space-x-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>Create Todo</span>
          </button>
        </div>

        {/* Back Navigation */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/home")}
            className="text-gray-600 hover:text-gray-800 transition-colors duration-200 cursor-pointer hover:underline flex items-center justify-center space-x-2 mx-auto"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>Back to Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

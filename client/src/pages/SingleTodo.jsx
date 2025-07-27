import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import TodoTags from "../utils/TodoTags";
import { notifications } from "../utils/toastConfig"; // Import your toast config

const SingleTodo = () => {
  const { state } = useLocation();
  const [loading, setLoading] = useState(true);
  const [todo, setTodo] = useState(null);
  const [toggleLoading, setToggleLoading] = useState(false);
  const { todoId } = useParams();
  const navigate = useNavigate();
  const id = state?.id || todoId;

  // Fetch todo
  const fetchSingleTodo = async () => {
    if (!id) {
      notifications.error("Todo ID not found!");
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/v1/todos/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result?.message || "Failed to fetch todo");
      }

      setTodo(result.data);
      // Don't show success notification for initial load
    } catch (error) {
      notifications.error(error.message || "Failed to fetch todo");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSingleTodo();
  }, [id]);

  // Toggle status
  const handleToggle = async (todoId) => {
    setToggleLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/todos/${todoId}/toggle`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to toggle status");
      }

      setTodo(result.data);
      notifications.todoUpdated();
    } catch (error) {
      notifications.error(error.message || "Failed to update todo");
    } finally {
      setToggleLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading todo...</p>
        </div>
      </div>
    );
  }

  if (!todo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto text-center">
          <div className="text-6xl mb-4">😕</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Todo not found
          </h3>
          <p className="text-gray-600 mb-6">
            The todo you're looking for doesn't exist or has been deleted.
          </p>
          <button
            onClick={() => navigate("/todos")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors duration-200 cursor-pointer"
          >
            Back to Todos
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
            Todo Details
          </h1>
        </div>

        {/* Main Todo Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                {todo.title}
              </h2>

              {/* Status Toggle */}
              <button
                onClick={() => handleToggle(todo._id)}
                disabled={toggleLoading}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-all duration-200 cursor-pointer ${
                  todo.isCompleted
                    ? "bg-green-100 text-green-800 hover:bg-green-200"
                    : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {toggleLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent"></div>
                ) : (
                  <span className="text-lg">
                    {todo.isCompleted ? "✅" : "❌"}
                  </span>
                )}
                <span>{todo.isCompleted ? "Completed" : "Mark Complete"}</span>
              </button>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            {/* Description/Content */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                <span className="mr-2">📝</span>
                Description
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {todo.inputText || "No description provided"}
                </p>
              </div>
            </div>

            {/* Additional Description */}
            {todo.description && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                  <span className="mr-2">📄</span>
                  Additional Notes
                </h3>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-gray-800 leading-relaxed">
                    {todo.description}
                  </p>
                </div>
              </div>
            )}

            {/* Meta Information Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Priority */}
              {todo.priority && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-600 mb-2 flex items-center">
                    <span className="mr-2">🎯</span>
                    Priority
                  </h4>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      todo.priority === "High"
                        ? "bg-red-100 text-red-800"
                        : todo.priority === "Medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {todo.priority === "High"
                      ? "🔴"
                      : todo.priority === "Medium"
                      ? "🟡"
                      : "🟢"}{" "}
                    {todo.priority}
                  </span>
                </div>
              )}

              {/* Created Date */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-600 mb-2 flex items-center">
                  <span className="mr-2">📅</span>
                  Created
                </h4>
                <p className="text-gray-800">
                  {new Date(todo.createdAt || Date.now()).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </p>
              </div>
            </div>

            {/* Tags Section */}
            {todo.tags && todo.tags.length > 0 && (
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                  <span className="mr-2">🏷️</span>
                  Tags
                </h4>
                <TodoTags tags={todo.tags} />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="bg-gray-50 px-8 py-6 flex flex-wrap gap-4">
            <button
              onClick={() =>
                navigate(`/edit-todo`, { state: { id: todo._id } })
              }
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 cursor-pointer flex items-center justify-center space-x-2 min-w-[140px]"
            >
              <span>✏️</span>
              <span>Edit Todo</span>
            </button>

            <button
              onClick={() => navigate("/todos")}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 cursor-pointer flex items-center justify-center space-x-2 min-w-[140px]"
            >
              <span>📋</span>
              <span>All Todos</span>
            </button>
          </div>
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

export default SingleTodo;

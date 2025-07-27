import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { notifications } from "../utils/toastConfig"; // Import your toast config

const CreateTodo = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const todoSubmit = async (data) => {
    setLoading(true);

    // Process tags from comma-separated string to array
    data.tags = data.tags
      ? data.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0)
      : [];

    try {
      const res = await fetch("http://localhost:8000/api/v1/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result?.message || "Todo not created");
      }

      notifications.todoCreated();
      reset(); // Clear form
      setTimeout(() => {
        navigate("/todos");
      }, 1500);
    } catch (error) {
      notifications.error(error.message || "Failed to create todo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-indigo-600 bg-clip-text text-transparent mb-2">
            Create Todo
          </h2>
          <p className="text-gray-600 text-lg">Add a new task to your list</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit(todoSubmit)} className="space-y-6">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                placeholder="Enter todo title..."
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.title
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                {...register("title", {
                  required: "Title is required",
                  minLength: {
                    value: 3,
                    message: "Title must be at least 3 characters",
                  },
                })}
              />
              {errors.title && (
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
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Content */}
            <div>
              <label
                htmlFor="textInput"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Content <span className="text-red-500">*</span>
              </label>
              <textarea
                id="textInput"
                rows={4}
                placeholder="Write your todo content..."
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none ${
                  errors.textInput
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                {...register("textInput", {
                  required: "Content is required",
                  minLength: {
                    value: 10,
                    message: "Content must be at least 10 characters",
                  },
                })}
              />
              {errors.textInput && (
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
                  {errors.textInput.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description
              </label>
              <input
                id="description"
                type="text"
                placeholder="Optional description..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 transition-all duration-200"
                {...register("description")}
              />
            </div>

            {/* Priority and Status Row */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Priority */}
              <div>
                <label
                  htmlFor="priority"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Priority
                </label>
                <select
                  id="priority"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 transition-all duration-200 bg-white cursor-pointer"
                  {...register("priority")}
                >
                  <option value="">Select Priority</option>
                  <option value="Low">🟢 Low</option>
                  <option value="Medium">🟡 Medium</option>
                  <option value="High">🔴 High</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <div className="mt-3">
                  <label className="flex items-center cursor-pointer">
                    <input
                      id="isCompleted"
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                      {...register("isCompleted")}
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Mark as completed
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label
                htmlFor="tags"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Tags
              </label>
              <input
                id="tags"
                type="text"
                placeholder="Add tags (comma separated): work, urgent, personal..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 transition-all duration-200"
                {...register("tags")}
              />
              <p className="mt-1 text-xs text-gray-500">
                Separate multiple tags with commas
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <span>✨</span>
                    <span>Create Todo</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate("/home")}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center space-x-2"
              >
                <span>❌</span>
                <span>Cancel</span>
              </button>
            </div>
          </form>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 text-center space-y-4">
          <div className="text-sm text-gray-600">Or create a quick todo</div>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => {
                reset({
                  title: "Quick Task",
                  textInput: "Add details later...",
                  priority: "Medium",
                });
              }}
              className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg transition-colors duration-200 cursor-pointer text-sm"
            >
              📝 Quick Task
            </button>
            <button
              onClick={() => {
                reset({
                  title: "Urgent Task",
                  textInput: "High priority task",
                  priority: "High",
                });
              }}
              className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg transition-colors duration-200 cursor-pointer text-sm"
            >
              🚨 Urgent Task
            </button>
          </div>
        </div>

        {/* Back Navigation */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/todos")}
            className="text-gray-600 hover:text-gray-800 transition-colors duration-200 cursor-pointer hover:underline"
          >
            ← View All Todos
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTodo;

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const CreateTodo = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [serverMessage, setServerMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const navigate = useNavigate();

  const todoSubmit = async (data) => {
    setLoading(true);
    setServerMessage("");
    setMessageType("");

    data.tags = data.tags ? data.tags.split(",").map((tag) => tag.trim()) : [];

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

      setServerMessage(result?.message || "Todo created successfully");
      setMessageType("success");

      setTimeout(() => {
        navigate("/home");
      }, 1500);
    } catch (error) {
      setServerMessage(error.message);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
        {/* Server Message */}
        {serverMessage && (
          <div
            className={
              messageType === "success"
                ? "mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg"
                : "mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg"
            }
          >
            {serverMessage}console.log({messageType})
          </div>
        )}

        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Todo</h2>
          <p className="text-gray-600">Add a new task to your list</p>
        </div>

        <form onSubmit={handleSubmit(todoSubmit)} className="space-y-6">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Title*
            </label>
            <input
              id="title"
              type="text"
              placeholder="Enter todo title..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition duration-200"
              {...register("title", { required: "field required" })}
            />
            {errors.title && (
              <span className="text-red-500 text-sm mt-1 block">
                {errors.title.message}
              </span>
            )}
          </div>

          {/* Content */}
          <div>
            <label
              htmlFor="text"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Content*
            </label>
            <textarea
              id="text"
              rows={4}
              placeholder="Write your todo content..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition duration-200 resize-vertical"
              {...register("textInput", { required: "field required" })}
            />
            {errors.textInput && (
              <span className="text-red-500 text-sm mt-1 block">
                {errors.textInput.message}
              </span>
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition duration-200"
              {...register("description")}
            />
            {errors.description && (
              <span className="text-red-500 text-sm mt-1 block">
                {errors.description.message}
              </span>
            )}
          </div>

          {/* Priority and Completed Status Row */}
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition duration-200 bg-white"
                {...register("priority")}
              >
                <option value="">Select Priority</option>
                <option value="Low">🟢 Low</option>
                <option value="Medium">🟡 Medium</option>
                <option value="High">🔴 High</option>
              </select>
              {errors.priority && (
                <span className="text-red-500 text-sm mt-1 block">
                  {errors.priority.message}
                </span>
              )}
            </div>

            {/* Is Completed */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div className="flex items-center mt-3">
                <input
                  id="isCompleted"
                  type="checkbox"
                  className="w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                  {...register("isCompleted")}
                />
                <label
                  htmlFor="isCompleted"
                  className="ml-3 text-sm text-gray-700"
                >
                  Mark as completed
                </label>
              </div>
              {errors.isCompleted && (
                <span className="text-red-500 text-sm mt-1 block">
                  {errors.isCompleted.message}
                </span>
              )}
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition duration-200"
              {...register("tags")}
            />
            {errors.tags && (
              <span className="text-red-500 text-sm mt-1 block">
                {errors.tags.message}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                  Adding...
                </span>
              ) : (
                "Add Todo"
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate("/home")}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTodo;

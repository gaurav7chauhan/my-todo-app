import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

const EditTodo = () => {
  const { todoId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // true for initial fetch
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [serverMessage, setServerMessage] = useState("");

  // fetch todo
  const fetchTodo = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/v1/todos/${todoId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result?.message || "Failed to fetch existing todo");
      }
      // For debugging: console.log(result.message);
      reset(result.data); // Make sure data keys match form fields!
    } catch (error) {
      setServerMessage(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchTodo();
  }, [todoId, reset]);

  // update todo
  const updateTodo = async (data) => {
    setLoading(true);
    setServerMessage("");

    // Process tags as an array if needed by backend
    data.tags = data.tags ? data.tags.split(",").map((tag) => tag.trim()) : [];

    try {
      const res = await fetch(`http://localhost:8000/api/v1/todos/${todoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result?.message || "Failed to update todo");
      }
      setServerMessage(result.message || "Todo updated successfully");
      setTimeout(() => navigate("/home"), 2000);
    } catch (error) {
      setServerMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <span>Loading...</span>;

return (
  <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
        {/* Server Message */}
        {serverMessage && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm">{serverMessage}</p>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Update Todo</h2>
          <p className="text-gray-600">Edit your todo details below</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(updateTodo)} className="space-y-6">
          {/* Title Field */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              placeholder="Enter todo title"
              {...register("title", { required: "Title is required" })}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <span className="mr-1">⚠️</span>
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Text Field */}
          <div>
            <label htmlFor="textInput" className="block text-sm font-medium text-gray-700 mb-2">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              id="textInput"
              rows="4"
              placeholder="Write your todo content..."
              {...register("textInput", { required: "Please write something" })}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical ${
                errors.textInput ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors.textInput && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <span className="mr-1">⚠️</span>
                {errors.textInput.message}
              </p>
            )}
          </div>

          {/* Description Field */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <input
              id="description"
              type="text"
              placeholder="Optional description"
              {...register("description")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Priority and Completion Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Priority Field */}
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                Priority <span className="text-red-500">*</span>
              </label>
              <select
                id="priority"
                {...register("priority", { required: "Priority is required" })}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.priority ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              >
                <option value="">Select Priority</option>
                <option value="Low">🟢 Low</option>
                <option value="Medium">🟡 Medium</option>
                <option value="High">🔴 High</option>
              </select>
              {errors.priority && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {errors.priority.message}
                </p>
              )}
            </div>

            {/* Completed Checkbox */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div className="flex items-center space-x-3 pt-2">
                <input
                  type="checkbox"
                  id="isCompleted"
                  {...register("isCompleted")}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <label htmlFor="isCompleted" className="text-sm text-gray-700">
                  Mark as completed
                </label>
              </div>
            </div>
          </div>

          {/* Tags Field */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <input
              id="tags"
              type="text"
              placeholder="Add tags (comma separated, e.g., work, urgent, project)"
              {...register("tags")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            <p className="mt-1 text-xs text-gray-500">
              Separate multiple tags with commas
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 px-6 py-3 rounded-lg font-medium text-white transition-all duration-200 flex items-center justify-center space-x-2 ${
                loading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:-translate-y-0.5 hover:shadow-lg'
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <span>✏️</span>
                  <span>Update Todo</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate("/home")}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center space-x-2 transform hover:-translate-y-0.5"
            >
              <span>❌</span>
              <span>Cancel</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
);

};

export default EditTodo;

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { notifications } from "../utils/toastConfig"; // Import your toast config

const EditTodo = () => {
  const { state } = useLocation();
  const { todoId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const id = todoId || state?.id;

  // fetch todo
  const fetchTodo = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/v1/todos/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result?.message || "Failed to fetch existing todo");
      }

      // Process tags for form if they're an array
      const formData = { ...result.data };
      if (formData.tags && Array.isArray(formData.tags)) {
        formData.tags = formData.tags.join(", ");
      }

      reset(formData);
    } catch (error) {
      notifications.error(error.message || "Failed to load todo");
      navigate("/todos"); // Redirect if todo not found
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) {
      notifications.error("Todo ID not found");
      navigate("/todos");
      return;
    }
    fetchTodo();
  }, [id, reset]);

  // update todo
  const updateTodo = async (data) => {
    setUpdateLoading(true);

    try {
      // Process tags from comma-separated string to array
      const processedData = { ...data };
      if (processedData.tags) {
        processedData.tags = processedData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0);
      }

      const res = await fetch(`http://localhost:8000/api/v1/todos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(processedData),
      });
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result?.message || "Failed to update todo");
      }

      notifications.todoUpdated();
      setTimeout(
        () => navigate("/todo", { state: { id: result.data._id } }),
        1500
      );
    } catch (error) {
      notifications.error(error.message || "Failed to update todo");
    } finally {
      setUpdateLoading(false);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-indigo-600 bg-clip-text text-transparent mb-2">
            Update Todo
          </h2>
          <p className="text-gray-600 text-lg">Edit your todo details below</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit(updateTodo)} className="space-y-6">
            {/* Title Field */}
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
                placeholder="Enter todo title"
                {...register("title", { required: "Title is required" })}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.title
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Content/Text Field */}
            <div>
              <label
                htmlFor="textInput"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Content <span className="text-red-500">*</span>
              </label>
              <textarea
                id="textInput"
                rows="4"
                placeholder="Write your todo content..."
                {...register("textInput", {
                  required: "Please write something",
                })}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none ${
                  errors.textInput
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 hover:border-gray-400"
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
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description
              </label>
              <input
                id="description"
                type="text"
                placeholder="Optional description"
                {...register("description")}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 transition-all duration-200"
              />
            </div>

            {/* Priority and Status Row */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Priority Field */}
              <div>
                <label
                  htmlFor="priority"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Priority <span className="text-red-500">*</span>
                </label>
                <select
                  id="priority"
                  {...register("priority", {
                    required: "Priority is required",
                  })}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-pointer ${
                    errors.priority
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 hover:border-gray-400"
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

              {/* Status Checkbox */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <div className="mt-3">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="isCompleted"
                      {...register("isCompleted")}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Mark as completed
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Tags Field */}
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
                placeholder="Add tags (comma separated, e.g., work, urgent, project)"
                {...register("tags")}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 transition-all duration-200"
              />
              <p className="mt-1 text-xs text-gray-500">
                Separate multiple tags with commas
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="submit"
                disabled={updateLoading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer flex items-center justify-center space-x-2"
              >
                {updateLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
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
                onClick={() => navigate("/todos")}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center space-x-2"
              >
                <span>❌</span>
                <span>Cancel</span>
              </button>
            </div>
          </form>
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

export default EditTodo;

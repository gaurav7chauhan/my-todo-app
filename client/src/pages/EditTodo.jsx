import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const EditTodo = () => {
  const { state } = useLocation();
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
  }, [id, reset]);

  // update todo
  const updateTodo = async (data) => {
    setLoading(true);
    setServerMessage("");

    // Process tags as an array if needed by backend
    try {
      const res = await fetch(`http://localhost:8000/api/v1/todos/${id}`, {
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
    <div>
      <div>
        <div>
          {/* Server Message */}
          {serverMessage && (
            <div>
              <p>{serverMessage}</p>
            </div>
          )}

          {/* Header */}
          <div>
            <h2>Update Todo</h2>
            <p>Edit your todo details below</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(updateTodo)}>
            {/* Title Field */}
            <div>
              <label htmlFor="title">
                Title <span>*</span>
              </label>
              <input
                id="title"
                type="text"
                placeholder="Enter todo title"
                {...register("title", { required: "Title is required" })}
              />
              {errors.title && (
                <p>
                  <span>⚠️</span>
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Text Field */}
            <div>
              <label htmlFor="textInput">
                Content <span>*</span>
              </label>
              <textarea
                id="textInput"
                rows="4"
                placeholder="Write your todo content..."
                {...register("textInput", {
                  required: "Please write something",
                })}
              />
              {errors.textInput && (
                <p>
                  <span>⚠️</span>
                  {errors.textInput.message}
                </p>
              )}
            </div>

            {/* Description Field */}
            <div>
              <label htmlFor="description">Description</label>
              <input
                id="description"
                type="text"
                placeholder="Optional description"
                {...register("description")}
              />
            </div>

            {/* Priority and Completion Row */}
            <div>
              {/* Priority Field */}
              <div>
                <label htmlFor="priority">
                  Priority <span>*</span>
                </label>
                <select id="priority" {...register("priority")}>
                  <option value="">Select Priority</option>
                  <option value="Low">🟢 Low</option>
                  <option value="Medium">🟡 Medium</option>
                  <option value="High">🔴 High</option>
                </select>
                {errors.priority && (
                  <p>
                    <span>⚠️</span>
                    {errors.priority.message}
                  </p>
                )}
              </div>

              {/* Completed Checkbox */}
              <div>
                <label>Status</label>
                <div>
                  <input
                    type="checkbox"
                    id="isCompleted"
                    {...register("isCompleted")}
                  />
                  <label htmlFor="isCompleted">Mark as completed</label>
                </div>
              </div>
            </div>

            {/* Tags Field */}
            <div>
              <label htmlFor="tags">Tags</label>
              <input
                id="tags"
                type="text"
                placeholder="Add tags (comma separated, e.g., work, urgent, project)"
                {...register("tags")}
              />
              <p>Separate multiple tags with commas</p>
            </div>

            {/* Action Buttons */}
            <div>
              <button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
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

              <button type="button" onClick={() => navigate("/home")}>
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

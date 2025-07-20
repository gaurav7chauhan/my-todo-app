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

  useEffect(() => {
    const fetchTodo = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:8000/api/v1/todos/${todoId}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );
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
    fetchTodo();
  }, [todoId, reset]);

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
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      setServerMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <span>Loading...</span>;

  return (
    <div>
      {serverMessage && <p>{serverMessage}</p>}
      <h2>Update Todo</h2>
      <form onSubmit={handleSubmit(updateTodo)}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            placeholder="Title"
            {...register("title", { required: "Title is required" })}
          />
          {errors.title && (
            <span style={{ color: "red" }}>{errors.title.message}</span>
          )}
        </div>
        <div>
          <label htmlFor="textInput">Text</label>
          <textarea
            id="textInput"
            placeholder="Write todo..."
            {...register("textInput", { required: "Please write something" })}
          />
          {errors.textInput && (
            <span style={{ color: "red" }}>{errors.textInput.message}</span>
          )}
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <input
            id="description"
            type="text"
            placeholder="Description"
            {...register("description")}
          />
        </div>
        <div>
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            {...register("priority", { required: "Priority is required" })}
          >
            <option value="">Select Priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          {errors.priority && (
            <span style={{ color: "red" }}>{errors.priority.message}</span>
          )}
        </div>
        <div>
          <label htmlFor="isCompleted">Is Completed</label>
          <input
            type="checkbox"
            id="isCompleted"
            {...register("isCompleted")}
          />
        </div>
        <div>
          <label htmlFor="tags">Tags</label>
          <input
            id="tags"
            type="text"
            placeholder="Add Tags (comma separated)"
            {...register("tags")}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update"}
        </button>
        <button type="button" onClick={() => navigate("/")}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditTodo;

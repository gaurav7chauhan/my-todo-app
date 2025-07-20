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
  const navigate = useNavigate();

  const todoSubmit = async (data) => {
    setLoading(true);
    setServerMessage("");

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

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      setServerMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {serverMessage && <p>{serverMessage}</p>}
      <h2>Create Todo</h2>
      <form onSubmit={handleSubmit(todoSubmit)}>
        {/* title */}
        <div>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            placeholder="Title"
            {...register("title", { required: "Title is required" })}
          />
          {errors.title && <span>{errors.title.message}</span>}
        </div>

        {/* input text */}
        <div>
          <label htmlFor="text">Write Content</label>
          <input
            id="text"
            type="text"
            placeholder="Write todo..."
            {...register("textInput", { required: "Please write something" })}
          />
          {errors.textInput && <span>{errors.textInput.message}</span>}
        </div>

        {/* decription */}
        <div>
          <label htmlFor="description">Description</label>
          <input
            id="description"
            type="text"
            placeholder="Description"
            {...register("description")}
          />
          {errors.description && <span>{errors.description.message}</span>}
        </div>

        {/* prority */}
        <div>
          <label htmlFor="priority">Priority</label>
          <select id="priority" {...register("priority")}>
            <option value="">Select Priority</option>{" "}
            {/* 👈 empty value (default) */}
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          {errors.priority && <span>{errors.priority.message}</span>}
        </div>

        {/* isCompleted */}
        <div>
          <label htmlFor="isCompleted">Is Completed</label>
          <input
            id="isCompleted"
            type="checkbox"
            {...register("isCompleted")}
          />
          {errors.isCompleted && <span>{errors.isCompleted.message}</span>}
        </div>

        {/* tags */}
        <div>
          <label htmlFor="tags">Tags</label>
          <input
            id="tags"
            type="text"
            placeholder="Add Tags (comma separated)"
            {...register("tags")}
          />
          {errors.tags && <span>{errors.tags.message}</span>}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Todo"}
        </button>
        <button type="button" onClick={() => navigate("/")}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default CreateTodo;

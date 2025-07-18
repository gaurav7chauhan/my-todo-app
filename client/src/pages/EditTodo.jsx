import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

const EditTodo = () => {
  const { todoId } = useParams();
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();
  const [serverMessage, setServerMessage] = useState("");

  // ✅ useEffect to fetch the existing todo
  useEffect(() => {
    const fetchTodo = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/v1/todos/${todoId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        const result = await res.json();

        if (!res.ok) {
          throw new Error(result?.message || "Failed to fetch existing todo");
        }
      alert("editTodo:",result.message)

        reset(result.data); // Pre-fill form
      } catch (error) {
        setServerMessage(error.message);
      }
    };
    fetchTodo();
  }, [todoId, reset]);

  const updateTodo = async (data) => {
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

      alert(result.message || "Todo updated successfully");
      navigate("/");
    } catch (error) {
      setServerMessage(error.message);
    }
  };
  return (
    <div>
      {serverMessage && <p>{serverMessage}</p>}
      <h2>Update Todo</h2>
      <form onSubmit={handleSubmit(updateTodo)}>
        {/* title */}
        <input
          type="text"
          placeholder="Title"
          {...register("title", { required: "Title is required" })}
        />

        {/* input text */}
        <textarea
          type="text"
          placeholder="Write todo..."
          {...register("textInput", { required: "Please write something" })}
        />

        {/* decription */}
        <input
          type="text"
          placeholder="Description"
          {...register("description")}
        />

        {/* prority */}
        <select {...register("priority")}>
          <option value="">Select Priority</option>{" "}
          {/* 👈 empty value (default) */}
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        {/* isCompleted */}
        <label>Is Completed</label>
        <input type="checkbox" {...register("isCompleted")} />

        {/* tags */}
        <input
          type="text"
          placeholder="Add Tags (comma separated)"
          {...register("tags")}
        />

        <button type="submit">Update Todo</button>
      </form>
    </div>
  );
};

export default EditTodo;

import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

const CreateTodo = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const todoSubmit = async (data) => {
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

      alert(result?.message || "Todo created successfully");
      navigate("/");
    } catch (error) {
      throw new Error(error.message);
    }
  };
  return (
    <div>
      <h2>CreateTodo</h2>
      <form onSubmit={handleSubmit(todoSubmit)}>
        {/* title */}
        <input
          type="text"
          placeholder="Title"
          {...register("title", { required: "Title is required" })}
        />
        {errors.title && <p>{errors.title.message}</p>}

        {/* input text */}
        <textarea
          type="text"
          placeholder="Write todo..."
          {...register("textInput", { required: "Please write something" })}
        />
        {errors.textInput && <p>{errors.textInput.message}</p>}

        {/* decription */}
        <input
          type="text"
          placeholder="Description"
          {...register("description")}
        />

        {/* prority */}
        <select {...register("priority")}>
          <option>Select Priority</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
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

        <Button type="submit">Add Todo</Button>
      </form>
    </div>
  );
};

export default CreateTodo;

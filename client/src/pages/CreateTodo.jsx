import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

const CreateTodo = () => {
  const { register, handleSubmit } = useForm();
  const [serverMessage, setServerMessage] = useState("");
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
      alert("createtodo:",result.message)
    } catch (error) {
      setServerMessage(error.message);
    }
  };
  return (
    <div>
      {serverMessage && <p>{serverMessage}</p>}
      <h2>Create Todo</h2>
      <form onSubmit={handleSubmit(todoSubmit)}>
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

        <Button type="submit">Add Todo</Button>
      </form>
    </div>
  );
};

export default CreateTodo;

import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";

const SingleTodo = () => {
  const [serverMessage, setServerMessage] = useState("");
  const [todo, setTodo] = useState("");
  const { todoId } = useParams();

  useEffect(() => {
    const fetchSingleTodo = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/v1/todos/${todoId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include", // if using auth
          }
        );

        const result = await res.json();

        if (!res.ok) {
          throw new Error(result?.message || "Failed to fetch todo");
        }
        console.log("result data", result.data);
        alert("singletodo:", result.message);

        setTodo(result.data); // assuming result is the todo object
      } catch (error) {
        setServerMessage(error.message);
      }
    };
    fetchSingleTodo();
  }, [todoId]);

  const handleToggle = async (todoId, newStatus) => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/todos/${todoId}/toggle`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ isCompleted: newStatus }),
        }
      );
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message || "Failed to toggle status");
      }
      return result.data.isCompleted;
    } catch (error) {
      setServerMessage(error.message);
    }
  };

  if (serverMessage) return <p>{serverMessage}</p>;
  if (!todo) return <p>Loading...</p>;
  return (
    <div>
      <h2>{todo.title}</h2>
      <p>{todo.textInput}</p>
      <p>{todo.description}</p>
      <p>Priority: {todo.priority}</p>
      <p>Status: {todo.isCompleted ? "Completed" : "Not Completed"}</p>
      <input
        type="checkbox"
        checked={todo.isCompleted}
        onChange={async () => {
          const updateStatus = await handleToggle(todo._id, todo.isCompleted);
          if (typeof updateStatus === "boolean") {
            setTodo((prev) => ({ ...prev, isCompleted: updateStatus }));
          }
        }}
      />
      <p>Tags: {todo.tags?.join(", ")}</p>
    </div>
  );
};

export default SingleTodo;

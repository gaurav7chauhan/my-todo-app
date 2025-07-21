import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";

const SingleTodo = () => {
  const [serverMessage, setServerMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(true);
  const [todo, setTodo] = useState(null);
  const { todoId } = useParams();

  // clean timer
  useEffect(() => {
    if (serverMessage && messageType === "success") {
      const timer = setTimeout(() => {
        setServerMessage("");
        setMessageType("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [serverMessage, messageType]);

  //  fetch todo
  useEffect(() => {
    const fetchSingleTodo = async () => {
      setLoading(true);
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

        setTodo(result.data); // assuming result is the todo object
        setServerMessage(result.message);
        setMessageType("success");
      } catch (error) {
        setServerMessage(error.message);
        setMessageType("error");
      } finally {
        setLoading(false);
      }
    };
    fetchSingleTodo();
  }, [todoId]);

  // toggle status
  const handleToggle = async (todoId) => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/todos/${todoId}/toggle`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to toggle status");
      }

      setServerMessage(result.message);
      setMessageType("success");
      return result.data.isCompleted;
    } catch (error) {
      setServerMessage(error.message);
      setMessageType("error");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (serverMessage && messageType === "error") return <p>{serverMessage}</p>;
  if (!todo) return <p>Todo not found</p>;

  return (
    <div>
      {serverMessage && messageType === "success" && (
        <span>{serverMessage}</span>
      )}
      <h2>{todo.title}</h2>
      <p>{todo.textInput}</p>
      <p>{todo.description}</p>
      <p>Priority: {todo.priority}</p>
      <p>Status: {todo.isCompleted ? "Completed" : "Not Completed"}</p>
      <label>
        <input
          type="checkbox"
          checked={todo.isCompleted}
          onChange={async () => {
            const updateStatus = await handleToggle(todo._id);
            if (typeof updateStatus === "boolean") {
              setTodo((prev) => ({ ...prev, isCompleted: updateStatus }));
            }
          }}
        />
        Mark as completed
      </label>

      <p>Tags: {todo.tags?.join(", ")}</p>
    </div>
  );
};

export default SingleTodo;

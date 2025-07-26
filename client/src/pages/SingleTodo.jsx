import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const SingleTodo = () => {
  const { state } = useLocation();
  const [serverMessage, setServerMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(true);
  const [todo, setTodo] = useState(null);
  const { todoId } = useParams();
  const navigate = useNavigate();
  const id = state?.id || todoId;

  // Clean timer for messages
  useEffect(() => {
    if (serverMessage && messageType === "success") {
      const timer = setTimeout(() => {
        setServerMessage("");
        setMessageType("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [serverMessage, messageType]);

  // Fetch todo
  const fetchSingleTodo = async () => {
    if (!id) {
      setServerMessage("Todo ID not found!");
      setMessageType("error");
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/v1/todos/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result?.message || "Failed to fetch todo");
      }

      setTodo(result.data); // Single todo object
      setServerMessage(result.message);
      setMessageType("success");
    } catch (error) {
      setServerMessage(error.message);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSingleTodo();
  }, [id]);

  // Toggle status
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

      setTodo(result.data); // Update state with latest todo data
      setServerMessage(result.message);
      setMessageType("success");
    } catch (error) {
      setServerMessage(error.message);
      setMessageType("error");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (serverMessage && messageType === "error") return <p>{serverMessage}</p>;
  if (!todo) return <p>Todo not found</p>;

  // === FINAL RENDER ===
  return (
    <div>
      {/* Server Message */}
      {serverMessage && (
        <div>
          <p>{serverMessage}</p>
        </div>
      )}

      {/* Single Todo Section */}
      <div>
        <h3>Todo Details</h3>
        <div>
          <span
            style={{ cursor: "pointer" }}
            onClick={() => handleToggle(todo._id)}
          >
            {todo.isCompleted ? "✅" : "❌"}
          </span>
          <span>{todo.isCompleted ? "Completed" : "Not Completed"}</span>
        </div>
        <div>
          <label>Title</label>
          <span style={{ marginLeft: "10px" }}>{todo.title}</span>
        </div>
        {/* Example other fields */}
        <div>
          <label>Content</label>
          <span>{todo.inputText}</span>
        </div>
        {todo.description && (
          <div>
            <small>{todo.description}</small>
          </div>
        )}
      </div>

      {/* Back Button */}
      <div>
        <button onClick={() => navigate("/home")}>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default SingleTodo;

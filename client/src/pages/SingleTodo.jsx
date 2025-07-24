import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const SingleTodo = () => {
  const [serverMessage, setServerMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(true);
  const [todo, setTodo] = useState(null);
  const { todoId } = useParams();
  const navigate = useNavigate();

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

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/v1/todos/${todoId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // if using auth
      });

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

  useEffect(() => {
    fetchUserProfile();
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
    <div>
      <div>
        {/* Header */}
        <div>
          <h2>User Profile</h2>
        </div>

        <div>
          {/* Server Message */}
          {serverMessage && (
            <div>
              <p>{serverMessage}</p>
            </div>
          )}

          {/* User Info */}
          {user && (
            <div>
              <div>
                {/* Avatar */}
                <div>
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.username}
                    />
                  ) : (
                    <div>
                      <span>👤</span>
                    </div>
                  )}
                </div>

                {/* User Details */}
                <div>
                  <div>
                    <span>Username</span>
                    <p>{user.username}</p>
                  </div>
                  <div>
                    <span>Email</span>
                    <p>{user.email}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Todos Section */}
          <div>
            <div>
              <h3>My Todos</h3>
              <span>
                {todos.length} {todos.length === 1 ? 'todo' : 'todos'}
              </span>
            </div>

            {todos.length === 0 ? (
              <div>
                <div>📝</div>
                <p>No todos yet.</p>
                <p>Create your first todo to get started!</p>
              </div>
            ) : (
              <div>
                {todos.map((todo) => (
                  <div key={todo._id}>
                    <div>
                      <span>
                        {todo.isCompleted ? "✅" : "❌"}
                      </span>
                      <span>
                        {todo.title}
                      </span>
                    </div>
                    <span>
                      {todo.isCompleted ? 'Done' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Back Button */}
          <div>
            <button onClick={() => navigate("/home")}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);


};

export default SingleTodo;

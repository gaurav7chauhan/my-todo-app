import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const navigate = useNavigate();
  const [serverMessage, setServerMessage] = useState("");
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const currentUser = async () => {
    setLoading(true);
    setServerMessage("");

    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/user/current-user`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message);
      }

      setTodos(result.data.todos);
      setUser(result.data.user);
      setServerMessage(result.message);
    } catch (error) {
      setServerMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    currentUser();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (serverMessage && !user) return <div>Error: {serverMessage}</div>;

  return (
    <div>
      <div>
        <div>
          {/* Success Message */}
          {serverMessage && messageType === "success" && (
            <div>
              <div>
                <div>
                  <span>✅</span>
                </div>
                <div>
                  <p>{serverMessage}</p>
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          <div>
            {/* Header */}
            <div>
              <h2>{todo.title}</h2>
              <div>
                {/* Priority Badge */}
                <span>
                  {todo.priority === "High"
                    ? "🔴"
                    : todo.priority === "Medium"
                    ? "🟡"
                    : "🟢"}{" "}
                  {todo.priority}
                </span>

                {/* Status Badge */}
                <span>
                  {todo.isCompleted ? "✅ Completed" : "⏳ Not Completed"}
                </span>
              </div>
            </div>

            {/* Content */}
            <div>
              <div>
                <h3>Content</h3>
                <p>{todo.textInput}</p>
              </div>

              {todo.description && (
                <div>
                  <h3>Description</h3>
                  <p>{todo.description}</p>
                </div>
              )}
            </div>

            {/* Status Toggle */}
            <div>
              <label>
                <input
                  type="checkbox"
                  checked={todo.isCompleted}
                  onChange={async () => {
                    const updateStatus = await handleToggle(todo._id);
                    if (typeof updateStatus === "boolean") {
                      setTodo((prev) => ({
                        ...prev,
                        isCompleted: updateStatus,
                      }));
                    }
                  }}
                />
                <span>
                  Mark as {todo.isCompleted ? "incomplete" : "completed"}
                </span>
              </label>
            </div>

            {/* Tags */}
            {todo.tags && todo.tags.length > 0 && (
              <div>
                <h3>Tags</h3>
                <div>
                  {todo.tags.map((tag, index) => (
                    <span key={index}>#{tag.trim()}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
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

              <div>
                <button onClick={() => navigate(`/update-todo/${todo._id}`)}>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

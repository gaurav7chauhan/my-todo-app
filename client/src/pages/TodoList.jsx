import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

const TodoList = () => {
  const [serverMessage, setServerMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(true);
  const [totalTodos, setTotalTodos] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [todos, setTodos] = useState([]);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const limit = 6;

  const fetchTodos = async () => {
    setLoading(true);
    setServerMessage("");
    setMessageType("");
    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/todos?page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // if you're using cookies
        }
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to fetch todos");
      }

      setTotalPages(result.data.totalPages);
      setTotalTodos(result.data.totalTodos);
      setPage(result.data.page);
      setTodos(result.data.todos);

      setServerMessage(result.message);
      setMessageType("Please wait, loading...");
    } catch (error) {
      setServerMessage(error.message);
      setMessageType("something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [page]);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/todos/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to delete");
      }

      setServerMessage(result.message || "Deleted");
      setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== id));
    } catch (error) {
      setServerMessage(error.message);
    }
  };

  return (
    <div>
      <div>
        {loading ? (
          <div>
            <div>
              <div></div>
              <p>Loading your todos...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Server Message */}
            {serverMessage && (
              <div>
                {messageType}
                {console.log(serverMessage)}
              </div>
            )}

            {/* Header */}
            <div>
              <h2>My Todos</h2>
              <div>
                <span>Total Todos: {totalTodos}</span>
              </div>
            </div>

            {/* Empty State with Create Todo Button */}
            {todos.length === 0 && (
              <div>
                <div>📝</div>
                <h3>No todos found</h3>
                <p>
                  You haven't created any todos yet. Start organizing your tasks
                  by creating your first todo!
                </p>

                {/* Create Todo Button */}
                <button onClick={() => navigate("/create-todo")}>
                  <span>✨</span>
                  Create Your First Todo
                </button>

                {/* Alternative: Go Back to Dashboard */}
                <div>
                  <button onClick={() => navigate("/home")}>
                    ← Back to Dashboard
                  </button>
                </div>
              </div>
            )}

            {/* Todo Cards */}
            <div>
              {todos.map((todo) => (
                <div
                  key={todo._id}
                  onClick={() => navigate(`/todo/${todo._id}`)}
                >
                  <div>
                    <div>
                      <h3>{todo.title}</h3>
                      {todo.description && <p>{todo.description}</p>}

                      {/* Todo Meta Info */}
                      <div>
                        {todo.priority && (
                          <span>
                            {todo.priority === "High"
                              ? "🔴"
                              : todo.priority === "Medium"
                              ? "🟡"
                              : "🟢"}{" "}
                            {todo.priority}
                          </span>
                        )}
                        {todo.isCompleted && <span>✅ Completed</span>}
                        {todo.tags && todo.tags.length > 0 && (
                          <div>
                            {todo.tags.slice(0, 2).map((tag, index) => (
                              <span key={index}>#{tag.trim()}</span>
                            ))}
                            {todo.tags.length > 2 && (
                              <span>+{todo.tags.length - 2} more</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/edit/${todo._id}`);
                        }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(todo._id);
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div>
                <button
                  onClick={() =>
                    setPage((prevPage) => Math.max(prevPage - 1, 1))
                  }
                  disabled={page === 1}
                >
                  ← Previous
                </button>

                <div>
                  <span>Page</span>
                  <span>{page}</span>
                  <span>of {totalPages}</span>
                </div>

                <button
                  onClick={() =>
                    setPage((prevPage) => Math.min(prevPage + 1, totalPages))
                  }
                  disabled={page === totalPages}
                >
                  Next →
                </button>
              </div>
            )}

            {/* Floating Action Button (only show when there are todos) */}
            {todos.length > 0 && (
              <div>
                <button
                  onClick={() => navigate("/create-todo")}
                  title="Create New Todo"
                >
                  +
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TodoList;

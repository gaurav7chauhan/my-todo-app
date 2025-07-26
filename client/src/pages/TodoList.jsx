import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TodoTags from "../utils/TodoTags";

const TodoList = () => {
  const [serverMessage, setServerMessage] = useState("");
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
    } catch (error) {
      setServerMessage(error.message);
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
            {serverMessage && <div>{serverMessage}</div>}

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
                  onClick={() => navigate(`/todo`, { state: { id: todo._id } })}
                >
                  <div>
                    <div>
                      <label htmlFor="title">Title</label>
                      <h3 id="title">{todo.title}</h3>
                      <p>{todo.inputText}</p>

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
                        {<TodoTags tags={todo.tags} />}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/edit-todo`, { state: { id: todo._id } });
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

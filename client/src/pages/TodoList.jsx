import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {loading ? (
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Loading your todos...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Server Message */}
            {serverMessage && (
              <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                {serverMessage}
              </div>
            )}

            {/* Header */}
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                My Todos
              </h2>
              <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
                <span className="text-sm font-medium">
                  Total Todos: {totalTodos}
                </span>
              </div>
            </div>

            {/* Empty State with Create Todo Button */}
            {todos.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-2xl font-semibold text-gray-700 mb-3">
                  No todos found
                </h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                  You haven't created any todos yet. Start organizing your tasks
                  by creating your first todo!
                </p>

                {/* Create Todo Button */}
                <button
                  onClick={() => navigate("/create-todo")}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300 cursor-pointer"
                >
                  <span className="text-xl">✨</span>
                  Create Your First Todo
                </button>

                {/* Alternative: Go Back to Dashboard */}
                <div className="mt-4">
                  <button
                    onClick={() => navigate("/home")}
                    className="text-blue-600 hover:text-blue-800 underline text-sm transition-colors"
                  >
                    ← Back to Dashboard
                  </button>
                </div>
              </div>
            )}

            {/* Todo Cards */}
            <div className="grid gap-4 mb-8">
              {todos.map((todo) => (
                <div
                  key={todo._id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 cursor-pointer border border-gray-100"
                  onClick={() => navigate(`/todo/${todo._id}`)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-blue-600 transition-colors">
                        {todo.title}
                      </h3>
                      {todo.description && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {todo.description}
                        </p>
                      )}

                      {/* Todo Meta Info */}
                      <div className="flex items-center gap-3 text-xs">
                        {todo.priority && (
                          <span
                            className={`px-2 py-1 rounded-full font-medium ${
                              todo.priority === "High"
                                ? "bg-red-100 text-red-700"
                                : todo.priority === "Medium"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {todo.priority === "High"
                              ? "🔴"
                              : todo.priority === "Medium"
                              ? "🟡"
                              : "🟢"}{" "}
                            {todo.priority}
                          </span>
                        )}
                        {todo.isCompleted && (
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                            ✅ Completed
                          </span>
                        )}
                        {todo.tags && todo.tags.length > 0 && (
                          <div className="flex gap-1">
                            {todo.tags.slice(0, 2).map((tag, index) => (
                              <span
                                key={index}
                                className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                              >
                                #{tag.trim()}
                              </span>
                            ))}
                            {todo.tags.length > 2 && (
                              <span className="text-gray-400">
                                +{todo.tags.length - 2} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/edit/${todo._id}`);
                        }}
                        className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(todo._id);
                        }}
                        className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1"
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
              <div className="flex items-center justify-center gap-4 py-8">
                <button
                  onClick={() =>
                    setPage((prevPage) => Math.max(prevPage - 1, 1))
                  }
                  disabled={page === 1}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  ← Previous
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Page</span>
                  <span className="px-3 py-1 bg-blue-600 text-white rounded-lg font-semibold">
                    {page}
                  </span>
                  <span className="text-sm text-gray-600">of {totalPages}</span>
                </div>

                <button
                  onClick={() =>
                    setPage((prevPage) => Math.min(prevPage + 1, totalPages))
                  }
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  Next →
                </button>
              </div>
            )}

            {/* Floating Action Button (only show when there are todos) */}
            {todos.length > 0 && (
              <div className="fixed bottom-6 right-6">
                <button
                  onClick={() => navigate("/create-todo")}
                  className="w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center text-2xl focus:outline-none focus:ring-4 focus:ring-blue-300"
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

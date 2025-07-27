import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TodoTags from "../utils/TodoTags";
import { notifications } from "../utils/toastConfig"; // Import your toast config

const TodoList = () => {
  const [loading, setLoading] = useState(true);
  const [totalTodos, setTotalTodos] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [todos, setTodos] = useState([]);
  const [page, setPage] = useState(1);
  const [deleteLoading, setDeleteLoading] = useState(null); // Track which todo is being deleted
  const navigate = useNavigate();
  const limit = 6;

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/todos?page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
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

      // Only show success message if there are todos
      if (result.data.todos.length > 0) {
        notifications.todoList(`Loaded ${result.data.todos.length} todos`);
      }
    } catch (error) {
      notifications.error(error.message || "Failed to fetch todos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [page]);

  const handleDelete = async (id) => {
    // Add confirmation dialog
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this todo?"
    );
    if (!confirmDelete) return;

    setDeleteLoading(id);
    try {
      const res = await fetch(`http://localhost:8000/api/v1/todos/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to delete");
      }

      notifications.todoDeleted();
      setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== id));
      setTotalTodos((prev) => prev - 1);
    } catch (error) {
      notifications.error(error.message || "Failed to delete todo");
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {loading ? (
          // Loading State
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Loading your todos...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-indigo-600 bg-clip-text text-transparent mb-4">
                My Todos
              </h2>
              <div className="bg-white rounded-full px-6 py-2 inline-block shadow-md">
                <span className="text-gray-600 font-medium">
                  Total Todos:{" "}
                  <span className="text-blue-600 font-bold">{totalTodos}</span>
                </span>
              </div>
            </div>

            {/* Empty State */}
            {todos.length === 0 && (
              <div className="text-center py-16">
                <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md mx-auto">
                  <div className="text-6xl mb-6">📝</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    No todos found
                  </h3>
                  <p className="text-gray-600 mb-8 leading-relaxed">
                    You haven't created any todos yet. Start organizing your
                    tasks by creating your first todo!
                  </p>

                  {/* Create Todo Button */}
                  <button
                    onClick={() => navigate("/create-todo")}
                    className="bg-gradient-to-r from-green-500 to-teal-400 hover:from-green-600 hover:to-teal-500 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg cursor-pointer flex items-center space-x-2 mx-auto mb-4"
                  >
                    <span>✨</span>
                    <span>Create Your First Todo</span>
                  </button>

                  {/* Back to Dashboard */}
                  <button
                    onClick={() => navigate("/home")}
                    className="text-gray-600 hover:text-gray-800 transition-colors duration-200 cursor-pointer hover:underline"
                  >
                    ← Back to Dashboard
                  </button>
                </div>
              </div>
            )}

            {/* Todo Cards Grid */}
            {todos.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {todos.map((todo) => (
                  <div
                    key={todo._id}
                    onClick={() =>
                      navigate(`/todo`, { state: { id: todo._id } })
                    }
                    className="bg-white rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer border border-gray-100 overflow-hidden group"
                  >
                    <div className="p-6">
                      {/* Todo Content */}
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                          {todo.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                          {todo.inputText}
                        </p>
                      </div>

                      {/* Todo Meta Info */}
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        {todo.priority && (
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
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
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                            ✅ Completed
                          </span>
                        )}
                        <TodoTags tags={todo.tags} />
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-2 pt-4 border-t border-gray-100">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/edit-todo`, { state: { id: todo._id } });
                          }}
                          className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 px-4 rounded-lg transition-colors duration-200 cursor-pointer flex items-center justify-center space-x-1"
                        >
                          <span>✏️</span>
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(todo._id);
                          }}
                          disabled={deleteLoading === todo._id}
                          className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 py-2 px-4 rounded-lg transition-colors duration-200 cursor-pointer flex items-center justify-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deleteLoading === todo._id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent"></div>
                          ) : (
                            <>
                              <span>🗑️</span>
                              <span>Delete</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-4 mb-8">
                <button
                  onClick={() =>
                    setPage((prevPage) => Math.max(prevPage - 1, 1))
                  }
                  disabled={page === 1}
                  className="bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 px-6 rounded-lg shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center space-x-2"
                >
                  <span>←</span>
                  <span>Previous</span>
                </button>

                <div className="bg-white px-6 py-2 rounded-lg shadow-md">
                  <span className="text-gray-600">Page </span>
                  <span className="font-bold text-blue-600">{page}</span>
                  <span className="text-gray-600"> of {totalPages}</span>
                </div>

                <button
                  onClick={() =>
                    setPage((prevPage) => Math.min(prevPage + 1, totalPages))
                  }
                  disabled={page === totalPages}
                  className="bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 px-6 rounded-lg shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center space-x-2"
                >
                  <span>Next</span>
                  <span>→</span>
                </button>
              </div>
            )}

            {/* Floating Action Button */}
            {todos.length > 0 && (
              <div className="fixed bottom-8 right-8">
                <button
                  onClick={() => navigate("/create-todo")}
                  title="Create New Todo"
                  className="bg-gradient-to-r from-green-500 to-teal-400 hover:from-green-600 hover:to-teal-500 text-white w-14 h-14 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 cursor-pointer flex items-center justify-center text-2xl font-bold"
                >
                  +
                </button>
              </div>
            )}

            {/* Back to Home Button */}
            <div className="text-center">
              <button
                onClick={() => navigate("/home")}
                className="text-gray-600 hover:text-gray-800 transition-colors duration-200 cursor-pointer hover:underline"
              >
                ← Back to Dashboard
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TodoList;

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
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {serverMessage && <p>{serverMessage}</p>}
          <h2>Total Todos: {totalTodos}</h2>
          {todos.length === 0 && <p>No todos on this page.</p>}
          {todos.map((todo) => (
            <div key={todo._id} onClick={() => navigate(`/todo/${todo._id}`)}>
              <h3>{todo.title}</h3>
              <button
                onClick={() => {
                  e.stopPopagation();
                  navigate(`/edit/${todo._id}`);
                }}
              >
                Edit
              </button>
              <button
                onClick={() => {
                  e.stopPopagation();
                  handleDelete(todo._id);
                }}
              >
                Delete
              </button>
            </div>
          ))}
          <div>
            <button
              onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <span>
              page {page} of {totalPages}
            </span>
            <button
              onClick={() =>
                setPage((prevPage) => Math.min(prevPage + 1, totalPages))
              }
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TodoList;

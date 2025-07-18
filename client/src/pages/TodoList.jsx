import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [serverMessage, setServerMessage] = useState("");
  const [totalTodos, setTotalTodos] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const limit = 6;

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

      alert(result.message || "Deleted");
      setTodos.filter((todo) => todo._id !== id);
    } catch (error) {
      setServerMessage(error.message);
    }
  };

  useEffect(() => {
    const fetchTodos = async () => {
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
        navigate("/");
        alert(`todolist:${result.message}`);
      } catch (error) {
        setServerMessage(error.message);
      }
    };
    fetchTodos();
  }, [page]);

  return (
    <div>
      {serverMessage && <p>{serverMessage}</p>}
      <h2>Total Todos: {totalTodos}</h2>
      {todos.map((todo) => {
        <div key={todo._id} onClick={() => navigate(`/todo/${todo._id}`)}>
          <h3>{todo.title}</h3>
          <Button onClick={() => navigate(`/edit/${todo._id}`)}>Edit</Button>
          <Button onClick={() => handleDelete(todo._id)}>Delete</Button>
        </div>;
      })}
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
    </div>
  );
};

export default TodoList;

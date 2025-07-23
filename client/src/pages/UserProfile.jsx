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
      <h2>UserProfile</h2>
      {serverMessage && <div>{serverMessage}</div>}
      {user && (
        <div>
          {user.avatar && <img src={user.avatar} alt={user.username} />}
          <p>
            <strong>Username:</strong>
            {user.username}
          </p>
          <p>
            <strong>Email:</strong>
            {user.email}
          </p>
        </div>
      )}
      <h3>todo</h3>
      {todos.length === 0 ? (
        <div>No todos yet.</div>
      ) : (
        <ul>
          {todos.map((todo) => (
            <li key={todo._id}>
              {todo.title} {todo.isCompleted ? "✅" : "❌"}
            </li>
          ))}
        </ul>
      )}
      <button onClick={() => navigate("/home")}>Back</button>
    </div>
  );
};

export default UserProfile;

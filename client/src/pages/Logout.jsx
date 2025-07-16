import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

const Logout = () => {
  const [serverMessage, setServerMessage] = useState("");
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/user/logout", {
        method: "GET",
        credentials: "include",
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result?.message || "Logout failed");
      }

      alert(result?.message || "Logged out successfully");
      navigate("/login");
    } catch (error) {
      setServerMessage(error.message);
    }
  };
  return (
    <div>
      {serverMessage && <p>{serverMessage}</p>}
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
};

export default Logout;

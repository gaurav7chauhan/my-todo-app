import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

const Logout = () => {
  const [serverMessage, setServerMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLoading(true);
    setServerMessage("");

    try {
      const res = await fetch("http://localhost:8000/api/v1/user/logout", {
        method: "POST",
        credentials: "include",
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result?.message || "Logout failed");
      }

      setServerMessage(result?.message || "Logged out successfully");

      setTimeout(() => {
        navigate("/login");
      }, [2000]);
    } catch (error) {
      setServerMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <span>Loading...</span>;

  return (
    <div>
      {serverMessage && <p>{serverMessage}</p>}
      <button onClick={handleLogout} disabled={loading}>
        {loading ? "Logging out..." : "Logout"}
      </button>
    </div>
  );
};

export default Logout;

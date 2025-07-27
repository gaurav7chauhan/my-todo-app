import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    <div className="fixed top-4 right-4 z-50">
      {/* Server Message */}
      {serverMessage && (
        <div className="mb-3 max-w-sm">
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
            <p className="text-gray-800 text-sm font-medium">{serverMessage}</p>
          </div>
        </div>
      )}

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        disabled={loading}
        className={`px-4 py-2 rounded-full font-medium text-sm shadow-lg transition-all duration-200 flex items-center space-x-2 ${
          loading
            ? "bg-red-400 text-white cursor-not-allowed"
            : "bg-white text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        }`}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>Logging out...</span>
          </>
        ) : (
          <>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span>Logout</span>
          </>
        )}
      </button>
    </div>
  );
};

export default Logout;

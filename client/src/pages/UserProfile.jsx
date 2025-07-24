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
  <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-white">
          <h2 className="text-3xl font-bold text-center">User Profile</h2>
        </div>

        <div className="p-6">
          {/* Server Message */}
          {serverMessage && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm font-medium">{serverMessage}</p>
            </div>
          )}

          {/* User Info */}
          {user && (
            <div className="mb-8">
              <div className="flex items-center space-x-6 mb-6">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-20 h-20 rounded-full object-cover border-4 border-blue-200"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl text-blue-600">👤</span>
                    </div>
                  )}
                </div>

                {/* User Details */}
                <div>
                  <div className="mb-3">
                    <span className="text-sm font-medium text-gray-500">Username</span>
                    <p className="text-lg font-semibold text-gray-900">{user.username}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Email</span>
                    <p className="text-lg text-gray-900">{user.email}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Todos Section */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">My Todos</h3>
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                {todos.length} {todos.length === 1 ? 'todo' : 'todos'}
              </span>
            </div>

            {todos.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <p className="text-gray-500 text-lg">No todos yet.</p>
                <p className="text-gray-400 text-sm mt-2">Create your first todo to get started!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {todos.map((todo) => (
                  <div
                    key={todo._id}
                    className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                      todo.isCompleted 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">
                        {todo.isCompleted ? "✅" : "❌"}
                      </span>
                      <span className={`font-medium ${
                        todo.isCompleted 
                          ? 'text-green-800 line-through' 
                          : 'text-gray-900'
                      }`}>
                        {todo.title}
                      </span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      todo.isCompleted 
                        ? 'bg-green-200 text-green-800' 
                        : 'bg-yellow-200 text-yellow-800'
                    }`}>
                      {todo.isCompleted ? 'Done' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Back Button */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => navigate("/home")}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

};

export default UserProfile;

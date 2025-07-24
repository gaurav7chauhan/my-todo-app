import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const SingleTodo = () => {
  const [serverMessage, setServerMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(true);
  const [todo, setTodo] = useState(null);
  const { todoId } = useParams();
  const navigate = useNavigate();

  // clean timer
  useEffect(() => {
    if (serverMessage && messageType === "success") {
      const timer = setTimeout(() => {
        setServerMessage("");
        setMessageType("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [serverMessage, messageType]);

  //  fetch todo

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/v1/todos/${todoId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // if using auth
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result?.message || "Failed to fetch todo");
      }

      setTodo(result.data); // assuming result is the todo object
      setServerMessage(result.message);
      setMessageType("success");
    } catch (error) {
      setServerMessage(error.message);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [todoId]);

  // toggle status
  const handleToggle = async (todoId) => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/todos/${todoId}/toggle`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to toggle status");
      }

      setServerMessage(result.message);
      setMessageType("success");
      return result.data.isCompleted;
    } catch (error) {
      setServerMessage(error.message);
      setMessageType("error");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (serverMessage && messageType === "error") return <p>{serverMessage}</p>;
  if (!todo) return <p>Todo not found</p>;

 return (
  <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Success Message */}
        {serverMessage && messageType === "success" && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-green-400 text-lg">✅</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-800 font-medium">{serverMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{todo.title}</h2>
            <div className="flex items-center space-x-4">
              {/* Priority Badge */}
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                todo.priority === 'High' 
                  ? 'bg-red-100 text-red-800' 
                  : todo.priority === 'Medium' 
                  ? 'bg-yellow-100 text-yellow-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {todo.priority === 'High' ? '🔴' : todo.priority === 'Medium' ? '🟡' : '🟢'} {todo.priority}
              </span>
              
              {/* Status Badge */}
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                todo.isCompleted 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {todo.isCompleted ? '✅ Completed' : '⏳ Not Completed'}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="mb-6">
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Content</h3>
              <p className="text-gray-900 whitespace-pre-wrap">{todo.textInput}</p>
            </div>
            
            {todo.description && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
                <p className="text-gray-900">{todo.description}</p>
              </div>
            )}
          </div>

          {/* Status Toggle */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={todo.isCompleted}
                onChange={async () => {
                  const updateStatus = await handleToggle(todo._id);
                  if (typeof updateStatus === "boolean") {
                    setTodo((prev) => ({ ...prev, isCompleted: updateStatus }));
                  }
                }}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <span className="ml-3 text-sm font-medium text-gray-700">
                Mark as {todo.isCompleted ? 'incomplete' : 'completed'}
              </span>
            </label>
          </div>

          {/* Tags */}
          {todo.tags && todo.tags.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {todo.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    #{tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <button
              onClick={() => navigate("/home")}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </button>
            
            <div className="flex space-x-2">
              <button
                onClick={() => navigate(`/update-todo/${todo._id}`)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

};

export default SingleTodo;

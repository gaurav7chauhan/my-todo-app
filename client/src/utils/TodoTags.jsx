import React, { useState } from "react";

const TodoTags = ({ tags }) => {
  const [showAll, setShowAll] = useState(false);

  if (!tags || tags.length === 0) return null;

  const displayTags = showAll ? tags : tags.slice(0, 2);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {displayTags.map((tag, index) => (
        // ✅ Fixed: Added return statement and proper JSX
        <span
          key={index}
          className="inline-block bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium border border-blue-200 hover:from-blue-200 hover:to-purple-200 transition-all duration-200 shadow-sm"
        >
          #{tag.trim()}
        </span>
      ))}

      {!showAll && tags.length > 2 && (
        <button
          onClick={() => setShowAll(true)}
          className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer border border-gray-200 hover:border-gray-300"
        >
          +{tags.length - 2} more
        </button>
      )}

      {showAll && tags.length > 2 && (
        <button
          onClick={() => setShowAll(false)}
          className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer border border-gray-200 hover:border-gray-300 flex items-center space-x-1"
        >
          <span>show less</span>
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default TodoTags;

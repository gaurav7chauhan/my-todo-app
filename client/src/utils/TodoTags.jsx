import React, { useState } from "react";

const TodoTags = ({ tags }) => {
  const [showAll, setShowAll] = useState(false);
  if (!tags || tags.length === 0) return null;
  const displayTags = showAll ? tags : tags.slice(0, 2);
  return (
    <div>
      {displayTags.map((tag, index) => {
        <span key={index}>#{tag.trim()}</span>;
      })}
      {!showAll && tags.length > 2 && (
        <span onClick={() => setShowAll(true)}>+{tags.length - 2} more</span>
      )}
      {showAll && tags.length > 2 && (
        <span onClick={() => setShowAll(false)}>show less</span>
      )}
    </div>
  );
};

export default TodoTags;

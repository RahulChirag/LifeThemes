import React from "react";

const Tag = ({ tag, onRemove }) => (
  <div className="flex items-center bg-gray-200 rounded-full px-3 py-1 mr-2 mb-2">
    <span className="mr-1">{tag.name}</span>
    <button onClick={() => onRemove(tag)} className="focus:outline-none">
      &times;
    </button>
  </div>
);

export default Tag;

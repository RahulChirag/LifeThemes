import React from "react";

const TagButton = ({ tag, onClick }) => (
  <button
    className="bg-blue-500 text-white rounded-full px-3 py-1 hover:bg-blue-600 focus:outline-none"
    onClick={() => onClick(tag)}
  >
    {tag.name}
  </button>
);

export default TagButton;

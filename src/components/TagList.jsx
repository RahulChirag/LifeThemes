import React from "react";
import Tag from "./Tag";

const TagList = ({ tags, onRemove }) => (
  <div className="flex flex-wrap mt-2">
    {tags.map((tag, index) => (
      <Tag key={index} tag={tag} onRemove={onRemove} />
    ))}
  </div>
);

export default TagList;

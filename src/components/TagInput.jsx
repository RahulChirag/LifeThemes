import React, { forwardRef } from "react";

const TagInput = forwardRef(({ value, onChange }, ref) => (
  <input
    ref={ref}
    type="text"
    value={value}
    onChange={onChange}
    placeholder="Search..."
    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
  />
));

export default TagInput;

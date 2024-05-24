import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import TagButton from "./TagButton";
import TagInput from "./TagInput";
import jsonData from "../data/data.json";

const subjectTagsData = [
  { id: 1, name: "Math" },
  { id: 2, name: "Science" },
  { id: 3, name: "English" },
  { id: 4, name: "History" },
  { id: 5, name: "Art" },
];

const TopicSearch = () => {
  const inputRef = useRef(null);
  const [data, setData] = useState(jsonData);
  const [inputValue, setInputValue] = useState("");
  const [selectedTag, setSelectedTag] = useState(null);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Focus on the search input when a tag is added
    if (selectedTag && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [selectedTag]);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);
    if (value === "") {
      setFilteredOptions([]);
      setIsOpen(false);
      return;
    }

    const filtered = data.filter(
      (item) =>
        (!selectedTag || item.subject === selectedTag.name) &&
        item.title.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredOptions(filtered);
    setIsOpen(true);
  };

  const handleAddTag = (tag) => {
    setSelectedTag(tag);
    setFilteredOptions([]);
    setIsOpen(false);
  };

  const handleRemoveTag = () => {
    setSelectedTag(null);
    setInputValue("");
    setFilteredOptions([]);
    setIsOpen(false);
  };

  const handleOnOptionSelect = (option) => {
    const serializedData = encodeURIComponent(JSON.stringify(option.id));
    const url = `/teacher/${serializedData}`;
    console.log("Navigation URL:", url);
    navigate(url);
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full sm:w-2/3 md:w-1/2 lg:w-1/3 bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-grow">
            <TagInput
              ref={searchInputRef}
              value={inputValue}
              onChange={handleInputChange}
            />
          </div>
          {selectedTag && (
            <div className="flex items-center bg-gray-200 rounded-full px-3 py-1">
              <span className="mr-1">{selectedTag.name}</span>
              <button onClick={handleRemoveTag} className="focus:outline-none">
                &times;
              </button>
            </div>
          )}
        </div>
        <div className="relative">
          {isOpen && (
            <div className="absolute w-full bg-white rounded-md shadow-md overflow-hidden z-10">
              {filteredOptions.map((option) => (
                <div
                  key={option.id}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-200 transition-colors"
                  onClick={() => handleOnOptionSelect(option)}
                >
                  {option.title}
                </div>
              ))}
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {subjectTagsData.map((tag) => (
              <TagButton
                key={tag.id}
                tag={tag}
                onClick={() => handleAddTag(tag)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicSearch;

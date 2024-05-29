import React from "react";

const Question = ({ index, data }) => {
  return (
    <div className="p-5 text-center">
      <h1>{data.questions[index].question}</h1>
      <div className="progress-container">
        <div className="progress-bar" style={{ width: "100%" }}></div>
      </div>
    </div>
  );
};

export default Question;

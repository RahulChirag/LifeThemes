import React, { useState } from "react";

export const GameType = ({
  data,
  index,
  gameTypeCountDown,
  score,
  setScore,
}) => {
  const [isMultipleSelectQuestion, setIsMultipleSelectQuestion] =
    useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const question = data.questions[index];
  const correctAnswers = question.answer;

  const handleClick = (option) => {
    if (correctAnswers.length === 1) {
      checkAnswer(option);
      setSelectedOption(option);
    } else {
      setIsMultipleSelectQuestion(false);
    }
  };

  const checkAnswer = (option) => {
    if (correctAnswers.length === 1) {
      const isCorrect = data.questions[index].answer.includes(option);
      if (isCorrect) {
        console.log("Correct answer selected:", option);
        setScore(score + 1); // Update the score
      } else {
        console.log("Wrong answer selected:", option);
      }
    }
  };

  const isOptionCorrect = (option) => {
    return selectedOption === option && correctAnswers.includes(option);
  };

  return (
    <div className="p-5 flex flex-col justify-center items-center h-screen">
      <div className="text-center mb-5">
        <div className="text-lg md:text-xl lg:text-2xl font-bold">
          Score: {score}
        </div>
        <div className="text-lg md:text-xl lg:text-2xl font-bold">
          Time remaining: {gameTypeCountDown}s
        </div>
      </div>
      <div className="flex flex-col md:flex-col lg:flex-row justify-center items-center md:items-start mb-5">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold text-center md:text-left mb-5 md:mb-0 md:mr-5">
          {question.question}
        </h1>
        {question.questionImage && (
          <div className="flex h-32 md:h-auto lg:h-48 justify-center md:justify-start">
            <img
              src={question.questionImage}
              alt="Question"
              className="max-w-full h-auto md:max-h-32 lg:max-h-full rounded-lg shadow-md"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {question.options.map((option, i) => (
          <div
            key={i}
            className={`flex items-center p-4 border rounded-lg shadow-sm hover:shadow-lg transition-shadow ${
              isOptionCorrect(option) ? "bg-green-200" : ""
            }`}
            onClick={() => handleClick(option)}
          >
            {question.optionImages[i] && (
              <img
                src={question.optionImages[i]}
                alt={`Option ${i}`}
                className="w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32 rounded-lg shadow-md mr-4"
              />
            )}
            <div className="text-center text-base md:text-lg lg:text-xl">
              {option}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameType;

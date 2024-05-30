import React, { useState, useEffect } from "react";
import { useUserAuth } from "../context/UserAuthContext";

export const GameType = ({
  data,
  index,
  gameTypeCountDown,
  setGameTypeCountDown,
  score,
  setScore,
  onTimeUp,
  username,
  otp,
}) => {
  const { updateScore } = useUserAuth();
  const [canSelect, setCanSelect] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [correctOptions, setCorrectOptions] = useState([]);
  const [incorrectOptions, setIncorrectOptions] = useState([]);
  const [showCorrectness, setShowCorrectness] = useState(false);
  const [continueTimer, setContinueTimer] = useState(true);
  const [lastRemainingTime, setLastRemainingTime] = useState(null);

  const question = data.questions[index];
  const correctAnswers = question.answer;

  const handleClick = (option) => {
    if (canSelect) {
      const newSelectedOptions = [...selectedOptions, option];
      setSelectedOptions(newSelectedOptions);
      if (newSelectedOptions.length === correctAnswers.length) {
        setContinueTimer(false);
        setLastRemainingTime(gameTypeCountDown);
        checkAnswers(newSelectedOptions);
        setCanSelect(false);
        setShowCorrectness(true);

        setTimeout(() => {
          onTimeUp();
        }, 3000);
      }
    }
  };

  useEffect(() => {
    if (gameTypeCountDown === 0) {
      handleScore(score);
    }
  }, [gameTypeCountDown]);

  useEffect(() => {
    if (continueTimer && gameTypeCountDown > 0) {
      const timerId = setTimeout(() => {
        setGameTypeCountDown((prevCount) => prevCount - 1);
      }, 1000);

      return () => clearTimeout(timerId);
    }
  }, [gameTypeCountDown, continueTimer]);

  const handleScore = (updatedScore) => {
    console.log("Current Score:", updatedScore, otp, username);
    updateScore(otp, username, updatedScore);
  };

  const checkAnswers = (options) => {
    const newCorrectOptions = [];
    const newIncorrectOptions = [];
    options.forEach((option) => {
      if (correctAnswers.includes(option)) {
        newCorrectOptions.push(option);
      } else {
        newIncorrectOptions.push(option);
      }
    });
    const newScore = score + newCorrectOptions.length * 5;
    setScore(newScore);
    handleScore(newScore);
    setCorrectOptions(newCorrectOptions);
    setIncorrectOptions(newIncorrectOptions);
  };

  const getOptionClass = (option) => {
    if (showCorrectness) {
      if (correctOptions.includes(option)) {
        return "bg-green-200";
      } else if (incorrectOptions.includes(option)) {
        return "bg-red-200";
      }
    } else if (selectedOptions.includes(option)) {
      return "bg-blue-200";
    }
    return "";
  };

  return (
    <div className="p-5 flex flex-col justify-center items-center h-screen">
      <div className="text-center mb-5">
        <div className="text-lg md:text-xl lg:text-2xl font-bold">
          Score: {score}
        </div>
        <div className="text-lg md:text-xl lg:text-2xl font-bold">
          {continueTimer && gameTypeCountDown > 0
            ? `Time remaining: ${gameTypeCountDown}s`
            : lastRemainingTime && `Time remaining: ${lastRemainingTime}s`}
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
            className={`flex items-center p-4 border rounded-lg shadow-sm hover:shadow-lg transition-shadow ${getOptionClass(
              option
            )}`}
            onClick={() => handleClick(option)}
          >
            {question.optionImages && question.optionImages[i] && (
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

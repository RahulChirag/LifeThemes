import React, { useEffect, useState } from "react";
import { useUserAuth } from "../context/UserAuthContext";

const PlayGame = ({ otp, startGame }) => {
  const { getGame } = useUserAuth();

  const [gameData, setGameData] = useState(null);
  const [gameName, setGameName] = useState(null);
  const [gameType, setGameType] = useState(null);
  const [data, setData] = useState(null);
  const [countdown, setCountdown] = useState(5);
  const [showCountdown, setShowCountdown] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionTimer, setQuestionTimer] = useState(30);

  useEffect(() => {
    const fetchData = async () => {
      try {
        getGame(otp, (gameDataResponse) => {
          setGameData(gameDataResponse);
          fetchGameData(gameDataResponse.gameName);
        });
      } catch (error) {
        console.error("Error fetching game data:", error);
      }
    };

    const fetchGameData = async (gameName) => {
      try {
        const response = await fetch(`/games/${gameName}.json`);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch game data: ${response.status} ${response.statusText}`
          );
        }

        const responseBody = await response.text();

        if (!responseBody) {
          throw new Error("Empty response body");
        }

        const jsonData = JSON.parse(responseBody);
        setGameName(jsonData.gameTitle);
        setGameType(jsonData.gameType);
        setData(jsonData);
      } catch (error) {
        console.error("Error fetching game data:", error);
      }
    };

    fetchData();
  }, [getGame, otp]);

  useEffect(() => {
    if (startGame) {
      setShowCountdown(true);

      const countdownTimer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);

      setTimeout(() => {
        clearInterval(countdownTimer);
        setShowCountdown(false);
        setShowQuestion(true);
      }, 5000);

      return () => clearInterval(countdownTimer);
    }
  }, [startGame]);

  useEffect(() => {
    if (showQuestion) {
      const questionInterval = setInterval(() => {
        setQuestionTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      setTimeout(() => {
        clearInterval(questionInterval);
        setQuestionTimer(30);
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        setShowQuestion(false);
        setShowCountdown(true);
        setCountdown(5);
      }, 30000);

      return () => clearInterval(questionInterval);
    }
  }, [showQuestion]);

  if (!data) {
    return <div>Loading...</div>;
  }

  const currentQuestion = data.questions[currentQuestionIndex];

  return (
    <div className="p-5 text-center">
      {startGame && (
        <>
          <h2 className="text-xl mt-5">Time Remaining: {questionTimer}</h2>
          {showCountdown && (
            <h2 className="text-xl mb-5">Countdown: {countdown}</h2>
          )}
          {showQuestion && currentQuestion && (
            <div>
              {currentQuestion.questionImage &&
                currentQuestion.questionImage[0] && (
                  <img
                    src={currentQuestion.questionImage[0]}
                    alt="Question"
                    className="mx-auto mb-5 max-w-xs h-auto"
                  />
                )}
              <h2 className="text-xl mb-5">{currentQuestion.question}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion.options.map((option, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-start p-4 border border-gray-300 rounded-lg"
                  >
                    {currentQuestion.optionImages && (
                      <img
                        src={currentQuestion.optionImages[index]}
                        alt={option}
                        className="w-16 h-16 mr-4"
                      />
                    )}
                    <p className="text-lg">{option}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PlayGame;

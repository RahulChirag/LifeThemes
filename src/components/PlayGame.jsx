// src/components/PlayGame.jsx
import React, { useState, useEffect } from "react";
import { useUserAuth } from "../context/UserAuthContext";
import Countdown from "./Countdown";
import Question from "./Question";
import GameType from "./GameType";
import Leaderboard from "./Leaderboard";
import GameOver from "./GameOver";

const PlayGame = ({ otp, startGame, username }) => {
  const { getGame, updateScore } = useUserAuth();
  const [firebaseGameData, setFirebaseGameData] = useState(null);
  const [data, setData] = useState(null);
  const [countDown, setCountDown] = useState(5);
  const [countdownFinished, setCountdownFinished] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [showGameType, setShowGameType] = useState(false);
  const [gameTypeCountDown, setGameTypeCountDown] = useState(null);
  const [score, setScore] = useState(0);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false); // New state for game over

  const fetchData = async () => {
    const response = await fetch(`/games/${firebaseGameData.gameName}.json`);
    const jsonData = await response.json();
    setData(jsonData);
  };

  useEffect(() => {
    const unsubscribe = getGame(otp, setFirebaseGameData);

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [otp, getGame]);

  useEffect(() => {
    if (firebaseGameData) {
      fetchData();
    }
  }, [firebaseGameData]);

  useEffect(() => {
    if (data) {
      const countdownInterval = setInterval(() => {
        setCountDown((prevCount) => {
          if (prevCount === 0) {
            clearInterval(countdownInterval);
            setCountdownFinished(true);
            setShowQuestion(true);
            setTimeout(() => {
              setShowQuestion(false);
              setShowGameType(true);
              setGameTypeCountDown(data.eachQuestionDuration);
            }, 5000);
          }
          return prevCount - 1;
        });
      }, 1000);

      return () => clearInterval(countdownInterval);
    }
  }, [data, currentQuestionIndex]);

  useEffect(() => {
    if (showGameType) {
      setGameTypeCountDown(data.eachQuestionDuration);
      const gameTypeInterval = setInterval(() => {
        setGameTypeCountDown((prevCount) => {
          if (prevCount === 0) {
            clearInterval(gameTypeInterval);
            setShowGameType(false);
            setShowLeaderboard(true);
            setTimeout(() => {
              setShowLeaderboard(false);
              if (currentQuestionIndex < data.questions.length - 1) {
                setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
                setCountdownFinished(false);
                setCountDown(5);
                setShowQuestion(false);
                setShowGameType(false);
                setGameTypeCountDown(null);
              } else {
                setIsGameOver(true); // Set game over state
              }
            }, 10000);
          }
          return prevCount - 1;
        });
      }, 1000);

      return () => clearInterval(gameTypeInterval);
    }
  }, [showGameType, currentQuestionIndex]);

  const handleTimeUp = () => {
    setShowGameType(false);
    setShowLeaderboard(true);
    setTimeout(() => {
      setShowLeaderboard(false);
      if (currentQuestionIndex < data.questions.length - 1) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        setCountdownFinished(false);
        setCountDown(5);
        setShowQuestion(false);
        setShowGameType(false);
        setGameTypeCountDown(null);
      } else {
        setIsGameOver(true); // Set game over state
      }
    }, 10000);
  };

  return (
    <>
      {isGameOver ? (
        <GameOver
          username={username}
          finalScore={score}
          leaderboardData={firebaseGameData}
        />
      ) : countdownFinished ? (
        showQuestion && <Question index={currentQuestionIndex} data={data} />
      ) : (
        <Countdown countDown={countDown} />
      )}
      {showGameType && (
        <div>
          <GameType
            index={currentQuestionIndex}
            data={data}
            gameTypeCountDown={gameTypeCountDown}
            score={score}
            setScore={setScore}
            onTimeUp={handleTimeUp}
            otp={otp}
            username={username}
            setCountdownFinished={setCountdownFinished}
            setGameTypeCountDown={setGameTypeCountDown}
          />
        </div>
      )}
      {showLeaderboard && firebaseGameData && (
        <Leaderboard leaderboardData={firebaseGameData} />
      )}
    </>
  );
};

export default PlayGame;

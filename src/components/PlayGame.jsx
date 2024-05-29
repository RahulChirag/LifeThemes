import React, { useState, useEffect } from "react";
import { useUserAuth } from "../context/UserAuthContext";
import Countdown from "../components/Countdown";
import Question from "../components/Question";
import GameType from "../components/GameType";

const PlayGame = ({ otp, startGame }) => {
  const { getGame } = useUserAuth();
  const [firebaseGameData, setFirebaseGameData] = useState(null);
  const [data, setData] = useState(null);
  const [countDown, setCountDown] = useState(5);
  const [countdownFinished, setCountdownFinished] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [showGameType, setShowGameType] = useState(false);
  const [gameTypeCountDown, setGameTypeCountDown] = useState(null);
  const [score, setScore] = useState(0);

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
    const countdownInterval = setInterval(() => {
      setCountDown((prevCount) => {
        if (prevCount === 0) {
          clearInterval(countdownInterval);
          setCountdownFinished(true);
          setShowQuestion(true);
          setTimeout(() => {
            setShowQuestion(false);
            setShowGameType(true);
            if (data) {
              setGameTypeCountDown(data.eachQuestionDuration);
            }
          }, 5000);
        }
        return prevCount - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [data]);

  useEffect(() => {
    if (showGameType) {
      setGameTypeCountDown(data.eachQuestionDuration);
      const gameTypeInterval = setInterval(() => {
        setGameTypeCountDown((prevCount) => {
          if (prevCount === 0) {
            clearInterval(gameTypeInterval);
            setShowGameType(false);
          }
          return prevCount - 1;
        });
      }, 1000);

      return () => clearInterval(gameTypeInterval);
    }
  }, [showGameType]);

  return (
    <>
      {countdownFinished ? (
        showQuestion && <Question index={0} data={data} />
      ) : (
        <Countdown countDown={countDown} />
      )}
      {showGameType && (
        <div>
          <GameType
            index={0}
            data={data}
            gameTypeCountDown={gameTypeCountDown}
            score={score}
            setScore={setScore}
          />
        </div>
      )}
    </>
  );
};

export default PlayGame;

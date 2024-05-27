import React, { useState, useEffect, useCallback } from "react";
import { useUserAuth } from "../context/UserAuthContext";

const Game = ({ game, StarterContent, uuid }) => {
  const { setLobby, showLobby, stopLobby, gameStart, gameEnd, setGameData } =
    useUserAuth();

  const [hosting, setHosting] = useState(true);
  const [lobby, setLobbyState] = useState(false);
  const [studentsJoined, setStudentsJoined] = useState(null);

  const [startGame, setStartGame] = useState(false);
  const [endGame, setEndGame] = useState(false);

  const [generatedOtp, setGeneratedOtp] = useState(
    String(
      Math.floor(Math.random() * 999999)
        .toString()
        .padStart(6, "0")
    )
  );
  const [generateLink, setGenerateLink] = useState(
    `http://localhost:5173/live/${generatedOtp}`
  );

  const host = async (otp) => {
    await setLobby(otp, game, StarterContent);
    setHosting(false);
    setLobbyState(true);
    setStartGame(true);
  };

  const handleStartGame = async (otp) => {
    try {
      gameStart(otp);
      // Ensure all parameters are valid
      if (uuid && StarterContent && game !== undefined) {
        await setGameData(otp, uuid, game, StarterContent, endGame);
        setEndGame(true);
        setStartGame(false);
      } else {
        throw new Error("Missing required data to start the game");
      }
    } catch (error) {
      console.error("Error starting game:", error);
    }
  };

  const handleEndGame = async (otp) => {
    gameEnd(otp);
    setStartGame(true);
    setEndGame(false);
  };

  const stophosting = async (otp) => {
    stopLobby(otp);
    setHosting(true);
    setLobbyState(false);
    setStartGame(false);
    setStudentsJoined(null);
    const newOtp = String(
      Math.floor(Math.random() * 999999)
        .toString()
        .padStart(6, "0")
    );
    setGeneratedOtp(newOtp);
    setGenerateLink(`http://localhost:5173/live/${newOtp}`);
  };

  const initiateShowLobby = useCallback(async () => {
    if (lobby) {
      try {
        await showLobby(setStudentsJoined, generatedOtp);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    }
  }, [lobby, generatedOtp, setStudentsJoined]);

  useEffect(() => {
    initiateShowLobby();
  }, [initiateShowLobby]);

  return (
    <>
      <h1>Game: {decodeURIComponent(game)}</h1>
      <h1>{generatedOtp}</h1>
      <h1>{generateLink}</h1>
      {hosting && (
        <button className="bg-green-300" onClick={() => host(generatedOtp)}>
          Host Live
        </button>
      )}
      {lobby && <h2>Lobby is now live!</h2>}
      {studentsJoined !== null && studentsJoined.length > 0 && (
        <div>
          <h3>Students Joined:</h3>
          <ul>
            {studentsJoined.map((student, index) => (
              <li key={index}>{student}</li>
            ))}
          </ul>
        </div>
      )}

      {hosting || (
        <button
          className="bg-rose-300"
          onClick={() => stophosting(generatedOtp)}
        >
          Stop Live
        </button>
      )}
      {startGame && (
        <button
          className="bg-green-500"
          onClick={() => handleStartGame(generatedOtp)}
        >
          Start Game
        </button>
      )}
      {endGame && (
        <button
          className="bg-rose-500"
          onClick={() => handleEndGame(generatedOtp)}
        >
          Game End
        </button>
      )}
    </>
  );
};

export default Game;

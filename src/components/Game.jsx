import React, { useState, useEffect, useCallback } from "react";
import { useUserAuth } from "../context/UserAuthContext";

const Game = (game, StarterContent) => {
  const { setLobby, showLobby, stopLobby } = useUserAuth();

  const [hosting, setHosting] = useState(true);
  const [lobby, setLobbyState] = useState(false);
  const [studentsJoined, setStudentsJoined] = useState(null); // Change initial state to null

  const [generatedOtp, setGeneratedOtp] = useState(
    String(
      Math.floor(Math.random() * 999999)
        .toString()
        .padStart(6, "0")
    )
  );

  const host = async (otp) => {
    await setLobby(otp, game.game, StarterContent);
    setHosting(false);
    setLobbyState(true);
  };

  const stophosting = async (otp) => {
    stopLobby(otp);
    setHosting(true);
    setLobbyState(false);
    setStudentsJoined(null);
    const newotp = String(
      Math.floor(Math.random() * 999999)
        .toString()
        .padStart(6, "0")
    );
    setGeneratedOtp(newotp);
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
      <h1>Game: {decodeURIComponent(game.game)}</h1>
      <h1>{generatedOtp}</h1>
      {hosting && (
        <button className="bg-green-300" onClick={() => host(generatedOtp)}>
          Host Live
        </button>
      )}
      {lobby && <h2>Lobby is now live!</h2>}
      {studentsJoined !== null &&
        studentsJoined.length > 0 && ( // Check if studentsJoined is not null
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
    </>
  );
};

export default Game;

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";
import PlayGame from "../components/PlayGame";

const Live = () => {
  const { data: routeData } = useParams();
  const { getDataGame, setPlayerUsername, addPlayer, showLobby } =
    useUserAuth();
  const [hostData, setHostData] = useState(null);
  const [userNameExists, setUserNameExists] = useState(false);
  const [username, setUsername] = useState("");
  const [studentsJoined, setStudentsJoined] = useState([]);
  const [error, setError] = useState("");

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleAddUsername = async () => {
    if (!username.trim()) {
      setError("Username cannot be empty.");
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }

    try {
      await setPlayerUsername(routeData, username.trim());
      await addPlayer(routeData, username.trim());
      setUserNameExists(true);
      showLobby(setStudentsJoined, routeData); // Start showing the lobby
    } catch (error) {
      console.error("Error adding username:", error);
      setError("Username already exists. Please enter a different username.");
      setTimeout(() => {
        setError("");
      }, 2000);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const unsubscribe = await getDataGame(routeData, setHostData);
        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching host data:", error);
      }
    };

    fetchData();
  }, [routeData]);

  return (
    <div className="container mx-auto p-4">
      {hostData ? (
        <div>
          {hostData.isLive ? (
            <div>
              {userNameExists ? (
                <div>
                  {hostData.startGame.toString() === "false" ? (
                    <>
                      <h1 className="text-3xl font-bold mb-4">
                        Live Component
                      </h1>
                      <p className="mb-2">
                        Game:{" "}
                        <span className="font-semibold">{hostData.game}</span>
                      </p>
                      <p className="mb-2">
                        Teacher ID:{" "}
                        <span className="font-semibold">
                          {hostData.teacherId}
                        </span>
                      </p>
                      <p className="mb-2">
                        User Name:{" "}
                        <span className="font-semibold">{username}</span>
                      </p>
                      <p className="mb-2">
                        {hostData.startGame.toString() === "true" ? (
                          <span className="text-green-600 font-semibold">
                            Game is Live
                          </span>
                        ) : (
                          <span className="text-red-600 font-semibold">
                            Game is Not Live
                          </span>
                        )}
                      </p>
                      <h2 className="text-xl font-bold mb-2">Lobby</h2>
                      <ul>
                        {studentsJoined.map((student, index) => (
                          <li key={index} className="mb-1">
                            {student}
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <PlayGame
                      otp={routeData}
                      startGame={
                        hostData.startGame.toString() === "true" && true
                      }
                    />
                  )}
                </div>
              ) : (
                <div>
                  <input
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={handleUsernameChange}
                    className="border border-gray-300 rounded px-2 py-1 mb-2 w-full"
                  />
                  {error && <p className="text-red-500">{error}</p>}
                  <button
                    onClick={handleAddUsername}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
                  >
                    Add Username
                  </button>
                </div>
              )}
            </div>
          ) : (
            <p className="text-red-500">The game is not live currently.</p>
          )}
        </div>
      ) : (
        <p className="text-red-500">No game exists for the provided OTP.</p>
      )}
    </div>
  );
};

export default Live;

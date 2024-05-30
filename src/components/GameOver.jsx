// src/components/GameOver.jsx
import React from "react";
import Leaderboard from "./Leaderboard";

const GameOver = ({ username, finalScore, leaderboardData }) => {
  return (
    <div className="p-5 flex flex-col justify-center items-center h-screen">
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5">
        Game Over
      </h1>
      <div className="text-lg md:text-xl lg:text-2xl font-semibold mb-5">
        Username: {username}
      </div>
      <div className="text-lg md:text-xl lg:text-2xl font-semibold mb-5">
        Final Score: {finalScore}
      </div>
      <div className="w-full md:w-3/4 lg:w-1/2">
        <Leaderboard leaderboardData={leaderboardData} />
      </div>
    </div>
  );
};

export default GameOver;

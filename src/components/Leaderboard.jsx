import React from "react";

const Leaderboard = ({ leaderboardData }) => {
  // Check if leaderboardData exists and has players
  if (
    !leaderboardData ||
    !leaderboardData.players ||
    typeof leaderboardData.players !== "object"
  ) {
    return (
      <div className="p-5">
        <h1 className="text-2xl font-bold">Leaderboard</h1>
        <p>No player data available.</p>
      </div>
    );
  }

  // Convert players object to an array
  const playersArray = Object.keys(leaderboardData.players).map((key) => ({
    username: key,
    score: leaderboardData.players[key].score,
  }));

  // Sort the players by score in descending order
  const sortedPlayers = playersArray.sort((a, b) => b.score - a.score);

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5">Leaderboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {sortedPlayers.map((player, index) => (
          <div
            key={index}
            className="p-4 border rounded-lg shadow-sm hover:shadow-lg transition-shadow bg-white"
          >
            <div className="text-xl font-semibold">{player.username}</div>
            <div className="text-lg">Score: {player.score}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;

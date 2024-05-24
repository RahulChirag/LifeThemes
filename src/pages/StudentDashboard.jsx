import React, { useState } from "react";
import { useUserAuth } from "../context/UserAuthContext";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const StudentDashboard = () => {
  const { handleLogOut, user, setUsername } = useUserAuth();
  const navigate = useNavigate();
  const [newUsername, setNewUsername] = useState("");

  const handleLogout = () => {
    handleLogOut();
    navigate("/");
  };

  const handleSetUsername = async () => {
    if (newUsername.trim()) {
      try {
        await setUsername(user.uid, newUsername);
        setNewUsername("");
      } catch (error) {
        console.error("Error setting username:", error);
      }
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-200">
      <Header
        user={user}
        newUsername={newUsername}
        setNewUsername={setNewUsername}
        handleSetUsername={handleSetUsername}
        handleLogout={handleLogout}
      />
      {/* Add your content here */}
    </div>
  );
};

export default StudentDashboard;

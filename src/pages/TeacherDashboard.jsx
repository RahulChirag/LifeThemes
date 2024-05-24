import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";
import Header from "../components/Header";
import TopicSearch from "../components/TopicSearch";
import TopicDisplay from "../components/TopicDisplay";
import jsonData from "../data/data.json";

const TeacherDashboard = () => {
  const { handleLogOut, user, setUsername } = useUserAuth();
  const navigate = useNavigate();
  const { data } = useParams(); // Get the optional parameter
  const [newUsername, setNewUsername] = useState("");
  const [parsedData, setParsedData] = useState(null);

  useEffect(() => {
    if (data) {
      try {
        const decodedId = parseInt(decodeURIComponent(data), 10);
        const selectedData = jsonData.find((item) => item.id === decodedId);
        setParsedData(selectedData);
      } catch (error) {
        console.error("Error parsing data:", error);
      }
    }
  }, [data]);

  useEffect(() => {
    // Update newUsername state when user object changes
    if (user && user.username) {
      setNewUsername(user.username);
    }
  }, [user]);

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
    <div className="h-screen bg-gray-100">
      <Header
        user={user}
        newUsername={newUsername}
        setNewUsername={setNewUsername}
        handleSetUsername={handleSetUsername}
        handleLogout={handleLogout}
      />
      <div className="pt-24 container mx-auto px-4 py-8">
        {parsedData ? (
          <>
            <TopicDisplay parsedData={parsedData} />
          </>
        ) : (
          <>
            <div className="text-center text-gray-800">
              <h1 className="text-3xl font-semibold mb-4">
                Welcome, {user.username || user.email}!
              </h1>
              <p className="text-lg mb-8">
                Explore topics and enhance your teaching experience.
              </p>
            </div>
            <TopicSearch />
          </>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;

import React from "react";

const Header = ({
  user,
  newUsername,
  setNewUsername,
  handleSetUsername,
  handleLogout,
}) => {
  const handleInputChange = (e) => {
    setNewUsername(e.target.value);
  };

  const handleSetUsernameClick = () => {
    handleSetUsername();
  };

  return (
    <header className="w-full p-3 flex flex-row items-center flex-wrap bg-sky-600 fixed top-0 left-0">
      <h1 className="p-1 bg-white ml-2">{user.email}</h1>
      {user.username ? (
        <h1 className="p-1 bg-white ml-2">{user.username}</h1>
      ) : (
        <>
          <input
            type="text"
            placeholder="Type username here"
            className="p-1 bg-white ml-2 border border-gray-300 rounded"
            value={newUsername}
            onChange={handleInputChange}
          />
          <button
            className="p-1 bg-white ml-2 border border-gray-300 rounded hover:bg-gray-100"
            onClick={handleSetUsernameClick}
          >
            Set Username
          </button>
        </>
      )}
      <h1 className="p-1 bg-white ml-2 mr-2 flex-grow text-center">
        {user.role}
      </h1>
      <button
        onClick={handleLogout}
        className="p-1 mx-auto bg-rose-900 text-white rounded"
      >
        Log Out
      </button>
    </header>
  );
};

export default Header;

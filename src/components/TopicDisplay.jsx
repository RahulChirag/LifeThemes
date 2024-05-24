import React from "react";

const TopicDisplay = ({ parsedData }) => {
  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-center">
        <div className="max-w-md w-full md:w-1/2 mb-4">
          <div className="max-w-sm flex flex-row rounded overflow-hidden shadow-lg bg-white">
            <img
              src={`/assets/topic-images/${parsedData.imgUrl}`}
              alt=""
              className="w-full md:w-40 h-auto"
            />
            <div className="flex flex-col px-6 py-4">
              <h2 className="font-bold text-xl mb-2">{parsedData.title}</h2>
              <div className="flex flex-wrap">
                <span className="mr-2 mb-2 bg-blue-500 text-white px-2 py-1 rounded">
                  Subject: {parsedData.subject}
                </span>
                <span className="mr-2 mb-2 bg-blue-500 text-white px-2 py-1 rounded">
                  Board: {parsedData.board}
                </span>
                <span className="mr-2 mb-2 bg-blue-500 text-white px-2 py-1 rounded">
                  Grade: {parsedData.grade}
                </span>
                <span className="mr-2 mb-2 bg-blue-500 text-white px-2 py-1 rounded">
                  Chapter: {parsedData.chapter}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-md w-full md:w-1/2">
          <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white">
            <div className="px-6 py-4">
              <div className="flex flex-wrap">
                {parsedData.gameTypes.map((gameType, index) => (
                  <button
                    key={index}
                    className="mr-2 mb-2 bg-rose-500 text-white px-4 py-2 rounded"
                  >
                    {gameType}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicDisplay;

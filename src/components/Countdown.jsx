import React from "react";

const Countdown = ({ countDown }) => {
  return (
    <div className="p-5 text-center">{countDown === 0 ? "Go!" : countDown}</div>
  );
};

export default Countdown;

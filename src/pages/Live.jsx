import React from "react";
import { useParams } from "react-router-dom";

const Live = () => {
  const { data } = useParams();

  return <div>OTP: {data}</div>;
};

export default Live;

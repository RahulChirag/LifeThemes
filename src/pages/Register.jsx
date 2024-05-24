import React, { useState } from "react";
import { useUserAuth } from "../context/UserAuthContext";

const Register = () => {
  const [role, setRole] = useState("Select Role");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { signUp } = useUserAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signUp(email, password, role);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="w-1/2 p-2 bg-rose-300 flex flex-col justify-center items-center">
      <legend>
        <h1 className="p-2 bg-blue-600">Register</h1>
      </legend>
      {error && <div className="w-auto p-2 bg-red-500">{error}</div>}
      <form
        className="p-2 bg-rose-600 flex flex-col justify-center items-center"
        onSubmit={handleRegister} // Corrected function name here as well
      >
        <label className="p-2 flex flex-col justify-center items-center">
          Select Role:
          <select
            className="p-2 w-auto"
            onChange={(e) => setRole(e.target.value)}
            value={role}
          >
            <option value="">Select Role</option>
            <option value="Teacher">Teacher</option> {/* Fixed typo */}
            <option value="Student">Student</option>
          </select>
        </label>
        <label className="p-2 flex flex-col justify-center items-center">
          Email:
          <input
            type="text"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </label>
        <label className="p-2 flex flex-col justify-center items-center">
          Password:
          <input
            type="password"
            placeholder="Enter your Password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </label>
        <button type="submit" className="p-2 bg-green-300">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;

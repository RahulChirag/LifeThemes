import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useUserAuth } from "./context/UserAuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import LoadingSpinner from "./components/LoadingSpinner";
import Live from "./pages/Live";

function App() {
  const { user } = useUserAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timeout);
  }, [user]);

  useEffect(() => {
    setLoading(true); // Set loading to true when user changes
  }, [user]);

  // Wait until user authentication state is resolved before rendering
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          user ? (
            user.role === "Teacher" ? (
              <Navigate to="/teacher" replace />
            ) : (
              <Navigate to="/student" replace />
            )
          ) : (
            <Login />
          )
        }
      />
      <Route path="/signup" element={<Register />} />
      <Route
        path="/student"
        element={
          <ProtectedRoute>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher"
        element={
          <ProtectedRoute>
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/:data"
        element={
          <ProtectedRoute>
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/:data/live/:game/:isStarterContent"
        element={
          <ProtectedRoute>
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/live/:data" element={<Live />} />
      <Route path="*" element={<Navigate to="/" replace />} />{" "}
      {/* 404 handling */}
    </Routes>
  );
}

export default App;

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { token, user_id } = useAuth();
  if (!token || !user_id) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;

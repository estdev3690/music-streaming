import React from "react";
import { Navigate } from "react-router-dom";
import cookie from "js-cookie";

export default function PrivateRoute({ children }) {
  const token = cookie.get("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

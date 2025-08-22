import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ allowRoles, children }) {
  const { role, token } = useSelector((s) => s.auth);
  const loc = useLocation();

  // If no token, redirect to auth page
  if (!token) {
    return <Navigate to="/auth" replace state={{ from: loc }} />;
  }

  // If no role, redirect to auth page
  if (!role) {
    return <Navigate to="/auth" replace state={{ from: loc }} />;
  }

  // If role is not in allowed roles, redirect to appropriate dashboard
  if (Array.isArray(allowRoles) && allowRoles.length > 0 && !allowRoles.includes(role)) {
    if (role === "customer") {
      return <Navigate to="/customer" replace />;
    } else if (role === "provider" || role === "admin") {
      return <Navigate to="/provider" replace />;
    } else {
      return <Navigate to="/auth" replace />;
    }
  }

  return children;
}



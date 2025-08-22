import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ allowRoles, children }) {
  const { role } = useSelector((s) => s.auth);
  const loc = useLocation();

  if (!role) {
    return <Navigate to="/login" replace state={{ from: loc }} />;
  }
  if (Array.isArray(allowRoles) && allowRoles.length > 0 && !allowRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }
  return children;
}



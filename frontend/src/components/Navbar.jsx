import React from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import "./Navbar.css";

export default function Navbar() {
  const { role, name, email } = useSelector((s) => s.auth);
  const nav = useNavigate();
  const loc = useLocation();
  const dispatch = useDispatch();

  const onLogout = () => {
    dispatch(logout());
    nav("/auth");
  };

  const isAuthRoute = loc.pathname === "/auth";

  if (isAuthRoute) {
    return null; // Don't show navbar on auth page
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to={role === "provider" ? "/provider" : role ? "/customer" : "/"} className="navbar-brand">
          <span className="brand-icon">📅</span>
          Appointment Scheduler
        </Link>

        <div className="navbar-menu">
          {role === "customer" && (
            <>
              <NavLink to="/customer" className="nav-link">Dashboard</NavLink>
              <NavLink to="/book" className="nav-link">Book Appointment</NavLink>
            </>
          )}

          {(role === "provider" || role === "admin") && (
            <>
              <NavLink to="/provider" className="nav-link">Dashboard</NavLink>
              <NavLink to="/availability" className="nav-link">Availability</NavLink>
            </>
          )}
        </div>

        <div className="navbar-user">
          {role ? (
            <>
              <div className="user-info">
                <span className="user-name">{name || 'User'}</span>
                <span className="user-role">{role}</span>
              </div>
              <button onClick={onLogout} className="logout-button">
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/auth" className="nav-link">Login</NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}




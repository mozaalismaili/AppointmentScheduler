import React from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useTheme } from "../context/ThemeContext";
import { useLocale } from "../context/LocaleContext";
import { t } from "../locales/translations";
import "./Navbar.css";

export default function Navbar() {
  const { role, name, email } = useSelector((s) => s.auth);
  const nav = useNavigate();
  const loc = useLocation();
  const dispatch = useDispatch();
  const { isDark, toggleTheme } = useTheme();
  const { locale, changeLocale } = useLocale();

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
        {/* Left Section - Brand */}
        <div className="navbar-left">
          <Link 
            to={role === "provider" ? "/provider" : role ? "/customer" : "/"} 
            className="navbar-brand"
          >
            <span className="brand-icon">📅</span>
            <span className="brand-text">Appointment Scheduler</span>
          </Link>
        </div>

        {/* Center Section - Navigation Menu */}
        <div className="navbar-center">
          <div className="navbar-menu">
            {role === "customer" && (
              <>
                <NavLink to="/customer" className="nav-link">
                  {t('dashboard', locale)}
                </NavLink>
                <NavLink to="/book" className="nav-link">
                  {t('bookAppointment', locale)}
                </NavLink>
              </>
            )}

            {(role === "provider" || role === "admin") && (
              <>
                <NavLink to="/provider" className="nav-link">
                  {t('dashboard', locale)}
                </NavLink>
                <NavLink to="/availability" className="nav-link">
                  {t('availability', locale)}
                </NavLink>
              </>
            )}
          </div>
        </div>

        {/* Right Section - Controls and User */}
        <div className="navbar-right">
          {/* Global Controls */}
          <div className="navbar-controls">
            <button 
              className="theme-toggle"
              onClick={toggleTheme}
              title={t('toggleTheme', locale)}
              aria-label={t('toggleTheme', locale)}
            >
              {isDark ? '☀️' : '🌙'}
            </button>
            
            <select 
              className="language-select"
              value={locale}
              onChange={(e) => changeLocale(e.target.value)}
              aria-label={t('changeLanguage', locale)}
            >
              <option value="en">{t('english', locale)}</option>
              <option value="ar">{t('arabic', locale)}</option>
            </select>
          </div>

          {/* User Section */}
          <div className="navbar-user">
            {role ? (
              <>
                <div className="user-info">
                  <span className="user-name">{name || t('user', locale)}</span>
                  <span className="user-role">{t(role, locale)}</span>
                </div>
                <button 
                  onClick={onLogout} 
                  className="logout-button"
                  aria-label={t('logout', locale)}
                >
                  {t('logout', locale)}
                </button>
              </>
            ) : (
              <NavLink to="/auth" className="nav-link">
                {t('login', locale)}
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}




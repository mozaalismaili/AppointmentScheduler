// src/components/LoginSignup/LoginSignup.jsx
import React, { useState } from 'react';
import './LoginSignup.css';

import user_icon     from '../../assets/login-icons/user_icon.png';
import email_icon    from '../../assets/login-icons/email_icon.png';
import password_icon from '../../assets/login-icons/pass_icon.png';

const isValidEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

export default function LoginSignup() {
  const [action, setAction] = useState("Login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  function validate() {
    const e = {};
    if (action === "Sign Up") {
      if (!form.name.trim()) e.name = "Full name is required.";
      else if (form.name.trim().length < 2) e.name = "Name is too short.";
    }
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!isValidEmail(form.email.trim())) e.email = "Enter a valid email.";
    if (!form.password) e.password = "Password is required.";
    else if (form.password.length < 6) e.password = "Password must be 6+ characters.";
    return e;
  }

  async function handleSubmit(e) {
    e?.preventDefault?.();
    const eobj = validate();
    setErrors(eobj);
    if (Object.keys(eobj).length) return;

    setLoading(true);
    setMsg(null);
    try {
      // TODO: swap with real API call when backend ready
      await new Promise((r) => setTimeout(r, 700));
      setMsg({ type: "success", text: action === "Login" ? "Logged in" : "Account created" });
    } catch (err) {
      setMsg({ type: "error", text: "Network error — try again" });
    } finally {
      setLoading(false);
      setTimeout(() => setMsg(null), 2000);
    }
  }

  return (
    <div className='container'>
      <div className="header">
        <div className="text">{action}</div>
        <div className="underline" />
      </div>

      <form className='inputs' onSubmit={handleSubmit} noValidate>
        {action === "Sign Up" && (
          <>
            <div className='input'>
              <img src={user_icon} alt="" />
              <input
                value={form.name}
                onChange={(ev) => setForm(f => ({ ...f, name: ev.target.value }))}
                type="text"
                placeholder='Full Name'
              />
            </div>
            {errors.name && <div className="err">{errors.name}</div>}
          </>
        )}

        <div className='input'>
          <img src={email_icon} alt="" />
          <input
            value={form.email}
            onChange={(ev) => setForm(f => ({ ...f, email: ev.target.value }))}
            type="email"
            placeholder='Email'
          />
        </div>
        {errors.email && <div className="err">{errors.email}</div>}

        <div className='input'>
          <img src={password_icon} alt="" />
          <input
            value={form.password}
            onChange={(ev) => setForm(f => ({ ...f, password: ev.target.value }))}
            type="password"
            placeholder='Password'
          />
        </div>
        {errors.password && <div className="err">{errors.password}</div>}

        {action === "Login" ? (
          <div className="forgot-password">Forgot password? <span>Reset!</span></div>
        ) : <div style={{ height: 28 }} />}

        <div className="submit-container">
          <button
            type="button"
            className={action==="Login"?"submit gray":"submit"}
            onClick={() => { setAction("Sign Up"); setErrors({}); }}
            disabled={loading}
          >
            Sign Up
          </button>

          <button
            type="button"
            className={action==="Sign Up"?"submit gray":"submit"}
            onClick={() => { setAction("Login"); setErrors({}); }}
            disabled={loading}
          >
            Login
          </button>

          <button
            type="submit"
            className="submit submit-primary"
            disabled={loading}
            style={{ marginLeft: 12 }}
          >
            {loading ? (action === "Login" ? "Logging in..." : "Signing up...") : (action === "Login" ? "Login" : "Create Account")}
          </button>
        </div>
      </form>

      {msg && (
        <div className={`simple-toast ${msg.type === "success" ? "ok" : "bad"}`}>
          {msg.text}
        </div>
      )}
    </div>
  );
}

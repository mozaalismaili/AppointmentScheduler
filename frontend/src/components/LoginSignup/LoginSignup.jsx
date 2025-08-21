import React, { useState } from 'react';
import { useNotifications } from '../ui/notifications/useNotifications';
import './LoginSignup.css';

import user_icon     from '../../assets/login-icons/user_icon.png';
import email_icon    from '../../assets/login-icons/email_icon.png';
import password_icon from '../../assets/login-icons/pass_icon.png';

export default function LoginSignup() {

  const [action, setAction] = useState("Login");
  const { notify } = useNotifications();

  return (
    <div className='container'>

      <div className="header">
        <div className="text">{action}</div>
        <div className="underline"> </div>
      </div>

      <div className='inputs'>
        {action === "Login" ? <div></div> : (
          <div className='input'>
            <img src={user_icon} alt="" />
            <input type="text" placeholder='Full Name' />
          </div>
        )}

        <div className='input'>
          <img src={email_icon} alt="" />
          <input type="email" placeholder='Email' />
        </div>

        <div className='input'>
          <img src={password_icon} alt="" />
          <input type="password" placeholder='Password' />
        </div>
      </div>

      {action === "Sign Up" ? <div></div> : (
        <div className="forgot-password">Forgot password? <span>Reset!</span></div>
      )}

      <div className="submit-container">
        <div
          className={action === "Login" ? "submit gray" : "submit"}
          onClick={() => {
            if (action !== "Sign Up") return setAction("Sign Up");
            const name  = document.querySelector('input[placeholder="Full Name"]')?.value?.trim();
            const email = document.querySelector('input[type="email"]')?.value?.trim();
            const pass  = document.querySelector('input[type="password"]')?.value?.trim();
            if (!name || !email || !pass) {
              return notify({ variant: 'error', message: 'Fill name, email & password' });
            }
            notify({ variant: 'success', message: 'Account created (UI only)' });
          }}
        >
          Sign Up
        </div>

        <div
          className={action === "Sign Up" ? "submit gray" : "submit"}
          onClick={() => {
            if (action !== "Login") return setAction("Login");
            const email = document.querySelector('input[type="email"]')?.value?.trim();
            const pass  = document.querySelector('input[type="password"]')?.value?.trim();
            if (!email || !pass) {
              return notify({ variant: 'error', message: 'Enter email & password' });
            }
            notify({ variant: 'success', message: 'Signed in (UI only)' });
          }}
        >
          Login
        </div>
      </div>
    </div>
  );
}

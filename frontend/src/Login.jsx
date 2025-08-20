import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import "./login.css";

const LoginSchema = z.object({
  email: z.string().min(3, "Enter your email").email("Invalid email"),
  password: z.string().min(6, "Minimum 6 characters"),
  role: z.enum(["customer", "provider"], { required_error: "Choose a role" }),
  remember: z.boolean().optional(),
});

export default function Login() {
  const nav = useNavigate();
  const [showPwd, setShowPwd] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "", role: "customer", remember: true },
    mode: "onBlur",
  });

  function saveUser(user, remember) {
    const payload = JSON.stringify(user);
    (remember ? localStorage : sessionStorage).setItem("user", payload);
    if (!remember) localStorage.removeItem("user");
  }

  async function onSubmit(values) {
    // Frontend-only “login”
    const user = { email: values.email, role: values.role };
    saveUser(user, !!values.remember);
    nav(values.role === "provider" ? "/provider" : "/customer", { replace: true });
  }

  return (
    <div className="bp-bg">
      <div className="bp-decor-1" />
      <div className="bp-decor-2" />

      <main className="bp-shell" aria-live="polite">
        <header className="lg-header">
          <h1>Welcome back</h1>
          <p>Sign in to manage your appointments.</p>
        </header>

        <section className="bp-card lg-card" aria-labelledby="login-title">
          <h2 id="login-title" className="sr-only">Login</h2>

          <form className="bp-form lg-form" onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Email */}
            <div className="bp-field">
              <label htmlFor="email" className="bp-label">Email</label>
              <input
                id="email"
                type="email"
                className="bp-input"
                placeholder="you@example.com"
                {...register("email")}
                aria-invalid={!!errors.email}
              />
              {errors.email && <p className="bp-error">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="bp-field">
              <label htmlFor="password" className="bp-label">Password</label>
              <div className="lg-password">
                <input
                  id="password"
                  type={showPwd ? "text" : "password"}
                  className="bp-input"
                  placeholder="••••••••"
                  {...register("password")}
                  aria-invalid={!!errors.password}
                />
                <button
                  type="button"
                  className="lg-eye"
                  onClick={() => setShowPwd(v => !v)}
                  aria-label={showPwd ? "Hide password" : "Show password"}
                >
                  {showPwd ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.password && <p className="bp-error">{errors.password.message}</p>}
            </div>

            {/* Role */}
            <div className="bp-field">
              <label htmlFor="role" className="bp-label">Role</label>
              <select id="role" className="bp-select" {...register("role")}>
                <option value="customer">Customer</option>
                <option value="provider">Provider</option>
              </select>
              {errors.role && <p className="bp-error">{errors.role.message}</p>}
            </div>

            {/* Remember me */}
            <div className="lg-row">
              <label className="lg-remember">
                <input type="checkbox" {...register("remember")} defaultChecked />
                <span>Remember me</span>
              </label>
              <span className="lg-hint"></span>
            </div>

            <button type="submit" className={`bp-btn ${isSubmitting ? "bp-btn--busy" : ""}`} disabled={isSubmitting}>
              <span className="bp-btn__spinner" aria-hidden />
              {isSubmitting ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

import { useState } from "react";

import { Link , useNavigate, useLocation } from "react-router-dom";
import "../styles/login.css";
import bg from "../assets/image/bg-brand.jpg";
import logoImg from "../assets/image/logo1.png";
function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPwd, setShowPwd] = useState(false);
  const [role, setRole] = useState("candidate");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("login");
  const [form, setForm] = useState({ email: "", password: "" });
  const playAnimation = !(location.state && location.state.fromSwitch);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/auth/jwt/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email.trim().toLowerCase(),
          password: form.password,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        const message =
          data?.detail ||
          data?.message ||
          Object.values(data || {})[0] ||
          "Login failed. Please check your credentials.";
        setError(typeof message === "string" ? message : JSON.stringify(message));
      } else {
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);
        if (role === "rh") {
          navigate("/rh");
        } else {
          navigate("/candidate");
        }
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={`login-page${playAnimation ? " animate" : ""}`}>
      <div className="bg">
        <div className="bg-waves">{ }</div>
        <div className="bg-right"></div>
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
        <div className="grid-overlay"></div>
        <div className="separator"></div>
        <div className="page">
          {/* Brand panel can be removed on mobile */}
          <div className="brand-panel">
            <p className="brand-back">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5" />
                <path d="M12 19l-7-7 7-7" />
              </svg>
              <Link to="/">GO back</Link>
            </p>
            <img src={bg} alt="Background" className="bg-img" />
            <div className="logo">
              <img src={logoImg} alt="Logo" className="logo-img" />

              <span className="logo-text">Djezzy CV Match</span>
            </div>

            <div className="brand-content">
              <div className="brand-eyebrow">Recruitment Intelligence</div>
              <h1 className="brand-headline">
                Get started
                <br />
                With <em>us</em>
              </h1>
              <p className="brand-desc">
                Recruiters and candidates can login here, then move into their
                dashboard.
              </p>
              <div className="brand-stats">
                <div className="stat">
                  <span className="stat-number">98%</span>
                  <span className="stat-label">Match rate</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat">
                  <span className="stat-number">12k+</span>
                  <span className="stat-label">Profiles</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat">
                  <span className="stat-number">4.2×</span>
                  <span className="stat-label">Faster hire</span>
                </div>
              </div>
            </div>
            {/*<div className="brand-footer">
              © 2026 Djezzy · All rights reserved
            </div>*/}
          </div>
          <div className="form-panel">
            <div className="glass-card">
              <div className="card-header">
                <h2 className="card-title">Welcome back</h2>
                <p className="card-subtitle">
                  Sign in to your recruiter dashboard
                </p>
                {/*<div className={`nav-links ${activeTab === "signup" ? "signup-active" : "login-active"}`}>
                  <button
                    className={`butn login ${activeTab === "login" ? "active" : ""}`}
                    onClick={() => {
                      setActiveTab("login");
                      navigate("/login");
                    }}
                  >
                    Login
                  </button>

                  <button
                    className={`butn signup ${activeTab === "signup" ? "active" : ""}`}
                    onClick={() => {
                      setActiveTab("signup");
                      navigate("/signup", { state: { fromSwitch: true } });
                    }}
                  >
                    Sign Up
                  </button>
                </div>*/}
              </div>
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label className="form-label" htmlFor="email">
                    Email
                  </label>
                  <div className="input-wrap">
                    <span className="input-icon">
                      {/* Email SVG */}
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                    </span>
                    <input
                      id="email"
                      name="email"
                      className="form-input"
                      type="email"
                      placeholder="you@djezzy.dz"
                      value={form.email}
                      onChange={handleChange}
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="password">
                    Password
                  </label>
                  <div className="input-wrap">
                    <span className="input-icon">
                      {/* Password SVG */}
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="11" width="18" height="11" rx="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </span>
                    <input
                      id="password"
                      name="password"
                      className="form-input"
                      type={showPwd ? "text" : "password"}
                      placeholder="8–16 characters"
                      value={form.password}
                      onChange={handleChange}
                      autoComplete="current-password"
                      required
                      style={{ paddingRight: 44 }}
                    />
                    <button
                      type="button"
                      className="eye-btn"
                      onClick={() => setShowPwd((v) => !v)}
                      title="Toggle password"
                      style={{ opacity: showPwd ? 0.7 : 0.35 }}
                    >
                      {showPwd ? (
                        <svg
                          id="eye-icon"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg
                          id="eye-icon"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                {/* Role select (optional, for your navigation logic) */}
                {error && <div className="form-error">{error}</div>}
                <div className="form-group">
                  <label className="form-label" htmlFor="role">
                    Role
                  </label>
                  <select
                    id="role"
                    className="form-input"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    style={{ paddingLeft: 16 }}
                  >
                    <option value="candidate">Candidate</option>
                    <option value="rh">Recruiter</option>
                  </select>
                </div>
                <div className="form-extras">
                  <a href="#" className="forgot-link">
                    Forgot password?
                  </a>
                </div>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? (
                    "Signing in…"
                  ) : (
                    <>
                      Sign in <span className="btn-arrow">→</span>
                    </>
                  )}
                </button>
              </form>

              <p className="card-footer">
                Don't have an account? <Link to="/signup">Request access</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;

import React, { useState, useRef, useEffect } from "react";
import bg from "../assets/image/hero.jpg";
import logoImg from "../assets/image/logo1.png";
import { Link } from "react-router-dom";
import ProjectCarousel from "./ProjectCarousel";
import ContactMenu from "./contactmenu";
import "../styles/Home.css";


const PhoneIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="rgba(255,255,255,0.9)"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.86 19.86 0 0 1 3 5.18 2 2 0 0 1 5 3h3a2 2 0 0 1 2 1.72c.12.99.36 1.95.72 2.86a2 2 0 0 1-.45 2.11L9.91 10.09a16 16 0 0 0 6 6l1.4-1.4a2 2 0 0 1 2.11-.45c.91.36 1.87.6 2.86.72A2 2 0 0 1 22 16.92z" />
  </svg>
);

const MailIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="rgba(255,255,255,0.9)"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const LinkedInIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="rgba(255,255,255,0.9)"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="2" />
    <path d="M16 11.5c0-1.38.56-2.5 2-2.5s2 1.12 2 2.5V18" />
    <path d="M8 9v9" />
    <path d="M8 7a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
  </svg>
);

const ContactButton = ({
  phone = "tel:+1234567890",
  email = "mailto:you@example.com",
  linkedin = "https://linkedin.com/in/yourprofile",
}) => (
  <div className="contact-wrap">
    <a className="contact-btn" href={phone}>
      contact us
    </a>
    <div className="icons-tray">
      <a className="icon-link" href={phone} title="Phone">
        <PhoneIcon />
      </a>
      <a className="icon-link" href={email} title="Email">
        <MailIcon />
      </a>
      <a
        className="icon-link"
        href={linkedin}
        title="LinkedIn"
        target="_blank"
        rel="noreferrer"
      >
        <LinkedInIcon />
      </a>
    </div>
  </div>
);

function Home() {
  

  return (
    <section className="Home-page">
      <div className="logo1">
                    <img src={logoImg} alt="Logo" className="logo-img1" />
                  </div>
      <div className="navbar">
        <Link className="btn home" to="/">
          Home
        </Link>
        <Link className="btn login" to="/login">
          Login
        </Link>

        <Link className="btn signup" to="/signup">
          Sign Up
        </Link>
      </div>
      <div className="nav-contact">
        <ContactMenu />
      </div>
      <section
        className="hero"
        
        style={{ backgroundImage: `url(${bg})` }}
      ><div className="hero-content">
        <h1 className="welcomeh">Welcome to TalentBridge</h1>
        </div></section>
      
      <section className="content-below">
        <ProjectCarousel />
      </section>
    </section>
  );
}

export default Home;
{
  /*import { useState } from 'react'
{
  /*import { useState } from 'react'
import Login from './Login.jsx'
import Singup from './Singup.jsx'
import '../styles/public-page.css'

const stats = [
  { value: '10k+', label: 'applications tracked' },
  { value: '92%', label: 'faster first screening' },
  { value: '24/7', label: 'candidate access' },
]

function Mainpage({ onGoCandidate }) {
  const [view, setView] = useState('home')

  const openLogin = () => setView('login')
  const openSignup = () => setView('signup')
  const goHome = () => setView('home')

  return (
    <main className="public-app">
      <section className="hero-shell">
        <header className="topbar">
          <button type="button" className="brand" onClick={goHome}>
            TalentBridge
          </button>

          <nav className="topbar-actions" aria-label="Public navigation">
            <button type="button" className="ghost-button" onClick={openLogin}>
              Login
            </button>
            <button type="button" className="primary-button" onClick={openSignup}>
              Sign up
            </button>
          </nav>
        </header>

        <div className="hero-grid">
          <section className="hero-copy">
            <p className="eyebrow">AI recruitment platform</p>
            <h1>Welcome candidates with a clean public page before the dashboard.</h1>
            <p className="hero-text">
              Start with a polished landing page, guide users into sign up or login,
              then connect that flow to the candidate area when you are ready.
            </p>

            <div className="hero-actions">
              <button type="button" className="primary-button" onClick={openSignup}>
                Create account
              </button>
              <button
                type="button"
                className="secondary-button"
                onClick={openLogin}
              >
                I already have an account
              </button>
            </div>

            <div className="stats-row" aria-label="Platform highlights">
              {stats.map((item) => (
                <article key={item.label} className="stat-card">
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </article>
              ))}
            </div>
          </section>

          <aside className="panel-zone">
            {view === 'home' && (
              <section className="feature-card">
                <p className="feature-kicker">Public page flow</p>
                <h2>Two clear actions for every visitor</h2>
                <p>
                  Keep the first experience simple: introduce the platform, then
                  let people choose between signing up and logging in.
                </p>

                <div className="feature-list">
                  <div>
                    <span className="bullet-dot" />
                    <p>Landing page with direct Sign up and Login buttons</p>
                  </div>
                  <div>
                    <span className="bullet-dot" />
                    <p>Separate auth forms inside the public page folder</p>
                  </div>
                  <div>
                    <span className="bullet-dot" />
                    <p>Ready to connect to the future candidate page</p>
                  </div>
                </div>
              </section>
            )}

            {view === 'login' && (
              <Login
                onSuccess={onGoCandidate}
                onSwitchToSignup={openSignup}
                onBack={goHome}
              />
            )}

            {view === 'signup' && (
              <Singup
                onSuccess={openLogin}
                onSwitchToLogin={openLogin}
                onBack={goHome}
              />
            )}
          </aside>
        </div>
      </section>
    </main>
  )
}

export default Mainpage*/
}
export default Mainpage*/
}

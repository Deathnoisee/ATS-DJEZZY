import { Link } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  return (
    <section className="signup-page">
      <div className="Home">
        <h1>Djezzy CV Match</h1>

        <Link to="/login">
          <button>Login</button>
        </Link>

        <Link to="/signup">
          <button>Sign Up</button>
        </Link>
        <div className="rh-button">
          <Link to="/rh/create_job">
            <button>Create Job</button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Home;
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

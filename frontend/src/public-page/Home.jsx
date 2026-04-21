import "../styles/public-page.css";
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

        <Link to="/adlane">
          <button>Adlane</button>
        </Link>
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

function Mainpage({ onGoCandidate, onGoSignup }) {
  return (
    <div className="public-page">
      <div className="hero">
        <span className="hero-label">AI recruitment platform</span>

        <h1 className="hero-title">
          Welcome candidates with a clean public page before the dashboard.
        </h1>

        <p className="hero-text">
          Start with a polished landing page, guide users into sign up or login,
          then connect that flow to the candidate area when you are ready.
        </p>

        <div className="hero-actions">
          <button className="btn btn-primary" onClick={onGoSignup}>
            Create account
          </button>

          <button className="btn btn-secondary" onClick={onGoCandidate}>
            I already have an account
          </button>
        </div>
      </div>
    </div>
  );
}

export default Mainpage;
export default Mainpage*/
}

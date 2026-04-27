import "../styles/public-page.css";

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
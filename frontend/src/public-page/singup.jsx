import '../styles/singup.css'

function Singup({ onSuccess, onSwitchToLogin, onBack }) {
  const handleSubmit = (event) => {
    event.preventDefault()
    onSuccess()
  }

  return (
    <section className="auth-card">
      <div className="signup-logo">
        <div className="signup-logo-image">TB</div>
      </div>

      <button type="button" className="back-link" onClick={onBack}>
        Back to home
      </button>

      <p className="feature-kicker">Sign up</p>
      <h2>Create your account</h2>
      <p className="auth-text">
        New candidates can register here, then move into the login flow.
      </p>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Full name
          <input type="text" placeholder="Enter your full name" required />
        </label>

        <label>
          Email address
          <input type="email" placeholder="name@example.com" required />
        </label>

        <label>
          Password
          <input type="password" placeholder="Create a password" required />
        </label>

        <button type="submit" className="primary-button full-width">
          Create account
        </button>
      </form>

      <p className="auth-footer">
        Already have an account?
        <button type="button" className="inline-link" onClick={onSwitchToLogin}>
          Login
        </button>
      </p>
    </section>
  )
}

export default Singup

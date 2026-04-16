import '../styles/login.css'

function Login({ onSuccess, onSwitchToSignup, onBack }) {
  const handleSubmit = (event) => {
    event.preventDefault()
    onSuccess()
  }

  return (
    <section className="auth-card">
      <button type="button" className="back-link" onClick={onBack}>
        Back to home
      </button>

      <p className="feature-kicker">Login</p>
      <h2>Welcome back</h2>
      <p className="auth-text">
        Log in to continue to your candidate space once that page is connected.
      </p>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Email address
          <input type="email" placeholder="name@example.com" required />
        </label>

        <label>
          Password
          <input type="password" placeholder="Enter your password" required />
        </label>

        <button type="submit" className="primary-button full-width">
          Login
        </button>
      </form>

      <p className="auth-footer">
        Don&apos;t have an account?
        <button type="button" className="inline-link" onClick={onSwitchToSignup}>
          Sign up
        </button>
      </p>
    </section>
  )
}

export default Login

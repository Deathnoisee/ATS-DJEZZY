import { useState } from "react";
import "../styles/style_signup.css";
import logo from "../assets/Logo_Djezzy_2015.png";


function Signup() {
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    phone: "",
    email: "",
    password: "",
    confirm: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};
    if (form.firstname.trim().length < 2) {
      newErrors.firstname = true;
    }

    if (form.lastname.trim().length < 2) {
      newErrors.lastname = true;
    }

    if (!/^[0-9]{8,15}$/.test(form.phone)) {
      newErrors.phone = true;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = true;
    }

    if (form.password.length < 8 || form.password.length > 16) {
      newErrors.password = true;
    }

    if (form.password !== form.confirm) {
      newErrors.confirm = true;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      alert("Account created successfully!");
    }
  };

  return (
    <div className="signup-page">
      <a className="logo" href="#">
        <div className="logo-icon">
          <img src={logo} alt="djezzy" />
        </div>
        <span className="logo-text">Djezzy CV</span>
      </a>
      

      <div className="card">
        <h1 className="card-title">Create account</h1>
        <p className="card-sub">Sign up to get started with Djezzy CV</p>

        <form className="form" onSubmit={handleSubmit}>
          <div className="name-row">
            <div
              className={`input-group ${errors.firstname ? "has-error" : ""}`}
            >
              <label>First name</label>
              <input
                type="text"
                id="firstname"
                placeholder="First name"
                onChange={handleChange}
              />
              <span className="error-msg">Enter first name.</span>
            </div>

            <div
              className={`input-group ${errors.lastname ? "has-error" : ""}`}
            >
              <label>Last name</label>
              <input
                type="text"
                id="lastname"
                placeholder="Last name"
                onChange={handleChange}
              />
              <span className="error-msg">Enter last name.</span>
            </div>
          </div>

          

          <div className={`input-group ${errors.phone ? "has-error" : ""}`}>
            <label>Phone number</label>
            <input
              type="tel"
              id="phone"
              placeholder="Your phone number"
              onChange={handleChange}
            />
            <span className="error-msg">
              Please enter a valid phone number.
            </span>
          </div>

          <div className={`input-group ${errors.email ? "has-error" : ""}`}>
            <label>Email address</label>
            <input
              type="email"
              id="email"
              placeholder="example@email.com"
              onChange={handleChange}
            />
            <span className="error-msg">
              Please enter a valid email address.
            </span>
          </div>

          <div className={`input-group ${errors.password ? "has-error" : ""}`}>
            <label>Password</label>
            <input
              type="password"
              id="password"
              placeholder="Password 8–16 characters"
              onChange={handleChange}
            />
            <span className="hint">Must be 8–16 characters long.</span>
            <span className="error-msg">Password must be 8–16 characters.</span>
          </div>

          <div className={`input-group ${errors.confirm ? "has-error" : ""}`}>
            <label>Confirm password</label>
            <input
              type="password"
              id="confirm"
              placeholder="Repeat your password"
              onChange={handleChange}
            />
            <span className="error-msg">Passwords do not match.</span>
          </div>

          <button type="submit" className="btn-signup">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;

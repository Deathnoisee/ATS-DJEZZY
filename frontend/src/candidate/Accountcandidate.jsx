import React, { useState } from "react";
import "../styles/rh/accountrh.css";

function Accountcandidate() {
  const [theme, setTheme] = useState("dark");
  const toggleTheme = () => setTheme((current) => (current === "dark" ? "light" : "dark"));

  return (
    <section className={`account-rh ${theme}-theme`}>
      <header className="account-header">
        <div className={`welcome-content ${theme}-theme`}>
          <p>Welcome, candidate! Your account panel will appear here.</p>
        </div>

        <div className="search-wrapper">
          <input className="seach" id="search-label" type="text" placeholder="Search..." />
        </div>

        <label className="switch">
          <input
            type="checkbox"
            className="input__check"
            checked={theme === "dark"}
            onChange={toggleTheme}
          />
          <span className="slider"></span>
        </label>
      </header>

      <div className="account-actions">
        <button className="create-job-btn">Update Profile</button>
      </div>
    </section>
  );
}

export default Accountcandidate;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/rh/accountrh.css";

function Accountrh() {
  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };
  const [theme, setTheme] = useState("dark");
  return (
    <section className={`account-rh ${theme}-theme`}>
      <header className="account-header">
        <div className={`welcome-content ${theme}-theme`}>
          <p>Welcome, recruiter! Your account will appear here.</p>
        
        </div>

        <div className="search-wrapper">
          <input
            className="seach"
            id="seach label"
            type="text"
            placeholder="Search..."
          />
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
            <Link to="/rh/create_job">
              <button className="create-account">Créer un job RH</button>
            </Link>
          </div>
    </section>
  );
}

export default Accountrh;

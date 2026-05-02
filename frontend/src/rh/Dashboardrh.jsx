import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/rh/dashboardrh.css";

function Dashboardrh() {
  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };
  const [theme, setTheme] = useState("dark");
  return (
    <section className={`dashboard-rh ${theme}-theme`}>
      <header className="dashboard-header">
        <div className={`welcome-content ${theme}-theme`}>
        <p>Welcome, recruiter! Your dashboard will appear here.</p>
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
    </section>
  );
}

export default Dashboardrh;

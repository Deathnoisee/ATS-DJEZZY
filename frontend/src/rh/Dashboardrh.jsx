import React, { useState } from "react";
import "../styles/rh/dashboardrh.css";

function Dashboardrh() {
  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };
  const [theme, setTheme] = useState("dark");
  return (
    <section className={`dashboard-rh ${theme}-theme`}>
      <header className="dashboard-header">
      </header>
      <div className={`welcome-content ${theme}-theme`}>
        <p>Welcome, recruiter! Your dashboard will appear here.</p>
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
       
    </section>
  );
}

export default Dashboardrh;

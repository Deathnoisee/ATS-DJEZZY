import React, { useState } from "react";
import "../styles/dashboardrh.css";

function Dashboardrh() {
  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };
  const [theme, setTheme] = useState("dark");
  return (
    <section className={`dashboard-rh ${theme}-theme`}>
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
      {/* Stats Row 
          <div className="grid grid-cols-4 gap-5 mb-8">
            <StatCard label="Total Jobs" value="14" change={12} icon={Briefcase} accent />
            <StatCard label="Total CVs" value="248" change={34} icon={FileText} />
            <StatCard label="Candidates Screened" value="186" change={18} icon={Users} />
            <StatCard label="Avg. Match Score" value="81%" change={5} icon={TrendingUp} />
          </div>*/}
    </section>
  );
}

export default Dashboardrh;

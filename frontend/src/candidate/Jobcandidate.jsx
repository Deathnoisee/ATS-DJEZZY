import React, { useState } from "react";
import "../styles/rh/jobrh.css";

function Jobcandidate() {
  const [theme, setTheme] = useState("dark");
  const toggleTheme = () => setTheme((current) => (current === "dark" ? "light" : "dark"));

  const jobs = [
    {
      id: 1,
      title: "Frontend Developer",
      description: "Build responsive web apps with React and modern UI.",
      location: "Remote",
      department: "Engineering",
    },
    {
      id: 2,
      title: "Product Designer",
      description: "Design user experiences and interfaces for digital products.",
      location: "Paris, France",
      department: "Design",
    },
    {
      id: 3,
      title: "Data Analyst",
      description: "Analyze data and generate insights for hiring decisions.",
      location: "Berlin, Germany",
      department: "Analytics",
    },
  ];

  return (
    <section className={`job-rh ${theme}-theme`}>
      <header className="job-header">
        <div className={`welcome-contentjob ${theme}-theme`}>
          <p>Welcome, candidate! Browse jobs that match your skills.</p>
        </div>

        <div className="search-wrapper">
          <input className="seach" id="search-label" type="text" placeholder="Search..." />
        </div>

        <label className="switch">
          <input type="checkbox" className="input__check" checked={theme === "dark"} onChange={toggleTheme} />
          <span className="slider"></span>
        </label>
      </header>

      <div className="job-list">
        {jobs.map((job) => (
          <div key={job.id} className="job-card">
            <div className="job-card-content">
              <h3>{job.title}</h3>
              <p>{job.description}</p>
              <p className="job-meta">{job.location} • {job.department}</p>
            </div>
            <div className="job-card-actions">
              <button type="button" className="delete-job-btn">Apply</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Jobcandidate;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/rh/jobrh.css";
function Jobrh() {
  const CreateIcon = () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );
  const UpdateIcon = () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
  );
  const [theme, setTheme] = useState("dark");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("/hr/jobs/");
        if (!response.ok) throw new Error("Failed to load jobs");
        const data = await response.json();
        setJobs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <section className={`job-rh ${theme}-theme`}>
      <header className="job-header">
        <div className={`welcome-contentjob ${theme}-theme`}>
          <p>Welcome, recruiter! Your job will appear here.</p>
        </div>

        <div className="search-wrapper">
          <input
            className="seach"
            id="search-label"
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
      <div className="btnjob">
        <Link to="/rh/create_job">
          <button className="creatjob">
            <CreateIcon />
            <span>Create Job</span>
          </button>
        </Link>
        <Link to="/rh/update_job">
          <button className="updatejob">
            <UpdateIcon />
            <label>update Job</label>
          </button>
        </Link>
      </div>
      <div className="job-list">
        {loading && <p>Loading jobs...</p>}
        {error && <p className="job-error">{error}</p>}
        {!loading && !error && jobs.length === 0 && <p>No jobs found.</p>}

        {jobs.map((job) => (
          <Link
            key={job.uuid}
            to={`/rh/update_job/${job.uuid}`}
            className="job-card-link"
          >
            <div className="job-card">
              <h3>{job.title}</h3>
              <p>{job.job_description}</p>
              <p className="job-meta">
                {job.location} • {job.job_department}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default Jobrh;

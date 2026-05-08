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
  const [topApplications, setTopApplications] = useState([]);
  const [topJobUuid, setTopJobUuid] = useState(null);
  const [topLoading, setTopLoading] = useState(false);
  const [topError, setTopError] = useState(null);

  const formatScore = (score) => {
    if (score === null || score === undefined) return "N/A";
    const numeric = Number(score);
    if (Number.isNaN(numeric)) return "N/A";
    return (numeric * 100).toFixed(2);
  };

  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  const handleDelete = async (jobUuid) => {
    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer cette offre ?",
    );
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("You must be logged in to delete a job.");
        return;
      }
      const response = await fetch(`/hr/jobs/${jobUuid}/delete/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error("Impossible de supprimer le job");
      }
      setJobs((prevJobs) => prevJobs.filter((job) => job.uuid !== jobUuid));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFetchTopApplications = async (jobUuid) => {
    setTopLoading(true);
    setTopError(null);
    setTopJobUuid(jobUuid);

    const token = localStorage.getItem("access_token");
    try {
      const response = await fetch(
        `/candidate/application/hr/${jobUuid}/top/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!response.ok) {
        const errorText = await response
          .text()
          .catch(() => response.statusText);
        throw new Error(errorText || "Failed to load top applicants");
      }
      const data = await response.json();
      setTopApplications(data || []);
    } catch (err) {
      setTopApplications([]);
      setTopError(err.message || "Failed to load top applicants");
    } finally {
      setTopLoading(false);
    }
  };

  const handleDownloadResume = (resumeUrl) => {
    if (!resumeUrl) {
      setTopError("Resume not available for this candidate.");
      return;
    }
    window.open(resumeUrl, '_blank', 'noopener,noreferrer');
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
            <span>Create Job</span>
          </button>
        </Link>
      </div>
      <div className="job-list">
        {loading && <p>Loading jobs...</p>}
        {error && <p className="job-error">{error}</p>}
        {!loading && !error && jobs.length === 0 && <p>No jobs found.</p>}

        {jobs.map((job) => (
          <div key={job.uuid} className="job-card">
            <Link to={`/rh/update_job/${job.uuid}`} className="job-card-link">
              <div className="job-card-content">
                <h3>{job.title}</h3>
                <p>{job.job_description}</p>
                <p className="job-meta">
                  {job.location} • {job.job_department}
                </p>
              </div>
            </Link>
            <div className="job-card-actions">
              <button
                type="button"
                className="delete-job-btn"
                onClick={() => handleDelete(job.uuid)}
              >
                Supprimer
              </button>
              <button
                type="button"
                className="top-applicants-btn"
                onClick={() => handleFetchTopApplications(job.uuid)}
              >
                Top Applicants
              </button>
            </div>
            {topJobUuid === job.uuid && (
              <div className="top-applicants-panel">
                {topLoading ? (
                  <p>Loading top applicants...</p>
                ) : topError ? (
                  <p className="job-error">{topError}</p>
                ) : (
                  <>
                    <h4>Top Applicants</h4>
                    {topApplications.length === 0 ? (
                      <p>No applicants found yet.</p>
                    ) : (
                      <ol className="top-applicants-list">
                        {topApplications.map((app) => (
                          <li key={app.uuid}>
                            <div className="top-applicant-row">
                              <span className="applicant-email">
                                {app.user || app.user_email || "Unknown candidate"}
                              </span>
                              <span className="applicant-score">
                                Score: {formatScore(app.final_score ?? app.macro_score ?? app.micro_score)}
                              </span>
                            </div>
                            <div className="top-applicant-actions">
                              {app.resume_file ? (
                                <button
                                  type="button"
                                  className="download-cv-btn"
                                  onClick={() => handleDownloadResume(app.resume_file)}
                                >
                                  Download CV
                                </button>
                              ) : (
                                <span className="no-cv">CV not available</span>
                              )}
                            </div>
                          </li>
                        ))}
                      </ol>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default Jobrh;

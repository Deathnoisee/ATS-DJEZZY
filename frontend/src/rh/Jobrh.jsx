import React, { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import Switch from "../switch/Switch";
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
  const { theme, toggleTheme } = useOutletContext();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [topApplications, setTopApplications] = useState([]);
  const [topJobUuid, setTopJobUuid] = useState(null);
  const [topLoading, setTopLoading] = useState(false);
  const [topError, setTopError] = useState(null);
  const [applicationMode, setApplicationMode] = useState("top");
  const [allApplicantsOpen, setAllApplicantsOpen] = useState(false);

  const formatScore = (score) => {
    if (score === null || score === undefined) return "N/A";
    const numeric = Number(score);
    if (Number.isNaN(numeric)) return "N/A";
    return (numeric * 100).toFixed(2);
  };

  const renderJobDescription = (description) => {
    if (!description) return null;
    const lines = description
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    const bulletLines = lines.filter((line) => /^[-*]\s+/.test(line));
    if (bulletLines.length > 0) {
      return (
        <div className="job-description-list">
          <div className="job-description-title">Required Skills</div>
          <ul>
            {bulletLines.map((line, index) => (
              <li key={index}>{line.replace(/^[-*]\s+/, "")}</li>
            ))}
          </ul>
        </div>
      );
    }

    if (lines.length > 1) {
      return (
        <div className="job-description-list">
          <div className="job-description-title">Job Description</div>
          <ul>
            {lines.map((line, index) => (
              <li key={index}>{line}</li>
            ))}
          </ul>
        </div>
      );
    }

    return <p>{description}</p>;
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

  const handleFetchApplications = async (jobUuid, mode = "top") => {
    setTopLoading(true);
    setTopError(null);
    setTopJobUuid(jobUuid);
    setApplicationMode(mode);

    const token = localStorage.getItem("access_token");
    try {
      const endpoint =
        mode === "top"
          ? `/candidate/application/hr/${jobUuid}/top/`
          : `/candidate/application/hr/${jobUuid}/`;
      const response = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const errorText = await response
          .text()
          .catch(() => response.statusText);
        throw new Error(
          errorText ||
            `Failed to load ${mode === "top" ? "top" : "all"} applicants`,
        );
      }
      const data = await response.json();
      setTopApplications(data || []);
    } catch (err) {
      setTopApplications([]);
      setTopError(
        err.message ||
          `Failed to load ${mode === "top" ? "top" : "all"} applicants`,
      );
    } finally {
      setTopLoading(false);
    }
  };

  const handleShowAllApplicants = async (jobUuid) => {
    setAllApplicantsOpen(true);
    await handleFetchApplications(jobUuid, "all");
  };

  const handleDownloadResume = (resumeUrl) => {
    if (!resumeUrl) {
      setTopError("Resume not available for this applicant.");
      return;
    }
    window.open(resumeUrl, "_blank", "noopener,noreferrer");
  };

  const filteredJobs = jobs.filter((job) => {
    const query = searchTerm.toLowerCase().trim();
    if (!query) return true;
    return (
      job.title?.toLowerCase().includes(query) ||
      job.job_description?.toLowerCase().includes(query)
    );
  });

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
            className="search"
            id="search-label"
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Switch
          className="job-rh-switch"
          checked={theme === "dark"}
          onChange={toggleTheme}
        />
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

        {filteredJobs.map((job) => (
          <div key={job.uuid} className="job-card">
            <Link to={`/rh/update_job/${job.uuid}`} className="job-card-link">
              <div className="job-card-content">
                <h3>{job.title}</h3>
                {renderJobDescription(job.job_description)}
                {/*<p className="job-meta">
                  {job.location} • {job.job_department}
                </p>*/}
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
                onClick={() => handleFetchApplications(job.uuid, "top")}
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
                    <h4>
                      {applicationMode === "top"
                        ? "Top Applicants"
                        : "All Applicants"}
                    </h4>
                    {topApplications.length === 0 ? (
                      <p>No applicants found yet.</p>
                    ) : (
                      <ol className="top-applicants-list">
                        {topApplications.map((app) => (
                          <li key={app.uuid}>
                            <div className="top-applicant-row">
                              <Link
                                to={`/rh/candidate-skills/${app.user_uuid}`}
                                className="applicant-email candidate-skills-link"
                              >
                                {app.user || app.user_email || "Unknown candidate"}
                              </Link>
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
                                <span className="no-cv">CV unavailable</span>
                              )}
                            </div>
                          </li>
                        ))}
                      </ol>
                    )}
                    <div className="top-applicant-actions">
                      <button
                        type="button"
                        className="top-applicants-btn all-applicants-btn"
                        onClick={() => handleShowAllApplicants(job.uuid)}
                      >
                        Show All Applicants
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {allApplicantsOpen && topJobUuid && applicationMode === "all" && (
        <div
          className="applicants-modal-overlay"
          onClick={() => setAllApplicantsOpen(false)}
        >
          <div
            className="applicants-modal"
            role="dialog"
            aria-modal="true"
            aria-label="All applicants"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="applicants-modal-header">
              <h4>All Applicants</h4>
              <button
                type="button"
                className="applicants-modal-close"
                onClick={() => setAllApplicantsOpen(false)}
              >
                ×
              </button>
            </div>
            {topLoading ? (
              <p>Loading applicants...</p>
            ) : topError ? (
              <p className="job-error">{topError}</p>
            ) : topApplications.length === 0 ? (
              <p>No applicants found yet.</p>
            ) : (
              <ol className="top-applicants-list">
                {topApplications.map((app) => (
                  <li key={app.uuid}>
                    <div className="top-applicant-row">
                      <Link
                        to={`/rh/candidate-skills/${app.user_uuid}`}
                        className="applicant-email candidate-skills-link"
                      >
                        {app.user || app.user_email || "Unknown candidate"}
                      </Link>
                      <span className="applicant-score">
                        Score: {formatScore(app.final_score ?? app.macro_score ?? app.micro_score)}
                      </span>
                    </div>
                    {applicationMode === "all" && (
                      <div className="applicant-score-details">
                        <span>
                          Macro: {formatScore(app.macro_score)}
                        </span>
                        <span>
                          Micro: {formatScore(app.micro_score)}
                        </span>
                      </div>
                    )}
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
                        <span className="no-cv">CV unavailable</span>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default Jobrh;

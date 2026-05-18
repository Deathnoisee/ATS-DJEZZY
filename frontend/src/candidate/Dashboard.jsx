import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import "../styles/rh/dashboardrh.css";
import "../styles/candidate/dashboardcandidate.css";
import "../styles/candidate/cvcandidate.css";

function Dashboard() {
  const { theme, toggleTheme } = useOutletContext();
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [filterMode, setFilterMode] = useState("all");
  const [appliedJobIds, setAppliedJobIds] = useState([]);
 {/* const statsvg = [
    icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect
            x="4"
            y="5"
            width="16"
            height="14"
            rx="2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M8 3v4M16 3v4M4 10h16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M8 14h3M8 17h6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      )
  ];*/}
  const stats = [
    { label: "Saved Jobs", value: 12, icon: " Saved Jobs" },
    { label: "Applied", value: 5, icon: " Applications" },
    { label: "Interviews", value: 3, icon: " Interview Slots" },
    { label: "Matches", value: 8, icon: " Job Matches" },
  ];

  const getAccessToken = () => localStorage.getItem("access_token")?.trim();
  useEffect(() => {
    const fetchJobData = async () => {
      const jobsResponse = await fetch("/hr/jobs/");
      const jobsData = await jobsResponse.json().catch(() => null);
      if (!jobsResponse.ok) {
        const message =
          jobsData?.detail ||
          jobsData?.message ||
          jobsData?.error ||
          jobsResponse.statusText ||
          "Unable to fetch jobs.";
        throw new Error(message);
      }
      return Array.isArray(jobsData) ? jobsData : [];
    };

    const fetchAppliedJobs = async () => {
      const token = getAccessToken();
      if (!token) return [];
      const response = await fetch("/candidate/application/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) return [];
      const data = await response.json().catch(() => []);
      return Array.isArray(data) ? data : [];
    };

    const loadData = async () => {
      try {
        const [jobsData, applicationsData] = await Promise.all([
          fetchJobData(),
          fetchAppliedJobs(),
        ]);

        setJobs(jobsData);
        setAppliedJobIds(
          applicationsData
            .map((application) => application.job)
            .filter(Boolean),
        );
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load jobs.");
        setJobs([]);
        setAppliedJobIds([]);
      }
    };

    loadData();
  }, []);

  const getResponseErrorMessage = async (response) => {
    const text = await response.text().catch(() => "");
    if (!text) return response.statusText || `HTTP ${response.status}`;
    try {
      const data = JSON.parse(text);
      return (
        data?.detail ||
        data?.message ||
        data?.error ||
        Object.values(data || {})[0] ||
        text
      );
    } catch {
      return text;
    }
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

  const filteredJobs = jobs.filter((job) => {
    if (filterMode === "applied") {
      return appliedJobIds.includes(job.uuid);
    }
    if (filterMode === "not_applied") {
      return !appliedJobIds.includes(job.uuid);
    }
    return true;
  });

  const handleApply = async () => {
    const token = getAccessToken();
    if (!token) {
      setStatus("You must be logged in to apply.");
      return;
    }
    if (!selectedJob) {
      setStatus("Select a job before applying.");
      return;
    }

    setStatus("Applying for the job...");

    try {
      const applicationRes = await fetch("/candidate/application/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          job: selectedJob.uuid,
        }),
      });

      if (!applicationRes.ok) {
        const message = await getResponseErrorMessage(applicationRes);
        if (applicationRes.status === 401) {
          setStatus(
            "Application failed: session expired or invalid token. Please log in again.",
          );
          return;
        }
        setStatus(`Application failed: ${message}`);
        return;
      }

      setStatus("Application sent successfully!");
      setAppliedJobIds((prevIds) =>
        prevIds.includes(selectedJob.uuid)
          ? prevIds
          : [...prevIds, selectedJob.uuid],
      );
      setSelectedJob(null);
    } catch (err) {
      setStatus(err.message || "Application failed.");
      console.error(err);
    }
  };

  return (
    <section className={`candidate-cv-page ${theme}-theme`}>
      <header className="candidate-header">
        <div className="candidate-header-copy">
          <span className="candidate-eyebrow">Candidate workspace</span>
          <h1>Browse jobs and manage your applications</h1>
          <p>
            Track openings, choose a job, and apply from a dashboard that keeps
            the same candidate-first look as your CV page.
          </p>
        </div>

        <div className="candidate-header-actions">
          <div className="candidate-status-pill">Private candidate profile</div>

          <label className="switch" aria-label="Toggle theme">
            <input
              type="checkbox"
              className="input__check"
              checked={theme === "dark"}
              onChange={toggleTheme}
            />
            <span className="slider"></span>
          </label>
        </div>
      </header>

      <div className="dashboardcandidate-cards">
        {stats.map((stat) => (
          <div key={stat.label} className="dashboardcandidate-card">
            <div className="card-icon">{stat.icon}</div>
            <div className="card-info">
              <span className="card-value">{stat.value}</span>
              <span className="card-label">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="candidate-filter-buttons">
        <button
          type="button"
          className={filterMode === "all" ? "active" : ""}
          onClick={() => setFilterMode("all")}
        >
          All
        </button>
        <button
          type="button"
          className={filterMode === "applied" ? "active" : ""}
          onClick={() => setFilterMode("applied")}
        >
          Applied
        </button>
        <button
          type="button"
          className={filterMode === "not_applied" ? "active" : ""}
          onClick={() => setFilterMode("not_applied")}
        >
          Not Applied
        </button>
      </div>

      <div className="job-list">
        {error && <p className="job-error">{error}</p>}
        {jobs.length === 0 && !error && <p>No jobs available.</p>}
        {filteredJobs.length === 0 && jobs.length > 0 && !error && (
          <p>No jobs match this filter.</p>
        )}
        {filteredJobs.map((job) => (
          <div
            key={job.uuid}
            className="job-card"
            onClick={() => setSelectedJob(job)}
          >
            <h3>{job.title}</h3>
            {renderJobDescription(job.job_description)}
           {/*<p>
              {job.location} • {job.job_department}
            </p>*/}
          </div>
        ))}
      </div>

      {selectedJob && (
        <div className="upload-panel">
          <h2>Apply to: {selectedJob.title}</h2>
          <button onClick={handleApply}>Apply for job</button>
          <p>{status}</p>
        </div>
      )}
    </section>
  );
}

export default Dashboard;

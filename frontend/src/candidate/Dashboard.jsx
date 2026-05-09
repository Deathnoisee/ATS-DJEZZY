import React, { useEffect, useState } from "react";
import "../styles/rh/dashboardrh.css";
import "../styles/candidate/dashboardcandidate.css";
import "../styles/candidate/cvcandidate.css";

function Dashboard() {
  const [theme, setTheme] = useState("dark");
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
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

  const toggleTheme = () =>
    setTheme((current) => (current === "dark" ? "light" : "dark"));

  const getAccessToken = () => localStorage.getItem("access_token")?.trim();
  useEffect(() => {
    fetch("/hr/jobs/")
      .then(async (res) => {
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          const message =
            data?.detail ||
            data?.message ||
            data?.error ||
            res.statusText ||
            "Unable to fetch jobs.";
          throw new Error(message);
        }
        return data;
      })
      .then((data) => {
        setJobs(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || "Failed to load jobs.");
        setJobs([]);
      });
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

      <div className="dashboard-cards">
        {stats.map((stat) => (
          <div key={stat.label} className="dashboard-card">
            <div className="card-icon">{stat.icon}</div>
            <div className="card-info">
              <span className="card-value">{stat.value}</span>
              <span className="card-label">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="job-list">
        {error && <p className="job-error">{error}</p>}
        {jobs.length === 0 && !error && <p>No jobs available.</p>}
        {jobs.map((job) => (
          <div
            key={job.uuid}
            className="job-card"
            onClick={() => setSelectedJob(job)}
          >
            <h3>{job.title}</h3>
            <p>{job.job_description}</p>
            <p>
              {job.location} • {job.job_department}
            </p>
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

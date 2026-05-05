import React, { useEffect, useState } from "react";
import "../styles/rh/dashboardrh.css";
import "../styles/candidate/dashboardcandidate.css";

function Dashboard() {
  const [theme, setTheme] = useState("dark");
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const stats = [
    { label: "Saved Jobs", value: 12, icon: "💾 Saved Jobs" },
    { label: "Applied", value: 5, icon: "📄 Applications" },
    { label: "Interviews", value: 3, icon: "🗓️ Interview Slots" },
    { label: "Matches", value: 8, icon: "⭐ Job Matches" },
  ];

  const toggleTheme = () => setTheme((current) => (current === "dark" ? "light" : "dark"));

  const getAccessToken = () => localStorage.getItem("access_token")?.trim();
  const getRefreshToken = () => localStorage.getItem("refresh_token")?.trim();

  const refreshAccessToken = async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return null;

    const response = await fetch("/auth/jwt/refresh/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) return null;
    const data = await response.json().catch(() => null);
    if (data?.access) {
      localStorage.setItem("access_token", data.access);
      return data.access;
    }
    return null;
  };

  const fetchWithAuth = async (url, options = {}) => {
    let token = getAccessToken();
    if (!token) throw new Error("No access token found. Please log in again.");

    const headers = {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    };

    let response = await fetch(url, { ...options, headers });
    if (response.status === 401) {
      const newToken = await refreshAccessToken();
      if (!newToken) return response;
      response = await fetch(url, {
        ...options,
        headers: { ...(options.headers || {}), Authorization: `Bearer ${newToken}` },
      });
    }
    return response;
  };

  useEffect(() => {
    fetch("/hr/jobs/")
      .then(async (res) => {
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          const message =
            data?.detail || data?.message || data?.error || res.statusText ||
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

  const handleFileChange = (event) => {
    setResumeFile(event.target.files[0]);
  };

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

  const handleUpload = async () => {
    if (!selectedJob || !resumeFile) {
      setStatus("Select a job and choose a CV file first.");
      return;
    }

    const token = localStorage.getItem("access_token");
    if (!token) {
      setStatus("You must be logged in to upload a CV.");
      return;
    }

    setStatus("Uploading CV...");

    try {
      const formData = new FormData();
      formData.append("resume_file", resumeFile);

      const resumeRes = await fetchWithAuth("/candidate/candidate_resume/create/", {
        method: "POST",
        body: formData,
      });

      if (!resumeRes.ok) {
        const message = await getResponseErrorMessage(resumeRes);
        if (resumeRes.status === 401) {
          setStatus("Resume upload failed: session expired or invalid token. Please log in again.");
          return;
        }
        setStatus(`Resume upload failed: ${message}`);
        return;
      }

      const applicationRes = await fetchWithAuth("/candidate/application/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          job: selectedJob.uuid,
        }),
      });

      if (!applicationRes.ok) {
        const message = await getResponseErrorMessage(applicationRes);
        if (applicationRes.status === 401) {
          setStatus("Application failed: session expired or invalid token. Please log in again.");
          return;
        }
        setStatus(`Application failed: ${message}`);
        return;
      }

      setStatus("CV uploaded and application sent!");
      setSelectedJob(null);
      setResumeFile(null);
    } catch (err) {
      setStatus(err.message || "Upload failed.");
      console.error(err);
    }
  };

  return (
    <section className={`dashboard-rh ${theme}-theme`}>
      <header className="dashboard-header">
        <div className={`welcome-content ${theme}-theme`}>
          <p>Welcome, candidate! Your dashboard will appear here.</p>
        </div>

        <div className="search-wrapper">
          <input className="seach" id="search-label" type="text" placeholder="Search..." />
        </div>

        <label className="switch">
          <input type="checkbox" className="input__check" checked={theme === "dark"} onChange={toggleTheme} />
          <span className="slider"></span>
        </label>
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
            <p>{job.location} • {job.job_department}</p>
          </div>
        ))}
      </div>

      {selectedJob && (
        <div className="upload-panel">
          <h2>Apply to: {selectedJob.title}</h2>
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleUpload}>Upload CV</button>
          <p>{status}</p>
        </div>
      )}
    </section>
  );
}

export default Dashboard;

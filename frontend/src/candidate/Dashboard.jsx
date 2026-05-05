import React, { useEffect, useState } from "react";
import "../styles/rh/dashboardrh.css";
import "../styles/candidate/dashboardcandidate.css";

function CandidateDashboard() {
  const [theme, setTheme] = useState("dark");
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [status, setStatus] = useState("");

  const stats = [
    { label: "Saved Jobs", value: 12, icon: "💾 Saved Jobs" },
    { label: "Applied", value: 5, icon: "📄 Applications" },
    { label: "Interviews", value: 3, icon: "🗓️ Interview Slots" },
    { label: "Matches", value: 8, icon: "⭐ Job Matches" },
  ];

  const toggleTheme = () => setTheme((current) => (current === "dark" ? "light" : "dark"));

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    fetch("/hr/jobs/", { headers })
      .then((res) => res.json())
      .then(setJobs)
      .catch((err) => console.error(err));
  }, []);

  const handleFileChange = (event) => {
    setResumeFile(event.target.files[0]);
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

      const resumeRes = await fetch("/candidate/candidate_resume/create/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const resumeData = await resumeRes.json().catch(() => null);
      if (!resumeRes.ok) {
        const message = resumeData?.resume || resumeData?.detail || "Resume upload failed.";
        setStatus(`Resume upload failed: ${message}`);
        return;
      }

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

      const applicationData = await applicationRes.json().catch(() => null);
      if (!applicationRes.ok) {
        const message = applicationData?.detail || Object.values(applicationData || {})[0] || "Application failed.";
        setStatus(`Application failed: ${message}`);
        return;
      }

      setStatus("CV uploaded and application sent!");
      setSelectedJob(null);
      setResumeFile(null);
    } catch (err) {
      setStatus("Upload failed.");
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

export default CandidateDashboard;

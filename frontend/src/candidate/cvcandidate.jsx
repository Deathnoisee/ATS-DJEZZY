import React, { useState } from "react";
import "../styles/rh/jobrh.css";

function cvcandidate() {
  const [theme, setTheme] = useState("dark");
  const [resumeFile, setResumeFile] = useState(null);
  const [status, setStatus] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const toggleTheme = () => setTheme((current) => (current === "dark" ? "light" : "dark"));

  const handleFileChange = (event) => {
    setResumeFile(event.target.files?.[0] || null);
    setStatus("");
  };

  const handleUpload = async () => {
    if (!resumeFile) {
      setStatus("Please choose a CV file before uploading.");
      return;
    }

    const token = localStorage.getItem("access_token");
    if (!token) {
      setStatus("You must be logged in before uploading your CV.");
      return;
    }

    setIsUploading(true);
    setStatus("Uploading your CV...");

    try {
      const formData = new FormData();
      formData.append("resume_file", resumeFile);

      const response = await fetch("/candidate/candidate_resume/create/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        const errorMessage =
          data?.detail || data?.resume || data?.message || Object.values(data || {})[0] || "Upload failed.";
        setStatus(`Upload failed: ${errorMessage}`);
      } else {
        setStatus("CV uploaded successfully!");
        setResumeFile(null);
        document.getElementById("cv-file-input")?.value && (document.getElementById("cv-file-input").value = "");
      }
    } catch (error) {
      setStatus(error.message || "Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className={`job-rh ${theme}-theme`}>
      <header className="job-header">
        <div className={`welcome-contentjob ${theme}-theme`}>
          <p>Welcome, candidate! Upload your CV to apply for jobs.</p>
        </div>

        <div className="search-wrapper">
          <input className="seach" id="search-label" type="text" placeholder="Search..." />
        </div>

        <label className="switch">
          <input type="checkbox" className="input__check" checked={theme === "dark"} onChange={toggleTheme} />
          <span className="slider"></span>
        </label>
      </header>

      <div className="upload-section">
        <div className="upload-card">
          <h2>Upload your CV</h2>
          <p>Select a PDF or DOC file and upload it to your candidate profile.</p>
          <input
            id="cv-file-input"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
          />
          {resumeFile && <p className="file-name">Selected file: {resumeFile.name}</p>}
          <button className="upload-button" onClick={handleUpload} disabled={isUploading}>
            {isUploading ? "Uploading..." : "Upload CV"}
          </button>
          {status && <p className="upload-status">{status}</p>}
        </div>
      </div>
    </section>
  );
}

export default cvcandidate;

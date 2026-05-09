import React, { useState } from "react";
import "../styles/candidate/cvcandidate.css";

function cvcandidate() {
  const [theme, setTheme] = useState("dark");
  const [resumeFile, setResumeFile] = useState(null);
  const [status, setStatus] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const toggleTheme = () =>
    setTheme((current) => (current === "dark" ? "light" : "dark"));

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

    const userRes = await fetch("/auth/users/me/", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!userRes.ok) {
      setStatus("Unable to retrieve user information. Please log in again.");
      return;
    }

    const userData = await userRes.json();
    const useruuid = userData.uuid;
    if (!useruuid) {
      setStatus("Unable to retrieve user information. Please log in again.");
      return;
    }

    setStatus("Uploading your CV...");

    const cvCheckRes = await fetch(`/candidate/candidate_resume/${useruuid}/`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (cvCheckRes.ok) {
      // existing resume found -> delete it
      const deleteCvRes = await fetch(`/candidate/candidate_resume/delete/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!deleteCvRes.ok) {
        setStatus("Unable to delete existing CV. Please try again.");
        return;
      }
    } else if (cvCheckRes.status !== 404) {
      // only fail on error other than "not found"
      setStatus("Unable to check existing CV. Please try again.");
      return;
    }

    setIsUploading(true);
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
          data?.detail ||
          data?.resume ||
          data?.message ||
          Object.values(data || {})[0] ||
          "Upload failed.";
        setStatus(`Upload failed: ${errorMessage}`);
      } else {
        setStatus("CV uploaded successfully!");
        setResumeFile(null);
        const fileInput = document.getElementById("cv-file-input");
        fileInput && (fileInput.value = "");
      }
    } catch (error) {
      setStatus(error.message || "Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className={`candidate-cv-page ${theme}-theme`}>
      <header className="candidate-header">
        <div className="candidate-header-copy">
          <span className="candidate-eyebrow">Candidate workspace</span>
          <h1>Upload and manage your CV</h1>
          <p>
            Keep your application file up to date with a candidate-focused
            profile area.
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

      <div className="upload-section">
        <div className="upload-card">
          <h2>Upload your CV</h2>
          <p>
            Select a PDF or DOC file and upload it to your candidate profile.
          </p>
          <input
            id="cv-file-input"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
          />
          {resumeFile && (
            <p className="file-name">Selected file: {resumeFile.name}</p>
          )}
          <button
            className="upload-button"
            onClick={handleUpload}
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Upload CV"}
          </button>
          {status && <p className="upload-status">{status}</p>}
        </div>
      </div>
    </section>
  );
}

export default cvcandidate;

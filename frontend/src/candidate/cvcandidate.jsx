import React, { useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import Switch from "../switch/Switch";
import "../styles/candidate/cvcandidate.css";

function cvcandidate() {
  const { theme, toggleTheme } = useOutletContext();
  const fileInputRef = useRef(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [status, setStatus] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleFileChange = (event) => {
    setResumeFile(event.target.files?.[0] || null);
    setStatus("");
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragActive(false);

    const droppedFile = event.dataTransfer.files?.[0] || null;
    if (!droppedFile) {
      return;
    }

    setResumeFile(droppedFile);
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
      
      const deleteCvRes = await fetch(`/candidate/candidate_resume/delete/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!deleteCvRes.ok) {
        setStatus("Unable to delete existing CV. Please try again.");
        return;
      }
    } else if (cvCheckRes.status !== 404) {
      
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
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
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

          <Switch
            className="candidate-cv-switch"
            checked={theme === "dark"}
            onChange={toggleTheme}
          />
        </div>
      </header>

      <div className="upload-section">
        <div className="upload-card">
          <span className="upload-card-kicker">Upload your CV</span>
          <h2>Upload your CV</h2>
          <p>
            Select a PDF or DOC file and upload it to your candidate profile.
          </p>
          <label
            className={`dropzone ${isDragActive ? "dropzone-active" : ""} ${
              resumeFile ? "dropzone-has-file" : ""
            }`}
            htmlFor="cv-file-input"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <svg
              className="dropzone-icon"
              viewBox="0 0 64 64"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M20 44H17a11 11 0 1 1 2.1-21.8A15 15 0 0 1 48 26h1a9 9 0 0 1 0 18H36"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M32 20v24m0 0-8-8m8 8 8-8"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <div className="dropzone-copy">
              <strong>Drag & drop your file here</strong>
              <span className="dropzone-or">or</span>
              <span className="dropzone-choose">Choose File</span>
              <small>PDF, DOC, DOCX up to 10MB</small>
            </div>

            <input
              ref={fileInputRef}
              id="cv-file-input"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
            />
          </label>
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

import React, { useEffect, useState } from "react";
import { Link, useParams, useOutletContext } from "react-router-dom";
import "../styles/rh/jobrh.css";

function CandidateSkillsPage() {
  const { theme, toggleTheme } = useOutletContext();
  const { userUuid } = useParams();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(`/candidate/candidate_skills/${userUuid}/`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        if (!response.ok) {
          const text = await response.text().catch(() => response.statusText);
          throw new Error(text || "Failed to load candidate skills");
        }

        const data = await response.json();
        setSkills(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "Failed to load candidate skills");
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, [userUuid]);

  return (
    <section className={`job-rh ${theme}-theme`}>
      <div className="skills-page-shell">
        <div className="skills-page-card">
          <div className="skills-page-header">
            <div className={`welcome-contentjob skills-page-title ${theme}-theme`}>
              <p>Candidate skills</p>
            </div>
            <label className="switch skills-page-switch" aria-label="Toggle theme">
              <input
                type="checkbox"
                className="input__check"
                checked={theme === "dark"}
                onChange={toggleTheme}
              />
              <span className="slider"></span>
            </label>
            <p className="skills-page-subtitle">
              Extracted skills for this candidate profile.
            </p>
          </div>

          <div className="skills-page-body">
            {loading && <p>Loading skills...</p>}
            {error && <p className="job-error">{error}</p>}
            {!loading && !error && skills.length === 0 && <p>No skills found.</p>}

            {!loading && !error && skills.length > 0 && (
              <div className="skills-grid">
                {skills.map((skill) => (
                  <div key={skill.uuid} className="skill-pill-card">
                    <h3>{skill.skill_name}</h3>
                    <p>Experience: {skill.experience}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="skills-page-footer">
            <Link to="/rh/jobs" className="skills-back-link">
              <button className="creatjob skills-back-btn" type="button">
                Back to jobs
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CandidateSkillsPage;
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/rh/dashboardrh.css";

function Dashboardrh() {
  const stats = [
    { label: " Job", value: 14, icon: "📄 Total Jobs" },
    { label: " Applied", value: 58, icon: "✅ Total Applied" },
    { label: " User", value: 624, icon: "👥Total Users" },
    { label: " ", value: 186, icon: "🧪 Candidates Screened" },
  ];
  const graphData = [
    { label: "Jan", users: 100, applied: 20 },
    { label: "Feb", users: 140, applied: 30 },
    { label: "Mar", users: 180, applied: 45 },
    { label: "Apr", users: 220, applied: 55 },
    { label: "May", users: 260, applied: 70 },
  ];

 
  const maxValue = Math.max(
    ...graphData.map((item) => Math.max(item.users, item.applied)),
  );

  const width = 500;
  const height = 220;
  const padding = 40;

  const userPoints = graphData
    .map((item, index) => {
      const x =
        padding + (index * (width - padding * 2)) / (graphData.length - 1);
      const y =
        height - padding - (item.users / maxValue) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");

  const appliedPoints = graphData
    .map((item, index) => {
      const x =
        padding + (index * (width - padding * 2)) / (graphData.length - 1);
      const y =
        height - padding - (item.applied / maxValue) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");

  const points = graphData.flatMap((item, index) => {
    const x =
      padding + (index * (width - padding * 2)) / (graphData.length - 1);
    return [
      {
        label: `${item.label}-users`,
        x,
        y: height - padding - (item.users / maxValue) * (height - padding * 2),
        type: "users",
      },
      {
        label: `${item.label}-applied`,
        x,
        y:
          height - padding - (item.applied / maxValue) * (height - padding * 2),
        type: "applied",
      },
    ];
  });
  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };
  const [theme, setTheme] = useState("dark");
  return (
    <section className={`dashboard-rh ${theme}-theme`}>
      <header className="dashboard-header">
        <div className={`welcome-content ${theme}-theme`}>
          <p>Welcome, recruiter! Your dashboard will appear here.</p>
        </div>

        <div className="search-wrapper">
          <input
            className="seach"
            id="seach label"
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
      <div className="dashboard-graph">
        <div className="graph-title">Users vs Applied</div>

        <svg viewBox="0 0 500 260" className="line-chart">
          <polyline
            className="line users-line"
            points={userPoints}
            fill="none"
            stroke="#4caf50"
            strokeWidth="3"
          />
          <polyline
            className="line applied-line"
            points={appliedPoints}
            fill="none"
            stroke="#ff6b6b"
            strokeWidth="3"
          />
          {points.map((point) => (
            <circle
              key={point.label}
              cx={point.x}
              cy={point.y}
              r="4"
              className={
                point.type === "users" ? "dot users-dot" : "dot applied-dot"
              }
            />
          ))}
        </svg>

        <div className="graph-footer">
          {graphData.map((item) => (
            <div key={item.label} className="graph-footer-item">
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Dashboardrh;

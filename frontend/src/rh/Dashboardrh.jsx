import React from "react";
import { useOutletContext } from "react-router-dom";
import ScatterGraph from "./ScatterGraph";
import "../styles/rh/ScatterGraph.css";


const JobIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 2h9l5 5v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 2v6h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 13h8M8 17h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const AppliedIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 11l3 3L22 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M21 14v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ScreenedIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 3h8l1.5 5H6.5L8 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M17 8h3v9a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V8h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 13v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

function Dashboardrh() {
  const { theme, toggleTheme } = useOutletContext();
  const stats = [
    { label: "Job", value: 14, icon: <><JobIcon /><span className="card-icon-text">Total Jobs</span></> },
    { label: "Applied", value: 58, icon: <><AppliedIcon /><span className="card-icon-text">Total Applied</span></> },
    { label: "User", value: 624, icon: <><UserIcon /><span className="card-icon-text">Total Users</span></> },
    { label: "Candidates Screened", value: 186, icon: <><ScreenedIcon /><span className="card-icon-text">Candidates Screened</span></> },
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
      <div>
        <ScatterGraph />
      </div>
    </section>
  );
}

export default Dashboardrh;

import React, { useEffect, useState } from "react";
import { Link, Outlet, NavLink } from 'react-router-dom';
import '../styles/rh/RHLayout.css';
import logo from '../assets/image/Polygon_.png';

const DashboardIcon = () => (
  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M4 11.5V20h6v-5h4v5h6v-8.5L12 4 4 11.5Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  </svg>
);

const AccountsIcon = () => (
  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M16 11a4 4 0 1 0-8 0 4 4 0 0 0 8 0Z"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path
      d="M4 20c1.6-3.2 4.3-5 8-5s6.4 1.8 8 5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const JobsIcon = () => (
  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M9 6V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M4 8h16v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path
      d="M4 12h16"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const ProfileIcon = () => (
  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 12.2a4.2 4.2 0 1 0 0-8.4 4.2 4.2 0 0 0 0 8.4Z"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path
      d="M4.5 20a7.5 7.5 0 0 1 15 0"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);
function RHLayout() {
  const [theme, setTheme] = useState("dark");
  const [profile, setProfile] = useState(null);
  const toggleTheme = () => setTheme((current) => (current === "dark" ? "light" : "dark"));

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      try {
        const response = await fetch("/auth/users/me/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) return;

        const data = await response.json();
        setProfile(data);
      } catch (error) {
        setProfile(null);
      }
    };

    fetchProfile();
  }, []);

  const accountLabel = profile?.username || "My account";

  return (
    <div className={`rh-layout ${theme}-theme`}>
      <aside className="sidebar">
         <img  className="sidebar-logo"src={logo} alt="sidebarlogo" />
        <nav>
          <NavLink to="/rh" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            <DashboardIcon />
            Dashboard
          </NavLink>
          <NavLink to="/rh/accounts" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            <AccountsIcon />
            Accounts
          </NavLink>
          <NavLink to="/rh/jobs" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            <JobsIcon />
            Jobs
          </NavLink>
          <Link className='logout' to='/rh/profile'>
            <ProfileIcon />
            <span>{accountLabel}</span>
          </Link>
        </nav>
      </aside>
      <main className={`rh-content ${theme}-theme`}>
          <Outlet context={{ theme, toggleTheme, profile, setProfile }} />  {/* Ici s'affichera Dashboard, Accounts ou Jobs */}
      </main>
    </div>
  );
}
export default RHLayout;
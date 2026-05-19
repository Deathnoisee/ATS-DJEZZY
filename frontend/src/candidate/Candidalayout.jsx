import React, { useEffect, useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import Switch from '../switch/Switch';
import '../styles/candidate/candidalayout.css';

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

const UploadIcon = () => (
  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 16V6"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M8.5 9.5 12 6l3.5 3.5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5 18.5h14"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const AccountIcon = () => (
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

function Candidalayout() {
  const [theme, setTheme] = useState('dark');
  const [profile, setProfile] = useState(null);
  const toggleTheme = () => setTheme((current) => (current === 'dark' ? 'light' : 'dark'));

  useEffect(() => {
    const loadProfile = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      try {
        const response = await fetch('/auth/users/me/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) return;

        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error('Unable to load candidate profile:', error);
      }
    };

    loadProfile();
  }, []);

  return (
    <div className={`candidate-layout ${theme}-theme`}>
      <aside className="candidate-sidebar">
        <img className="candidate-sidebar-logo" src={logo} alt="sidebarlogo" />
        <nav className="candidate-sidebar-nav">
          <NavLink to="/candidate" end className={({ isActive }) => isActive ? "candidate-nav-link active" : "candidate-nav-link"}>
            <DashboardIcon />
            Dashboard
          </NavLink>
          <NavLink to="/candidate/jobs" className={({ isActive }) => isActive ? "candidate-nav-link active" : "candidate-nav-link"}>
            <UploadIcon />
            Upload cv
          </NavLink>
          <NavLink
            to="/candidate/account"
            className={({ isActive }) => isActive ? 'candidate-logout active' : 'candidate-logout'}
          >
            <AccountIcon />
            <span>{profile?.username || 'Account'}</span>
          </NavLink>
        </nav>
      </aside>
      <main className={`candidate-content ${theme}-theme`}>
        <Outlet context={{ theme, toggleTheme, profile, setProfile }} />
      </main>
    </div>
  );
}
export default Candidalayout;
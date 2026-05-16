import React, { useState } from 'react';
import { Link, Outlet, NavLink } from 'react-router-dom';
import '../styles/candidate/candidalayout.css';

import logo from '../assets/image/Polygon_.png';
function Candidalayout() {
  const [theme, setTheme] = useState('dark');
  const toggleTheme = () => setTheme((current) => (current === 'dark' ? 'light' : 'dark'));

  return (
    <div className={`candidate-layout ${theme}-theme`}>
      <aside className="candidate-sidebar">
        <img className="candidate-sidebar-logo" src={logo} alt="sidebarlogo" />
        <nav>
          <NavLink to="/candidate" end className={({ isActive }) => isActive ? "candidate-nav-link active" : "candidate-nav-link"}>
            Dashboard
          </NavLink>
          <NavLink to="/candidate/jobs" className={({ isActive }) => isActive ? "candidate-nav-link active" : "candidate-nav-link"}>
            Upload cv
          </NavLink>
          <Link className='candidate-logout' to='/'>logout</Link>
        </nav>
        <div className="candidate-theme-toggle">
          <label className="switch">
            <input
              type="checkbox"
              className="input__check"
              checked={theme === 'dark'}
              onChange={toggleTheme}
            />
            <span className="slider"></span>
          </label>
        </div>
      </aside>
      <main className={`candidate-content ${theme}-theme`}>
        <Outlet context={{ theme, toggleTheme }} />
      </main>
    </div>
  );
}
export default Candidalayout;
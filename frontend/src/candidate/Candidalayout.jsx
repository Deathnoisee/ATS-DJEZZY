import { Link, Outlet, NavLink } from 'react-router-dom';
import '../styles/rh/RHLayout.css';

import logo from '../assets/image/Polygon_.png';
function Candidalayout() {
  return (
    <div className="rh-layout">
      <aside className="sidebar">
        <img className="sidebar-logo" src={logo} alt="sidebarlogo" />
        <nav>
          <NavLink to="/candidate" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Dashboard
          </NavLink>
          <NavLink to="/candidate/accounts" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Accounts
          </NavLink>
          <NavLink to="/candidate/jobs" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Upload cv
          </NavLink>
          <Link className='logout' to='/'>logout</Link>
        </nav>
      </aside>
      <main className="rh-content">
        <Outlet />
      </main>
    </div>
  );
}
export default Candidalayout;
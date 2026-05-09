import { Link, Outlet, NavLink } from 'react-router-dom';
import '../styles/candidate/candidalayout.css';

import logo from '../assets/image/Polygon_.png';
function Candidalayout() {
  return (
    <div className="candidate-layout">
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
      </aside>
      <main className="candidate-content">
        <Outlet />
      </main>
    </div>
  );
}
export default Candidalayout;
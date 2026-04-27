import { Link,Outlet, NavLink } from 'react-router-dom';
import '../styles/rh/RHLayout.css';

function RHLayout() {
  return (
    <div className="rh-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">RH Space</div>
        <nav>
          <NavLink to="/rh" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Dashboard
          </NavLink>
          <NavLink to="/rh/accounts" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Accounts
          </NavLink>
          <NavLink to="/rh/jobs" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Jobs
          </NavLink>
          <Link to='/'>logout</Link>
        </nav>
      </aside>
      <main className="rh-content">
        <Outlet />  {/* Ici s'affichera Dashboard, Accounts ou Jobs */}
      </main>
    </div>
  );
}
export default RHLayout;
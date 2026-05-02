import { Link,Outlet, NavLink } from 'react-router-dom';
import '../styles/rh/RHLayout.css';
import logo from '../assets/image/Polygon_.png';
function RHLayout() {
  return (
    <div className="rh-layout">
      <aside className="sidebar">
         <img  className="sidebar-logo"src={logo} alt="sidebarlogo" />
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
          <Link className='logout' to='/'>logout</Link>
        </nav>
      </aside>
      <main className="rh-content">
        <Outlet />  {/* Ici s'affichera Dashboard, Accounts ou Jobs */}
      </main>
    </div>
  );
}
export default RHLayout;
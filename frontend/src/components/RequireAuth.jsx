import { Navigate, Outlet } from "react-router-dom";

function RequireAuth({ role }) {
  const token = localStorage.getItem("access_token");
  const userRole = localStorage.getItem("user_role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role && userRole !== role) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default RequireAuth;

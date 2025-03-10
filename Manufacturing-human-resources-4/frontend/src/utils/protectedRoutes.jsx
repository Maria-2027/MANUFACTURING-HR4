import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const userRole = localStorage.getItem("userRole");

  if (!isAuthenticated) return <Navigate to="/account" />;
  
  // Redirect admin users to admin-dashboard
  if (userRole === "admin") return <Navigate to="/admin-dashboard" />;

  return <Outlet />;
};

export default ProtectedRoutes;

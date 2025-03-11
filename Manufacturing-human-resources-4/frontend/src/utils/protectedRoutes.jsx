import { Navigate, Outlet } from "react-router-dom";
import { toast } from 'react-hot-toast';
import { useRef } from 'react';

const ProtectedRoutes = () => {
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const userRole = localStorage.getItem("userRole");
  const isLoggingOut = sessionStorage.getItem("isLoggingOut");
  const toastShown = useRef(false);

  if (!isAuthenticated) {
    if (!isLoggingOut && !toastShown.current) {
      toastShown.current = true;
      toast.error('You must login first');
    }
    sessionStorage.removeItem("isLoggingOut");
    return <Navigate to="/account" />;
  }
  
  // Redirect admin users to admin-dashboard
  if (userRole === "admin") return <Navigate to="/admin-dashboard" />;

  return <Outlet />;
};

export default ProtectedRoutes;

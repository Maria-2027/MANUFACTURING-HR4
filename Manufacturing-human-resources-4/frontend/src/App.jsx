import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import LoginForm from "./pages/LoginForm";
import ForgotPassword from "./pages/ForgotPassword";
import Signup from "./pages/signup";
import Sidebar from "./Components/Sidebar";
import Search from "./Components/Search";
import Workforce from "./Components/Workforce";
import EmComplaint from "./Components/EmComplaint";
import CommunicationPortal from "./Components/CommunicationPortal";
import Dashboard from "./Components/Dashboard";
import "./index.css";
import Profilepage from "../src/Components/Profilepage";
import EmployeeEngagement from "./Components/EmployeeEngagement";
import SettingsPage from "./Components/Settings";
import AccountPanel from "./Components/AccountPanel";
import AdminLoginform from "./pages/AdminLogin";
import SidebarAdmin from "./Components/AdminDashboard";
import AdminGrievance from "./Components/AdminGrievance";
import AdminEmployeeSuggestion from "./Components/AdminEmployeeSuggestion";
import AdminCommunication from "./Components/AdminCommunication";
import AdminWorkflow from "./Components/AdminWorkflow";
import AdminHr3 from "./Components/AdminHr3Compensate";
import AdminHr2 from "./Components/AdminHr2Learning";
import ProtectedRoutes from "./utils/protectedRoutes";
import { Toaster } from 'react-hot-toast';

const App = () => {
  const location = useLocation();

  const hideSidebarAndSearchBar = [
    "/login", "/signup", "/ForgotPassword", "/account", "/admin", "/admin-dashboard", "/admin-grievance", "/admin-employee-suggestion", "/admin-communication", "/admin-workflow", "/admin-compensate", "/admin-hr2-learning"
  ].includes(location.pathname);

  return (
    <div className="flex min-h-screen">
      <Toaster position="top-center" />
      {!hideSidebarAndSearchBar && <Sidebar />}
      <div className="flex flex-col w-full">
        {!hideSidebarAndSearchBar && <Search />}

        <Routes>
          <Route path="/" element={<Navigate to="/account" replace />} />
          <Route path="/account" element={<AccountPanel />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/ForgotPassword" element={<ForgotPassword />} />
          <Route path="/admin" element={<AdminLoginform />} />

          <Route element={<ProtectedRoutes />}>
            <Route path="/workforce" element={<Workforce />} />
            <Route path="/EmComplaint" element={<EmComplaint />} />
            <Route path="/communicationportal" element={<CommunicationPortal />} />
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profilepage />} />
            <Route path="/EmployeeEngagement" element={<EmployeeEngagement />} />
            <Route path="/Settings/" element={<SettingsPage />} />
            <Route path="/admin-dashboard" element={<SidebarAdmin />} />
            <Route path="/admin-grievance" element={<AdminGrievance />} />
            <Route path="/admin-employee-suggestion" element={<AdminEmployeeSuggestion />} />
            <Route path="/admin-communication" element={<AdminCommunication />} />
            <Route path="/admin-workflow" element={<AdminWorkflow />} />
            <Route path="/admin-compensate" element={<AdminHr3 />} />
            <Route path="/admin-hr2-learning" element={<AdminHr2 />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
};

export default App;
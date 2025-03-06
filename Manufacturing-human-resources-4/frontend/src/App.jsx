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

const App = () => {
  const location = useLocation();

  const hideSidebarAndSearchBar = location.pathname === "/login" || location.pathname === "/signup" || location.pathname === "/ForgotPassword" 
  || location.pathname === "/account" || location.pathname === "/admin" || location.pathname === "/admin-dashboard" || location.pathname === "/admin-grievance"
  || location.pathname === "/admin-employee-suggestion" || location.pathname === "/admin-communication" || location.pathname === "/admin-workflow" || location.pathname === "/admin-compensate";

  return (
    <div className="flex min-h-screen">
      {!hideSidebarAndSearchBar && <Sidebar />}
      <div className="flex flex-col w-full">
        {!hideSidebarAndSearchBar && <Search />}

        <Routes>
          {/* Redirect the root path to the login page */}
          <Route path="/" element={<Navigate to="/account" />} />
          <Route path="/workforce" element={<Workforce />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/EmComplaint" element={<EmComplaint />} />
          <Route path="/communicationportal" element={<CommunicationPortal />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/ForgotPassword" element={<ForgotPassword />} />
          <Route path="/profile" element={<Profilepage />} />
          <Route path="/EmployeeEngagement" element={<EmployeeEngagement />} />
          <Route path="/Settings/" element={<SettingsPage />} />
          <Route exact path="/account" element={<AccountPanel />} />
          <Route path="/admin" element={<AdminLoginform />} />
          <Route path="/admin-dashboard" element={<SidebarAdmin />} />
          <Route path="/admin-grievance" element={<AdminGrievance />} />
          <Route path="/admin-employee-suggestion" element={<AdminEmployeeSuggestion />} />
          <Route path="/admin-communication" element={<AdminCommunication />} />
          <Route path="/admin-workflow" element={<AdminWorkflow />} />
          <Route path="/admin-compensate" element={<AdminHr3 />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
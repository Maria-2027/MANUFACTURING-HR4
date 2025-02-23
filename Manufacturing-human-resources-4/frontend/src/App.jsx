import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import LoginForm from "./pages/LoginForm";
import ForgotPassword from "./pages/ForgotPassword";
import Signup from "./pages/signup";
import Sidebar from "./Components/Sidebar";
import Search from "./Components/Search";
import Workforce from "./Components/Workforce";
import EmComplaint from "./Components/EmComplaint";
import CommunicationPortal from "./Components/CommunicationPortal";
import MessageCenter from './Components/MessageCenter';
import Inbox from './Components/Inbox';
import Dashboard from "./Components/Dashboard";
import EmployeeRecords from "./Components/EmployeeRecords";
import "./index.css";
import Profilepage from "../src/Components/Profilepage";
import EmployeeEngagement from "./Components/EmployeeEngagement";
import SettingsPage from "./Components/Settings";

const App = () => {
  const location = useLocation();

  const hideSidebarAndSearchBar = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className="flex min-h-screen">
      {!hideSidebarAndSearchBar && <Sidebar />}
      <div className="flex flex-col w-full">
        {!hideSidebarAndSearchBar && <Search />}

        <Routes>
          {/* Redirect the root path to the login page */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/workforce" element={<Workforce />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/EmComplaint" element={<EmComplaint />} />
          <Route path="/communicationportal" element={<CommunicationPortal />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/ForgotPassword" element={<ForgotPassword />} />
          <Route path="/message-center" element={<MessageCenter />} />
          <Route path="/Inbox" element={<Inbox />} />
          <Route path="/employeerecords" element={<EmployeeRecords />} />
          <Route path="/profile" element={<Profilepage />} />
          <Route path="/EmployeeEngagement" element={<EmployeeEngagement />} />
          <Route path="/Settings/" element={<SettingsPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
import { Routes, Route, useLocation } from "react-router-dom";
import LoginForm from "./pages/LoginForm";
import Sidebar from "./Components/Sidebar";
import Search from "./Components/Search";
import Dashboard from "./Components/Dashboard";
import EmComplaint from "./Components/EmComplaint";
import CoCompplaint from "./Components/CoComplaint";
import CommunicationPortal from "./Components/CommunicationPortal";
import RequestCompensationDetails from "./Components/RequestCompensationDetails";
import "./index.css";

const App = () => {
  const location = useLocation();
  return (
    <div className="flex min-h-screen">
      {location.pathname === "/login" ? null : <Sidebar />}
      <div className="flex flex-col w-full">
        {location.pathname === "/login" ? null : <Search />}

        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/EmComplaint" element={<EmComplaint />} />
          <Route path="/communicationportal" element={<CommunicationPortal />} />
          <Route path="/requestcompensationdetails" element={<RequestCompensationDetails />} />
          <Route path="/CoComplaint" element={<CoCompplaint />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;

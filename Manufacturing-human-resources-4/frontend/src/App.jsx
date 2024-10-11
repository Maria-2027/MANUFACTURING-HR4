import { Routes, Route, useLocation } from "react-router-dom";
import LoginForm from "./pages/LoginForm";
import Sidebar from "./Components/Sidebar";
import Search from "./Components/Search";
import Workforce from "./Components/Workforce";
import EmComplaint from "./Components/EmComplaint";
import CoCompplaint from "./Components/CoComplaint";
import RequestFunds from "./Components/RequestFunds";
import CommunicationPortal from "./Components/CommunicationPortal";
import RequestCompensationDetails from "./Components/RequestCompensationDetails";
import Dashboard from "./Components/Dashboard";
import "./index.css";

const App = () => {
  const location = useLocation();
  return (
    <div className="flex min-h-screen">
      {location.pathname === "/login" ? null : <Sidebar />}
      <div className="flex flex-col w-full">
        {location.pathname === "/login" ? null : <Search />}

        <Routes>
          <Route path="/workforce" element={<Workforce />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/EmComplaint" element={<EmComplaint />} />
          <Route path="/communicationportal" element={<CommunicationPortal />} />
          <Route path="/requestcompensationdetails" element={<RequestCompensationDetails />} />
          <Route path="/RequestFunds" element={<RequestFunds />} />
          <Route path="/CoComplaint" element={<CoCompplaint />} />
          <Route path="/Dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;

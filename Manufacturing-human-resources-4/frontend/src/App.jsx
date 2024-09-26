import {  Routes, Route,useLocation } from 'react-router-dom';
import LoginForm from './pages/LoginForm';
import Sidebar from './Components/Sidebar';
import Search from './Components/Search';
import Dashboard from './Components/Dashboard';



const App = () => {
const location = useLocation();
  return (  
      <div className="flex min-h-screen"> 
       
       { location.pathname === "/login" ? null : <Sidebar />}
      <div className="flex flex-col w-full">
        { location.pathname === "/login" ? null : <Search />} 
        
  
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<LoginForm />} />
        </Routes>
        </div> 
      </div>
    );
};

export default App;

import React, { useState, useEffect } from 'react';
import { FaExclamationCircle, FaRegCommentDots, FaEnvelope, FaChartBar, FaSignOutAlt, FaUserCircle, FaTimes, FaMedal, FaRegClipboard } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import layout from "./Assets/layout.jpg";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TOPEMPLOYEE = process.env.NODE_ENV === "development"
  ? "http://localhost:7688/api/integration/top-employee"
  : "https://backend-hr4.jjm-manufacturing.com/api/integration/top-employee";

const TopEmployee = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("Workforce Analytics");
  const [dateRanges, setDateRanges] = useState({
    monthly: { start: null, end: null },
    weekly: { start: null, end: null }
  });
  const [topEmployees, setTopEmployees] = useState({
    monthlyTopEmployee: null,
    weeklyTopEmployee: null
  });
  const [aiMetrics, setAiMetrics] = useState({
    monthlyScore: null,
    weeklyScore: null
  });
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [employeeStats, setEmployeeStats] = useState(null);
  const [runnersUp, setRunnersUp] = useState({
    second: null,
    third: null
  });
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  const fetchWithRetry = async (url, options, retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response;
      } catch (error) {
        if (i === retries - 1) throw error;
        if (error.code === 'ECONNRESET' || error.name === 'TypeError') {
          await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
          continue;
        }
        throw error;
      }
    }
  };

  const fetchData = async (startDate, endDate) => {
    try { 
      const response = await fetchWithRetry(
        `${TOPEMPLOYEE}?startDate=${startDate}&endDate=${endDate}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Connection': 'keep-alive',
          },
          timeout: 5000
        }
      );

      const data = await response.json();
      if (data.message === "No top employee found in the selected date range") {
        return null;
      }
      return data;
    } catch (error) {
      console.error(`Failed to fetch data: ${error.message}`);
      return null;
    }
  };

  const fetchTopEmployees = async () => {
    try {
      const today = new Date();
      
      // For monthly data
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      
      // For weekly data
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      const weekEnd = new Date(today);
      weekEnd.setDate(weekStart.getDate() + 6);

      setDateRanges({
        monthly: { start: monthStart, end: monthEnd },
        weekly: { start: weekStart, end: weekEnd }
      });

      const formatDate = (date) => date.toISOString().split('T')[0];

      // Add loading state
      setTopEmployees({ monthlyTopEmployee: null, weeklyTopEmployee: null });
      setRunnersUp({ second: null, third: null });

      const monthlyData = await fetchData(
        formatDate(monthStart),
        formatDate(monthEnd)
      );

      const weeklyData = await fetchData(
        formatDate(weekStart),
        formatDate(weekEnd)
      );

      const processEmployeeData = (data) => {
        if (!data || data.message) return null;

        const [firstName, ...lastNameParts] = data.employee_fullname.split(' ');
        const lastName = lastNameParts.join(' ');

        return {
          name: data.employee_fullname,
          employee_firstname: firstName,
          employee_lastname: lastName,
          position: data.position || 'N/A',
          totalHours: data.totalHours || 0,
          minutes_late: data.minutes_late || 0,
          taskCompletionRate: data.taskCompletionRate || 0.8,
          specialProjects: data.specialProjects || 0.7,
          collaborationScore: data.collaborationScore || 0.85,
          peerFeedback: data.peerFeedback || 0.9
        };
      };

      const monthlyEmployee = processEmployeeData(monthlyData);
      const weeklyEmployee = processEmployeeData(weeklyData);

      const calculateScore = (employee) => {
        if (!employee) return 0;
        
        // Weighted scoring system
        const weights = {
          attendance: 0.2,      // 20% - Attendance & punctuality
          performance: 0.3,     // 30% - Task completion & quality
          initiative: 0.2,      // 20% - Special projects & innovation
          teamwork: 0.15,       // 15% - Collaboration & helping others
          feedback: 0.15        // 15% - Customer/peer feedback
        };

        // Calculate individual scores
        const attendanceScore = (employee.totalHours || 0) / 160; // Assuming 160 hours is perfect
        const punctualityScore = 1 - ((employee.minutes_late || 0) / 60);
        const attendanceFinal = (attendanceScore + punctualityScore) / 2;

        const performanceScore = employee.taskCompletionRate || 0.8;
        const initiativeScore = employee.specialProjects || 0.7;
        const teamworkScore = employee.collaborationScore || 0.85;
        const feedbackScore = employee.peerFeedback || 0.9;

        // Calculate final weighted score
        const finalScore = (
          (attendanceFinal * weights.attendance) +
          (performanceScore * weights.performance) +
          (initiativeScore * weights.initiative) +
          (teamworkScore * weights.teamwork) +
          (feedbackScore * weights.feedback)
        ) * 100; // Convert to percentage

        return finalScore.toFixed(2);
      };

      const monthlyTopEmployee = monthlyEmployee ? {
        name: monthlyEmployee.name,
        department: monthlyEmployee.position,
        achievement: `Outstanding performance with:
          • ${monthlyEmployee.totalHours.toFixed(1)} hours worked
          • ${monthlyEmployee.taskCompletionRate * 100}% task completion
          • ${monthlyEmployee.specialProjects ? 'Led special projects' : ''}
          • ${monthlyEmployee.collaborationScore * 100}% team collaboration
          • Excellent peer feedback`,
        aiScore: calculateScore(monthlyEmployee),
        performanceMetrics: {
          taskCompletion: monthlyEmployee.taskCompletionRate || 0,
          initiative: monthlyEmployee.specialProjects || 0,
          teamwork: monthlyEmployee.collaborationScore || 0,
          feedback: monthlyEmployee.peerFeedback || 0
        },
        tags: ['Top Performer', 'Monthly Star']
      } : null;

      const weeklyTopEmployee = weeklyEmployee ? {
        name: weeklyEmployee.name,
        department: weeklyEmployee.position,
        achievement: `Excellence with ${weeklyEmployee.totalHours.toFixed(1)} hours worked`,
        aiScore: calculateScore(weeklyEmployee),
        tags: ['Weekly Champion', 'Outstanding']
      } : null;

      setTopEmployees({ monthlyTopEmployee, weeklyTopEmployee });

      setRunnersUp({
        second: null,
        third: null
      });

    } catch (error) {
      console.error('Error in fetchTopEmployees:', error);
      setTopEmployees({ monthlyTopEmployee: null, weeklyTopEmployee: null });
      setRunnersUp({ second: null, third: null });
    }
  };

  useEffect(() => {
    fetchTopEmployees();
  }, []);

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const sidebarClasses = darkMode 
    ? "bg-gray-800 text-white border-r border-gray-700" 
    : "bg-white text-gray-900 border-r border-gray-200";

  const buttonHoverClasses = darkMode 
    ? "hover:bg-gray-700" 
    : "hover:bg-gray-100";

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const generateDateRange = (start, end) => {
    const dates = [];
    const current = new Date(start);
    while (current <= end) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  const handleEmployeeClick = async (employee, period) => {
    setIsLoadingStats(true);
    setSelectedEmployee({
      ...employee,
      period,
      dateRange: dateRanges[period]
    });

    const { start, end } = dateRanges[period];
    const dates = generateDateRange(start, end);
    
    try {
      const formattedDates = dates.map(date => 
        date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
      );

      const dailyData = await Promise.all(dates.map(async (date) => {
        const formattedDate = date.toISOString().split('T')[0];
        const response = await fetch(
          `${TOPEMPLOYEE}?startDate=${formattedDate}&endDate=${formattedDate}`
        );
        if (!response.ok) return null;
        const data = await response.json();
        return {
          totalHours: data?.totalHours || 0,
          minutesLate: data?.minutes_late || 0
        };
      }));

      const stats = {
        dates: formattedDates,
        totalHours: dailyData.map(d => d?.totalHours || 0),
        minutesLate: dailyData.map(d => d?.minutesLate || 0),
        averageHours: dailyData.reduce((acc, d) => acc + (d?.totalHours || 0), 0) / dailyData.length,
        averageLateness: dailyData.reduce((acc, d) => acc + (d?.minutesLate || 0), 0) / dailyData.length
      };

      setEmployeeStats(stats);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching employee stats:', error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const LoadingModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-700 text-lg font-semibold">Loading performance data...</p>
      </div>
    </div>
  );

  const PerformanceModal = ({ employee, stats, onClose }) => {
    if (!employee || !stats) return null;

    const chartData = {
      labels: stats.dates,
      datasets: [
        {
          label: 'Total Hours',
          data: stats.totalHours,
          borderColor: '#4F46E5',
          backgroundColor: '#4F46E5',
          yAxisID: 'hours',
          type: 'bar',
        },
        {
          label: 'Minutes Late',
          data: stats.minutesLate,
          borderColor: '#EF4444',
          backgroundColor: '#FEE2E2',
          yAxisID: 'minutes',
          type: 'bar',
        }
      ],
    };

    const options = {
      responsive: true,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Performance Metrics',
          font: {
            size: 16,
            weight: 'bold'
          }
        }
      },
      scales: {
        x: {
          ticks: {
            maxRotation: 45,
            minRotation: 45
          }
        },
        hours: {
          type: 'linear',
          display: true,
          position: 'left',
          title: {
            display: true,
            text: 'Hours Worked',
            color: '#4F46E5',
            font: {
              weight: 'bold'
            }
          },
          grid: {
            display: false
          }
        },
        minutes: {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: true,
            text: 'Minutes Late',
            color: '#EF4444',
            font: {
              weight: 'bold'
            }
          },
          grid: {
            display: false
          }
        }
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{employee.name}</h3>
              <p className="text-gray-600">{employee.department}</p>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <FaTimes size={24} />
            </button>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Average Hours/Day</h4>
                <p className="text-2xl font-bold text-indigo-600">{stats.averageHours?.toFixed(1)}h</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Average Punctuality</h4>
                <p className="text-2xl font-bold text-red-600">{stats.averageLateness?.toFixed(0)}m late</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Performance Rating</h4>
                <p className="text-2xl font-bold text-green-600">{employee.aiScore}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h4 className="text-lg font-semibold mb-4">Performance Highlights</h4>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-lg shadow">
                <h5 className="text-sm font-medium text-gray-500 mb-2">Task Completion</h5>
                <div className="flex items-center justify-between">
                  <p className="text-xl font-bold text-indigo-600">
                    {(employee.performanceMetrics?.taskCompletion * 100).toFixed(0)}%
                  </p>
                  <span className="text-sm text-gray-500">Tasks completed on time</span>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h5 className="text-sm font-medium text-gray-500 mb-2">Initiative</h5>
                <div className="flex items-center justify-between">
                  <p className="text-xl font-bold text-green-600">
                    {(employee.performanceMetrics?.initiative * 100).toFixed(0)}%
                  </p>
                  <span className="text-sm text-gray-500">Special projects</span>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h5 className="text-sm font-medium text-gray-500 mb-2">Team Collaboration</h5>
                <div className="flex items-center justify-between">
                  <p className="text-xl font-bold text-blue-600">
                    {(employee.performanceMetrics?.teamwork * 100).toFixed(0)}%
                  </p>
                  <span className="text-sm text-gray-500">Teamwork rating</span>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h5 className="text-sm font-medium text-gray-500 mb-2">Peer Feedback</h5>
                <div className="flex items-center justify-between">
                  <p className="text-xl font-bold text-purple-600">
                    {(employee.performanceMetrics?.feedback * 100).toFixed(0)}%
                  </p>
                  <span className="text-sm text-gray-500">Positive feedback</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 h-80">
            <Bar data={chartData} options={options} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className={`w-72 shadow-lg p-6 flex flex-col relative h-screen overflow-y-auto ${sidebarClasses}`}>
        <div className="flex justify-center mb-6">
          <img src={layout} alt="JJM Logo" className="w-32 h-32 rounded-full" />
        </div>
        <h2 className="text-2xl font-bold text-center mb-8">JJM Admin Portal</h2>

        <nav className="flex-grow">
          <ul className="space-y-4">
            {[
              { title: "Employee Grievances", icon: <FaExclamationCircle className="text-lg" />, link: "/admin-grievance" },
              { title: "Employee Suggestions", icon: <FaRegCommentDots className="text-lg" />, link: "/admin-employee-suggestion" },
              { title: "Communication Hub", icon: <FaEnvelope className="text-lg" />, link: "/admin-communication" },
              { title: "Workforce Analytics", icon: <FaChartBar className="text-lg" />, link: "/admin-workflow" },
              { title: "Audit Logs", icon: <FaRegClipboard className="text-lg" />, link: "/admin-audit-logs" }
            ].map((item, index) => (
              <li key={index} className={`p-3 rounded-md transition duration-200 ${activeTab === item.title ? "bg-blue-200 text-blue-600" : buttonHoverClasses}`}>
                <Link to={item.link} className="flex items-center space-x-3" onClick={() => setActiveTab(item.title)}>
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-4 left-0 right-0 text-center">
          <button
            onClick={handleLogout}
            className={`flex items-center justify-center space-x-4 text-lg font-semibold p-3 rounded-md cursor-pointer transition duration-200 ${buttonHoverClasses} w-full`}
          >
            <FaSignOutAlt className="text-xl" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Employee Recognition (AI-Powered)</h1>
          
          {/* Employee of the Month */}
          <div 
            className="bg-white p-6 rounded-lg shadow-lg mb-6 cursor-pointer transition-all duration-200 hover:shadow-xl hover:bg-gray-50"
            onClick={() => topEmployees.monthlyTopEmployee && handleEmployeeClick(topEmployees.monthlyTopEmployee, 'monthly')}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-blue-600">Employee of the Month</h2>
              {dateRanges.monthly.start && dateRanges.monthly.end && (
                <p className="text-sm text-gray-600">
                  {formatDate(dateRanges.monthly.start)} - {formatDate(dateRanges.monthly.end)}
                </p>
              )}
            </div>
            {topEmployees.monthlyTopEmployee ? (
              <div className="flex items-center space-x-6">
                <div className="w-48 h-48 flex items-center justify-center text-gray-400">
                  <FaUserCircle className="w-full h-full" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{topEmployees.monthlyTopEmployee.name}</h3>
                  <p className="text-gray-600 mb-2">{topEmployees.monthlyTopEmployee.department}</p>
                  <p className="text-gray-700 mb-4">{topEmployees.monthlyTopEmployee.achievement}</p>
                  {topEmployees.monthlyTopEmployee.aiScore && (
                    <p className="text-green-600 font-semibold mb-2">
                      AI Performance Score: {topEmployees.monthlyTopEmployee.aiScore}
                    </p>
                  )}
                  <div className="flex space-x-2">
                    {topEmployees.monthlyTopEmployee.tags?.map((tag, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p>Loading monthly top employee data...</p>
            )}
          </div>

          {/* Employee of the Week */}
          <div 
            className="bg-white p-6 rounded-lg shadow-lg cursor-pointer transition-all duration-200 hover:shadow-xl hover:bg-gray-50"
            onClick={() => topEmployees.weeklyTopEmployee && handleEmployeeClick(topEmployees.weeklyTopEmployee, 'weekly')}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-blue-600">Employee of the Week</h2>
              {dateRanges.weekly.start && dateRanges.weekly.end && (
                <p className="text-sm text-gray-600">
                  {formatDate(dateRanges.weekly.start)} - {formatDate(dateRanges.weekly.end)}
                </p>
              )}
            </div>
            {topEmployees.weeklyTopEmployee ? (
              <div className="flex items-center space-x-6">
                <div className="w-40 h-40 flex items-center justify-center text-gray-400">
                  <FaUserCircle className="w-full h-full" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{topEmployees.weeklyTopEmployee.name}</h3>
                  <p className="text-gray-600 mb-2">{topEmployees.weeklyTopEmployee.department}</p>
                  <p className="text-gray-700 mb-4">{topEmployees.weeklyTopEmployee.achievement}</p>
                  {topEmployees.weeklyTopEmployee.aiScore && (
                    <p className="text-green-600 font-semibold mb-2">
                      AI Performance Score: {topEmployees.weeklyTopEmployee.aiScore}
                    </p>
                  )}
                  <div className="flex space-x-2">
                    {topEmployees.weeklyTopEmployee.tags?.map((tag, index) => (
                      <span key={index} className="px-3 py-1 bg-yellow-100 text-yellow-600 rounded-full text-sm">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">No top employee found for this week.</p>
              </div>
            )}
          </div>

          <div className="max-w-3xl mx-auto my-8 text-center">
            <p className="text-gray-700 italic text-lg font-medium leading-relaxed">
              "Congratulations on the amazing news! This is an incredible milestone and you deserve the spotlight to celebrate the moment."
            </p>
          </div>

          {/* Runners-up */}
          <div className="mt-6 grid grid-cols-2 gap-6">
            {/* Second Place */}
            {runnersUp.second && (
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-700">2nd Place</h3>
                  <div className="bg-silver p-2 rounded-full">
                    <FaMedal className="text-gray-400 text-xl" />
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 flex items-center justify-center text-gray-400">
                    <FaUserCircle className="w-full h-full" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">{runnersUp.second.name}</h4>
                    <p className="text-gray-600">{runnersUp.second.department}</p>
                    <p className="text-green-600 font-semibold mt-2">
                      Score: {runnersUp.second.aiScore}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Third Place */}
            {runnersUp.third && (
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-700">3rd Place</h3>
                  <div className="bg-bronze p-2 rounded-full">
                    <FaMedal className="text-orange-400 text-xl" />
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 flex items-center justify-center text-gray-400">
                    <FaUserCircle className="w-full h-full" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">{runnersUp.third.name}</h4>
                    <p className="text-gray-600">{runnersUp.third.department}</p>
                    <p className="text-green-600 font-semibold mt-2">
                      Score: {runnersUp.third.aiScore}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Performance Modal */}
          {isLoadingStats && <LoadingModal />}
          {showModal && selectedEmployee && (
            <PerformanceModal
              employee={selectedEmployee}
              stats={employeeStats}
              onClose={() => {
                setShowModal(false);
                setSelectedEmployee(null);
                setEmployeeStats(null);
              }}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default TopEmployee;

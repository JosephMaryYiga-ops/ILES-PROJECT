import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import SupervisorDashboard from "./pages/SupervisorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ReviewLogs from "./pages/ReviewLogs";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/supervisor" element={<SupervisorDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/ReviewLogs" element={<ReviewLogs />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import SupervisorDashboard from "./pages/SupervisorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import WeeklyLogs from "./pages/WeeklyLogs";
import SubmitLog from "./pages/SubmitLog";
import ReviewLogs from "./pages/ReviewLogs";
import Placement from "./pages/Placement";
import Evaluation from "./pages/Evaluation";
import Criteria from "./pages/Criteria";

// Blocks page if not logged in
function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem('access');
  const role = localStorage.getItem('role');

  if (!token) return <Navigate to="/" />;
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/" />;
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Login />} />

        {/* Student only */}
        <Route path="/student" element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        } />
        <Route path="/student/logs" element={
          <ProtectedRoute allowedRoles={['student']}>
            <WeeklyLogs />
          </ProtectedRoute>
        } />
        <Route path="/student/submit" element={
          <ProtectedRoute allowedRoles={['student']}>
            <SubmitLog />
          </ProtectedRoute>
        } />

        {/* Supervisor only */}
        <Route path="/supervisor" element={
          <ProtectedRoute allowedRoles={['workplace_supervisor', 'academic_supervisor']}>
            <SupervisorDashboard />
          </ProtectedRoute>
        } />
        <Route path="/supervisor/review" element={
          <ProtectedRoute allowedRoles={['workplace_supervisor', 'academic_supervisor']}>
            <ReviewLogs />
          </ProtectedRoute>
        } />

        {/* Admin only */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/placement" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Placement />
          </ProtectedRoute>
        } />
        <Route path="/admin/evaluation" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Evaluation />
          </ProtectedRoute>
        } />
        <Route path="/admin/criteria" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Criteria />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
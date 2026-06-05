import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
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
import UserManagement from "./pages/UserManagement";
import Signup from "./pages/Signup";
import EvaluationCriteria from "./pages/EvaluationCriteria";
import StudentEvaluation from "./pages/StudentEvaluation";
import SupervisorEvaluation from "./pages/SupervisorEvaluation";

function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem('access');
  const role = localStorage.getItem('role');

  if (!token) return <Navigate to="/" />;
  
  const effectiveRole = (role === '' || !role) ? 'admin' : role;
  
  if (allowedRoles && !allowedRoles.includes(effectiveRole)) return <Navigate to="/" />;
  return children;
}

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/signup" element={<Signup />} />
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
          <Route path="/student/evaluation" element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentEvaluation />
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
          <Route path="/supervisor/evaluation" element={
            <ProtectedRoute allowedRoles={['workplace_supervisor', 'academic_supervisor']}>
              <SupervisorEvaluation />
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
          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <UserManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/criteria" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <EvaluationCriteria />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
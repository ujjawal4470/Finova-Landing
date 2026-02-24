import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; // <-- UPDATED FOLDER NAME
import Layout from './components/Layout';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; // <-- NEW IMPORT
import AdminPanel from './pages/AdminPanel';
import LenderDashboard from './pages/LenderDashbaord';
import ProfilePage from './pages/ProfilePage';
import BorrowerDashboard from './pages/BorrowerDashboard';
import AnalystDashboard from './pages/AnalystDashboard';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRole && user.role !== allowedRole) return <Navigate to="/" replace />;
  return children;
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public Routes */}
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} /> {/* <-- NEW ROUTE */}
          <Route path="profile" element={
            <ProtectedRoute><ProfilePage /></ProtectedRoute>
          } />

          {/* Protected Role-Based Routes */}
          <Route path="admin" element={
            <ProtectedRoute allowedRole="admin"><AdminPanel /></ProtectedRoute>
          } />
          <Route path="lender" element={
            <ProtectedRoute allowedRole="lender"><LenderDashboard /></ProtectedRoute>
          } />
          <Route path="borrower" element={
            <ProtectedRoute allowedRole="borrower"><BorrowerDashboard /></ProtectedRoute>
          } />
          <Route path="analyst" element={
            <ProtectedRoute allowedRole="analyst"><AnalystDashboard /></ProtectedRoute>
          } />

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}
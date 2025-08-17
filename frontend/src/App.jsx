// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DashboardHubPage from './pages/DashboardHubPage';
import DashboardPage from './pages/DashboardPage';
import HistoryPage from './pages/HistoryPage';
import HistoryDetailPage from './pages/HistoryDetailPage';
import ProfilePage from './pages/ProfilePage';
import DemoPage from './pages/DemoPage'; // Import the new DemoPage

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="/demo" element={<DemoPage />} /> {/* Add Demo Route */}

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<DashboardHubPage />} />
            <Route path="/new-analysis" element={<DashboardPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/history/:id" element={<HistoryDetailPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

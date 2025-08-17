// src/components/PrivateRoute.jsx

import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const PrivateRoute = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    // Optional: You can return a loading spinner here
    return <div>Loading...</div>;
  }

  // If authenticated, render the child route. Otherwise, redirect to login.
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
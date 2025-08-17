// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  // --- NEW: Alert State ---
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['x-auth-token'];
      localStorage.removeItem('token');
    }
  };

  // --- NEW: Function to set an alert ---
  const showAlert = (msg, type = 'error') => {
    setAlert({ msg, type });
    // Clear alert after 5 seconds
    setTimeout(() => setAlert(null), 5000);
  };

  useEffect(() => {
    const loadUser = async () => {
      if (localStorage.token) {
        setAuthToken(localStorage.token);
        try {
          const res = await axios.get('/api/auth');
          setUser(res.data);
          setIsAuthenticated(true);
        } catch (err) {
          setAuthToken(null);
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const register = async (formData) => {
    try {
      const res = await axios.post('/api/users', formData);
      setToken(res.data.token);
      setAuthToken(res.data.token);
      setIsAuthenticated(true);
      const userRes = await axios.get('/api/auth');
      setUser(userRes.data);
      navigate('/dashboard');
    } catch (err) {
      // --- UPDATED: Show alert on error ---
      const errorMsg = err.response?.data?.errors[0]?.msg || 'Registration failed';
      showAlert(errorMsg, 'error');
    }
  };

  const login = async (formData) => {
    try {
      const res = await axios.post('/api/auth', formData);
      setToken(res.data.token);
      setAuthToken(res.data.token);
      setIsAuthenticated(true);
      const userRes = await axios.get('/api/auth');
      setUser(userRes.data);
      navigate('/dashboard');
    } catch (err) {
      // --- UPDATED: Show alert on error ---
      const errorMsg = err.response?.data?.errors[0]?.msg || 'Login failed';
      showAlert(errorMsg, 'error');
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setAuthToken(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated,
        loading,
        user,
        alert, // Expose alert state
        showAlert, // Expose showAlert function
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

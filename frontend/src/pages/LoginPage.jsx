// frontend/src/pages/LoginPage.jsx
import React, { useState, useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Alert from '../components/Alert';

// Logo component to be used on the page
const Logo = () => (
    <div className="flex items-center space-x-3">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-indigo-600">
        <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 11.5L13 14L15 15L13 16L12 18.5L11 16L9 15L11 14L12 11.5Z" fill="currentColor"/>
      </svg>
      <span className="text-2xl font-bold text-gray-800 tracking-wider">
        SmartMatch
      </span>
    </div>
);

const LoginPage = () => {
  const { login, isAuthenticated } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    login({ email, password });
  };

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="container mx-auto p-4 flex flex-col lg:flex-row items-center justify-center">
        {/* Left Side: Illustration */}
        <div className="hidden lg:block lg:w-1/2 p-8">
            <img 
                src="https://illustrations.popsy.co/amber/home-office.svg" 
                alt="Login Illustration" 
                className="w-full max-w-md mx-auto"
            />
        </div>

        {/* Right Side: Form */}
        <div className="w-full lg:w-1/2 flex justify-center">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg border border-gray-100">
                <div className="flex justify-center">
                    <Logo />
                </div>
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900">
                        Welcome Back!
                    </h2>
                    <p className="mt-2 text-gray-600">
                        Sign in to continue to your dashboard.
                    </p>
                </div>
                
                <Alert />

                <form className="space-y-6" onSubmit={onSubmit}>
                <div>
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email address
                    </label>
                    <input
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    onChange={onChange}
                    required
                    className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="you@example.com"
                    />
                </div>
                <div>
                    <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <div className="text-sm">
                        <Link to="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Forgot your password?
                        </Link>
                    </div>
                    </div>
                    <input
                    type="password"
                    name="password"
                    id="password"
                    value={password}
                    onChange={onChange}
                    required
                    className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="••••••••"
                    />
                </div>
                <div>
                    <button
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105"
                    >
                    Sign in
                    </button>
                </div>
                </form>
                <p className="text-sm text-center text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Register here
                </Link>
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

// frontend/src/pages/ForgotPasswordPage.jsx
import React, { useState } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';

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


const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/forgot-password', { email });
      setMessage(res.data.msg);
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="flex justify-center">
                <Logo />
            </div>
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900">
                Forgot Your Password?
                </h2>
                <p className="mt-2 text-gray-600">
                No problem. Enter your email and we'll send you a reset link.
                </p>
            </div>
            
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
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="you@example.com"
                />
            </div>
            <div>
                <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                >
                {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
            </div>
            </form>
            {message && <p className="text-green-600 text-center text-sm">{message}</p>}
            {error && <p className="text-red-600 text-center text-sm">{error}</p>}
            <p className="text-sm text-center text-gray-600">
            Remembered your password?{' '}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign in
            </Link>
            </p>
        </div>
    </div>
  );
};

export default ForgotPasswordPage;

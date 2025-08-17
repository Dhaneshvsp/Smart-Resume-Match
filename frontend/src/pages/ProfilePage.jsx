// frontend/src/pages/ProfilePage.jsx
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const ProfilePage = () => {
  const { user } = useContext(AuthContext);

  const [name, setName] = useState(user ? user.name : '');
  const [nameMessage, setNameMessage] = useState({ text: '', type: '' });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
  });
  const [passwordMessage, setPasswordMessage] = useState({ text: '', type: '' });

  const onNameChange = (e) => setName(e.target.value);

  const onPasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const onNameSubmit = async (e) => {
    e.preventDefault();
    setNameMessage({ text: '', type: '' });
    try {
      await axios.put('/api/users/profile', { name });
      setNameMessage({ text: 'Name updated successfully! The change will be visible on your next login.', type: 'success' });
    } catch (err) {
      setNameMessage({ text: 'Failed to update name.', type: 'error' });
    }
  };

  const onPasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMessage({ text: '', type: '' });
    try {
      await axios.put('/api/users/password', passwordData);
      setPasswordMessage({ text: 'Password updated successfully!', type: 'success' });
      setPasswordData({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setPasswordMessage({ text: err.response?.data?.errors[0]?.msg || 'Failed to update password.', type: 'error' });
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const Message = ({ message }) => {
    if (!message.text) return null;
    const styles = {
        success: 'text-green-600',
        error: 'text-red-600'
    };
    return <p className={`text-sm mt-2 ${styles[message.type]}`}>{message.text}</p>;
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
        <div className="mb-6">
            <Link to="/dashboard" className="text-indigo-600 hover:underline flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Dashboard
            </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Profile</h1>
      
        <div className="grid md:grid-cols-3 gap-8">
            {/* Left Column: Profile Info */}
            <div className="md:col-span-1">
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <div className="mx-auto bg-indigo-100 text-indigo-600 rounded-full h-24 w-24 flex items-center justify-center text-4xl font-bold mb-4">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <h2 className="text-2xl font-bold">{user.name}</h2>
                    <p className="text-gray-500">{user.email}</p>
                </div>
            </div>

            {/* Right Column: Forms */}
            <div className="md:col-span-2 space-y-8">
                {/* Update Name Form */}
                <div className="bg-white p-8 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4">Profile Information</h2>
                    <form onSubmit={onNameSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Full Name</label>
                        <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={onNameChange}
                        className="w-full px-4 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button type="submit" className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700">
                            Update Name
                        </button>
                        <Message message={nameMessage} />
                    </div>
                    </form>
                </div>

                {/* Change Password Form */}
                <div className="bg-white p-8 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4">Change Password</h2>
                    <form onSubmit={onPasswordSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="currentPassword">Current Password</label>
                        <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={onPasswordChange}
                        required
                        className="w-full px-4 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newPassword">New Password</label>
                        <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={onPasswordChange}
                        minLength="6"
                        required
                        className="w-full px-4 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button type="submit" className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700">
                            Change Password
                        </button>
                         <Message message={passwordMessage} />
                    </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
  );
};

export default ProfilePage;

// src/components/Navbar.jsx
import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Logo = () => (
  <div className="flex items-center space-x-3">
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
      <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 11.5L13 14L15 15L13 16L12 18.5L11 16L9 15L11 14L12 11.5Z" fill="currentColor"/>
    </svg>
    <span className="text-xl font-bold text-white tracking-wider">
      SmartMatch
    </span>
  </div>
);

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu
  const dropdownRef = useRef(null);

  const navLinkStyles = ({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`;
  const mobileNavLinkStyles = ({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const authLinks = (
    <>
      <NavLink to="/dashboard" className={navLinkStyles}>Dashboard</NavLink>
      <NavLink to="/history" className={navLinkStyles}>History</NavLink>
      <Link to="/new-analysis" className="bg-indigo-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-600 transition-colors text-sm whitespace-nowrap">
        + New Analysis
      </Link>
      <div className="relative" ref={dropdownRef}>
        <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center text-white focus:outline-none">
          <span className="bg-gray-600 rounded-full h-8 w-8 flex items-center justify-center font-bold">
            {user ? user.name.charAt(0).toUpperCase() : ''}
          </span>
          <svg className={`w-4 h-4 ml-2 transition-transform duration-200 hidden sm:block ${isDropdownOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </button>
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 animate-fade-in-down-fast">
            <div className="px-4 py-2 text-sm text-gray-700 border-b">
                Signed in as <br/> <span className="font-bold">{user && user.name}</span>
            </div>
            <NavLink to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsDropdownOpen(false)}>
              My Profile
            </NavLink>
            <button onClick={() => { logout(); setIsDropdownOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Logout
            </button>
          </div>
        )}
      </div>
    </>
  );

  const guestLinks = (
    <>
      <NavLink to="/login" className={navLinkStyles}>Login</NavLink>
      <Link to="/register" className="bg-white text-indigo-600 font-semibold py-2 px-4 rounded-md hover:bg-gray-100 transition-colors text-sm whitespace-nowrap">
        Sign Up
      </Link>
    </>
  );
  
  return (
    <nav className="bg-gray-800 sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to={isAuthenticated ? "/dashboard" : "/"}>
              <Logo />
            </Link>
          </div>
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? authLinks : guestLinks}
          </div>
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none">
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard" className={mobileNavLinkStyles} onClick={() => setIsMobileMenuOpen(false)}>Dashboard</NavLink>
                <NavLink to="/history" className={mobileNavLinkStyles} onClick={() => setIsMobileMenuOpen(false)}>History</NavLink>
                <NavLink to="/new-analysis" className={mobileNavLinkStyles} onClick={() => setIsMobileMenuOpen(false)}>New Analysis</NavLink>
                <NavLink to="/profile" className={mobileNavLinkStyles} onClick={() => setIsMobileMenuOpen(false)}>My Profile</NavLink>
                <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={mobileNavLinkStyles} onClick={() => setIsMobileMenuOpen(false)}>Login</NavLink>
                <NavLink to="/register" className={mobileNavLinkStyles} onClick={() => setIsMobileMenuOpen(false)}>Sign Up</NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

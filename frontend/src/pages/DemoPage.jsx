// frontend/src/pages/DemoPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const DemoPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would send this data to your backend.
    // For this simulation, we'll just show a success message.
    console.log('Demo Request Submitted:', formData);
    setSubmitted(true);
  };

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {submitted ? (
          <div className="text-center bg-white p-10 rounded-xl shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="mt-6 text-2xl font-extrabold text-gray-900">Thank You!</h2>
            <p className="mt-2 text-gray-600">
              Your demo request has been received. Our team will get back to you shortly.
            </p>
            <div className="mt-6">
              <Link to="/" className="text-indigo-600 hover:text-indigo-500 font-medium">
                &larr; Back to Home
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Request a Live Demo
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              See how SmartMatch can transform your recruitment process.
            </p>
            <form className="mt-8 space-y-6 bg-white p-10 rounded-xl shadow-lg" onSubmit={onSubmit}>
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="name" className="sr-only">Full Name</label>
                  <input id="name" name="name" type="text" required value={formData.name} onChange={onChange} className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Full Name" />
                </div>
                <div>
                  <label htmlFor="email" className="sr-only">Email address</label>
                  <input id="email" name="email" type="email" required value={formData.email} onChange={onChange} className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Email address" />
                </div>
                <div>
                  <label htmlFor="company" className="sr-only">Company</label>
                  <input id="company" name="company" type="text" required value={formData.company} onChange={onChange} className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Company Name" />
                </div>
                <div>
                  <label htmlFor="message" className="sr-only">Message</label>
                  <textarea id="message" name="message" rows="4" value={formData.message} onChange={onChange} className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Tell us about your needs (optional)"></textarea>
                </div>
              </div>

              <div>
                <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default DemoPage;

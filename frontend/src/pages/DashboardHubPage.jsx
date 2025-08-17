// frontend/src/pages/DashboardHubPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const DashboardHubPage = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ totalJobs: 0, totalCandidates: 0, approvedCandidates: 0 });
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get('/api/jobs');
        const jobBatches = res.data;
        let totalCandidates = 0;
        let approvedCandidates = 0;
        jobBatches.forEach(batch => {
          totalCandidates += batch.rankedCandidates.length;
          batch.rankedCandidates.forEach(candidate => {
            if (candidate.status === 'Approved') approvedCandidates++;
          });
        });
        setStats({ totalJobs: jobBatches.length, totalCandidates, approvedCandidates });
        setRecentJobs(jobBatches.slice(0, 3));
      } catch (err) {
        console.error("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const StatCard = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4 transition-transform transform hover:scale-105">
      <div className="bg-indigo-100 text-indigo-600 rounded-full p-3">{icon}</div>
      <div>
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );

  if (loading) {
    return <div className="text-center p-8">Loading Dashboard...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome back, {user && user.name}!</h1>
        <p className="text-gray-600">Here's a summary of your recruitment activity.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Jobs Analyzed" value={stats.totalJobs} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>} />
        <StatCard title="Candidates Processed" value={stats.totalCandidates} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} />
        <StatCard title="Approved Candidates" value={stats.approvedCandidates} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
      </div>

      <div className="grid md:grid-cols-5 gap-8">
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <Link to="/new-analysis" className="block w-full text-center bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-transform transform hover:scale-105">
              + Start New Analysis
            </Link>
            <Link to="/history" className="block w-full text-center bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-lg hover:bg-gray-300">
              View Full History
            </Link>
          </div>
        </div>
        <div className="md:col-span-3 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Recent Analyses</h2>
          {recentJobs.length > 0 ? (
            <ul className="space-y-3">
              {recentJobs.map(job => (
                <li key={job._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
                  <div>
                    <p className="font-semibold text-gray-800">{job.jobTitle}</p>
                    <p className="text-sm text-gray-500">{job.rankedCandidates.length} candidates</p>
                  </div>
                  <Link to={`/history/${job._id}`} className="text-indigo-600 hover:underline text-sm font-semibold">
                    View &rarr;
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8">
                <p className="text-gray-500">You haven't analyzed any jobs yet.</p>
                <Link to="/new-analysis" className="mt-4 inline-block text-indigo-600 hover:underline font-semibold">Start your first analysis</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHubPage;

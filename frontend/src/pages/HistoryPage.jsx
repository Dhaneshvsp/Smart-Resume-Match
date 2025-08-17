// frontend/src/pages/HistoryPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const HistoryPage = () => {
  const [jobBatches, setJobBatches] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get('/api/jobs');
        setJobBatches(res.data);
      } catch (err) {
        setError('Failed to load analysis history.');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filteredBatches = jobBatches.filter(batch =>
    batch.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
            <div className="text-center">
                <p className="text-gray-600">Loading history...</p>
            </div>
        </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 p-8">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <div>
            <h1 className="text-3xl font-bold text-gray-800">Job Analysis History</h1>
            <p className="text-gray-600 mt-1">Review and manage your past candidate analyses.</p>
        </div>
        <div className="w-full sm:w-1/3">
          <input
            type="text"
            placeholder="Search by job title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
      </div>
      {filteredBatches.length === 0 ? (
        <div className="text-center bg-white p-12 rounded-lg shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
            <h3 className="mt-2 text-xl font-semibold text-gray-800">No Results Found</h3>
            <p className="text-gray-500 mt-2">
                {jobBatches.length > 0 ? `No history items match your search for "${searchTerm}".` : "You have no saved analyses yet."}
            </p>
             {jobBatches.length === 0 && (
                <Link to="/new-analysis" className="mt-4 inline-block bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700">
                    Start Your First Analysis
                </Link>
            )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBatches.map((batch) => (
            <div key={batch._id} className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between transition-shadow hover:shadow-xl">
              <div>
                <h2 className="text-xl font-bold text-indigo-600 truncate">{batch.jobTitle}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(batch.analysisDate).toLocaleDateString()}
                </p>
                <div className="mt-4 flex items-center text-sm text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" /></svg>
                    <span>{batch.rankedCandidates.length} candidates</span>
                </div>
              </div>
              <Link
                to={`/history/${batch._id}`}
                className="mt-6 block w-full text-center bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-600"
              >
                View Results
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;

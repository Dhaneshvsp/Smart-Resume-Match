// frontend/src/pages/HistoryDetailPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const HistoryDetailPage = () => {
  const { id } = useParams();
  const [batch, setBatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBatchDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/jobs/${id}`);
      setBatch(res.data);
    } catch (err) {
      setError('Could not load analysis details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatchDetails();
  }, [id]);

  const handleStatusUpdate = async (candidateId, newStatus) => {
    const originalCandidates = [...batch.rankedCandidates];
    try {
      const updatedCandidates = batch.rankedCandidates.map(c =>
        c._id === candidateId ? { ...c, status: newStatus } : c
      );
      setBatch({ ...batch, rankedCandidates: updatedCandidates });
      await axios.put(`/api/jobs/${id}/candidate/${candidateId}`, { status: newStatus });
    } catch (err) {
      setError('Failed to update status. Please try again.');
      setBatch({ ...batch, rankedCandidates: originalCandidates }); // Revert on error
    }
  };

  const StatusBadge = ({ status }) => {
    const styles = {
      Pending: 'bg-gray-200 text-gray-800',
      Approved: 'bg-green-200 text-green-800',
      Rejected: 'bg-red-200 text-red-800',
    };
    return (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${styles[status]}`}>
        {status}
      </span>
    );
  };

  if (loading) return <div className="text-center p-8">Loading details...</div>;
  if (error) return <div className="text-center text-red-500 p-8">{error}</div>;
  if (!batch) return <div className="text-center p-8">Analysis not found.</div>;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <Link to="/history" className="text-indigo-600 hover:underline flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to History
        </Link>
      </div>
      
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="border-b pb-4 mb-6">
            <h1 className="text-3xl font-bold text-gray-800">{batch.jobTitle}</h1>
            <p className="text-gray-500 mt-1">Analyzed on {new Date(batch.analysisDate).toLocaleDateString()}</p>
        </div>
        
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Ranked Candidate List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 uppercase tracking-wider">Rank</th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 uppercase tracking-wider">Resume File</th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 uppercase tracking-wider">Match Score</th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 uppercase tracking-wider">Status</th>
                <th className="text-center py-3 px-4 font-semibold text-sm text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {batch.rankedCandidates.map((candidate, index) => (
                <tr key={candidate._id} className="hover:bg-gray-50">
                  <td className="py-4 px-4 font-bold text-lg text-gray-700">{index + 1}</td>
                  <td className="py-4 px-4 text-gray-800">{candidate.fileName}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2.5">
                        <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${candidate.matchScore}%` }}></div>
                      </div>
                      <span className="font-bold text-indigo-600 ml-3">{candidate.matchScore}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <StatusBadge status={candidate.status} />
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex justify-center space-x-2">
                      <button 
                        onClick={() => handleStatusUpdate(candidate._id, 'Approved')}
                        className="p-2 text-green-500 rounded-full hover:bg-green-100 disabled:opacity-40 disabled:hover:bg-transparent"
                        disabled={candidate.status === 'Approved'}
                        title="Approve Candidate"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.085a2 2 0 00-1.736.97l-2.714 4.222a2 2 0 01-1.453 1.052H5a2 2 0 00-2 2v7a2 2 0 002 2h2.5" /></svg>
                      </button>
                      <button 
                        onClick={() => handleStatusUpdate(candidate._id, 'Rejected')}
                        className="p-2 text-red-500 rounded-full hover:bg-red-100 disabled:opacity-40 disabled:hover:bg-transparent"
                        disabled={candidate.status === 'Rejected'}
                        title="Reject Candidate"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.738 3h4.017c.163 0 .326.02.485.06L17 4m-7 10v5a2 2 0 002 2h.085a2 2 0 001.736-.97l2.714-4.222a2 2 0 011.453-1.052H19a2 2 0 002-2v-7a2 2 0 00-2-2h-2.5" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HistoryDetailPage;

// frontend/src/pages/HistoryDetailPage.jsx
import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useParams, Link } from 'react-router-dom';

// --- Comprehensive Candidate Detail Modal ---
const CandidateDetailModal = ({ batchId, candidate, onClose, onSaveSuccess }) => {
    if (!candidate) return null;

    const [notes, setNotes] = useState(candidate.notes || '');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (candidate) {
            setNotes(candidate.notes || '');
        }
    }, [candidate]);

    const handleSaveNotes = async () => {
        setIsSaving(true);
        try {
            // --- CRITICAL FIX: Correct the API endpoint URL ---
            const res = await axios.put(`/api/jobs/${batchId}/candidate/${candidate._id}/notes`, { notes });
            onSaveSuccess(res.data); // Pass the updated batch data back to the parent
        } catch (error) {
            console.error("Failed to save notes", error);
        } finally {
            setIsSaving(false);
        }
    };

    const SkillBadge = ({ skill, type }) => {
        const styles = {
          matched: 'bg-green-100 text-green-800',
          missing: 'bg-red-100 text-red-800',
        };
        return <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full mr-2 mb-2 ${styles[type]}`}>{skill}</span>;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 animate-fade-in-fast">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center mb-6 pb-4 border-b">
                    <h2 className="text-2xl font-bold text-gray-800">{candidate.fileName}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-800 text-3xl">&times;</button>
                </div>
                
                <div className="overflow-y-auto pr-4 flex-grow">
                    <div className="mb-6">
                        <h3 className="font-bold text-lg text-gray-800">Recruiter's Summary</h3>
                        <p className="text-gray-600 mt-2 bg-gray-50 p-4 rounded-md">{candidate.summary}</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <h3 className="font-bold text-lg text-gray-800">Matched Skills ({candidate.matchedSkills.length})</h3>
                            <div className="mt-2 flex flex-wrap">
                                {candidate.matchedSkills.length > 0 ? candidate.matchedSkills.map(skill => <SkillBadge key={skill} skill={skill} type="matched" />) : <p className="text-sm text-gray-500">None found.</p>}
                            </div>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-gray-800">Missing Skills ({candidate.missingSkills.length})</h3>
                            <div className="mt-2 flex flex-wrap">
                                {candidate.missingSkills.length > 0 ? candidate.missingSkills.map(skill => <SkillBadge key={skill} skill={skill} type="missing" />) : <p className="text-sm text-gray-500">None found.</p>}
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-gray-800">My Notes</h3>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows="4"
                            className="w-full mt-2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            placeholder="Add your screening notes here..."
                        ></textarea>
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t flex justify-end">
                    <button 
                        onClick={handleSaveNotes}
                        disabled={isSaving}
                        className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400"
                    >
                        {isSaving ? 'Saving...' : 'Save Notes'}
                    </button>
                </div>
            </div>
        </div>
    );
};


const HistoryDetailPage = () => {
  const { id } = useParams();
  const [batch, setBatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(null);

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
    try {
      const res = await axios.put(`/api/jobs/${id}/candidate/${candidateId}`, { status: newStatus });
      setBatch(res.data);
    } catch (err) {
      setError('Failed to update status. Please try again.');
    }
  };

  const handleSaveSuccess = (updatedBatch) => {
    setBatch(updatedBatch);
    // Find the updated candidate data and refresh the modal's state
    const updatedSelectedCandidate = updatedBatch.rankedCandidates.find(
        c => c._id === selectedCandidate._id
    );
    setSelectedCandidate(updatedSelectedCandidate);
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
    <>
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
        <div className="mb-6">
          <Link to="/history" className="text-indigo-600 hover:underline flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
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
                        <div className="w-24 bg-gray-200 rounded-full h-2.5"><div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${candidate.matchScore}%` }}></div></div>
                        <span className="font-bold text-indigo-600 ml-3">{candidate.matchScore}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4"><StatusBadge status={candidate.status} /></td>
                    <td className="py-4 px-4">
                      <div className="flex justify-center items-center space-x-2">
                        <button onClick={() => setSelectedCandidate(candidate)} className="text-indigo-600 hover:underline text-sm font-semibold">View / Edit</button>
                        <div className="flex space-x-1">
                            <button onClick={() => handleStatusUpdate(candidate._id, 'Approved')} className="p-2 text-green-500 rounded-full hover:bg-green-100 disabled:opacity-40" disabled={candidate.status === 'Approved'} title="Approve"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /></svg></button>
                            <button onClick={() => handleStatusUpdate(candidate._id, 'Rejected')} className="p-2 text-red-500 rounded-full hover:bg-red-100 disabled:opacity-40" disabled={candidate.status === 'Rejected'} title="Reject"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg></button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <CandidateDetailModal 
        batchId={id}
        candidate={selectedCandidate} 
        onClose={() => setSelectedCandidate(null)}
        onSaveSuccess={handleSaveSuccess}
      />
    </>
  );
};

export default HistoryDetailPage;

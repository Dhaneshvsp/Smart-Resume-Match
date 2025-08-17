// frontend/src/pages/DashboardPage.jsx
import React, { useState } from 'react';
import axios from '../api/axios'; // CRITICAL: Use the custom axios instance
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const [resumes, setResumes] = useState([]);
  const [jobDescription, setJobDescription] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [rankedResults, setRankedResults] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onFileChange = (e) => {
    setResumes(Array.from(e.target.files));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (resumes.length === 0 || !jobDescription || !jobTitle) {
      setError('Please provide a job title, description, and at least one resume.');
      return;
    }
    setLoading(true);
    setError('');
    setRankedResults([]);
    setSelectedCandidate(null);
    const formData = new FormData();
    formData.append('jobDescription', jobDescription);
    resumes.forEach(resume => formData.append('resumes', resume));
    try {
      const matchRes = await axios.post('/api/match', formData, { 
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 180000 // 3 minutes timeout for sleepy services
      });
      setRankedResults(matchRes.data);
      const batchToSave = { jobTitle, jobDescription, rankedCandidates: matchRes.data };
      await axios.post('/api/jobs', batchToSave);
    } catch (err) {
      if (axios.isCancel(err)) {
        setError('The request was canceled.');
      } else if (err.code === 'ECONNABORTED') {
        setError('The analysis is taking too long and timed out. This can happen on free services. Please try again in a minute.');
      } else {
        setError(err.response?.data?.msg || 'An error occurred during analysis.');
      }
    } finally {
      setLoading(false);
    }
  };

  const RankedList = ({ results }) => (
    <div className="bg-white p-6 rounded-lg shadow-md mt-8 animate-fade-in-up">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Ranked Candidate List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 uppercase tracking-wider">Rank</th>
              <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 uppercase tracking-wider">Resume File</th>
              <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 uppercase tracking-wider">Match Score</th>
              <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {results.map((candidate, index) => (
              <tr key={index} className="hover:bg-gray-50">
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
                  <button
                    onClick={() => setSelectedCandidate(candidate)}
                    className="bg-indigo-100 text-indigo-700 text-sm font-semibold py-1 px-3 rounded-full hover:bg-indigo-200 transition-colors"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const AnalysisModal = ({ candidate, onClose }) => {
    if (!candidate) return null;
    const SkillBadge = ({ skill, type }) => {
      const styles = {
        matched: 'bg-green-100 text-green-800',
        missing: 'bg-red-100 text-red-800',
      };
      return <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full mr-2 mb-2 ${styles[type]}`}>{skill}</span>;
    };
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 animate-fade-in-fast">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl max-h-full overflow-y-auto">
          <div className="flex justify-between items-center mb-6 pb-4 border-b">
            <h2 className="text-2xl font-bold text-gray-800">{candidate.fileName}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-800 text-3xl">&times;</button>
          </div>
          <div className="mb-6">
            <h3 className="font-bold text-lg text-gray-800">Recruiter's Summary</h3>
            <p className="text-gray-600 mt-2 bg-gray-50 p-4 rounded-md">{candidate.summary}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
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
        </div>
      </div>
    );
  };
  
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <Link to="/dashboard" className="text-indigo-600 hover:underline mb-4 inline-flex items-center text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
            Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">Start a New Analysis</h1>
        <p className="text-gray-600 mt-1">Upload multiple resumes to rank them against a single job description.</p>
      </div>
      
      <div className="bg-white p-8 rounded-lg shadow-md">
        <form onSubmit={onSubmit}>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="jobTitle">Job Title</label>
                <input type="text" id="jobTitle" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} className="w-full px-4 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" placeholder="e.g., Senior React Developer" />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="jobDescription">Job Description</label>
                <textarea id="jobDescription" rows="12" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} className="w-full px-4 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" placeholder="Paste the full job description here..."></textarea>
              </div>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Upload Resumes</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="resumes" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                      <span>Upload files</span>
                      <input id="resumes" name="resumes" type="file" className="sr-only" multiple accept=".pdf" onChange={onFileChange} />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PDF files up to 10MB</p>
                </div>
              </div>
              {resumes.length > 0 && (
                <div className="mt-4 border-t pt-4">
                    <h4 className="font-semibold text-gray-700">Selected files ({resumes.length}):</h4>
                    <ul className="mt-2 list-disc list-inside text-sm text-gray-600 max-h-32 overflow-y-auto">
                        {resumes.map(r => <li key={r.name}>{r.name}</li>)}
                    </ul>
                </div>
              )}
            </div>
          </div>
          <div className="mt-8 border-t pt-5">
            <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors flex items-center justify-center">
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Analyzing {resumes.length} Resumes...
                </>
              ) : 'Rank & Save Candidates'}
            </button>
            {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}
          </div>
        </form>
      </div>
      
      {rankedResults.length > 0 && <RankedList results={rankedResults} />}

      <AnalysisModal candidate={selectedCandidate} onClose={() => setSelectedCandidate(null)} />
    </div>
  );
};

export default DashboardPage;

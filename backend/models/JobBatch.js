// backend/models/JobBatch.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CandidateSchema = new Schema({
  fileName: { type: String, required: true },
  matchScore: { type: Number, required: true },
  summary: { type: String },
  matchedSkills: [String],
  missingSkills: [String],
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
  // --- NEW FIELD ---
  notes: {
    type: String,
    default: '',
  },
});

const JobBatchSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  jobDescription: {
    type: String,
    required: true,
  },
  jobTitle: {
    type: String,
    default: 'Untitled Job Analysis'
  },
  rankedCandidates: [CandidateSchema],
  analysisDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('jobBatch', JobBatchSchema);

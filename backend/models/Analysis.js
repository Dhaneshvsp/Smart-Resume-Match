// backend/models/Analysis.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnalysisSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  resumeFileName: {
    type: String,
    required: true,
  },
  matchScore: {
    type: Number,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  matchedSkills: {
    type: [String],
  },
  missingSkills: {
    type: [String],
  },
  analysisDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('analysis', AnalysisSchema);

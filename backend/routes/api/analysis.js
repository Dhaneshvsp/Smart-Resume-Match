// backend/routes/api/analysis.js
const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth.middleware');
const Analysis = require('../../models/Analysis');

// @route   POST api/analysis
// @desc    Save a new analysis result
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const {
      resumeFileName,
      matchScore,
      summary,
      matchedSkills,
      missingSkills,
    } = req.body;

    const newAnalysis = new Analysis({
      user: req.user.id,
      resumeFileName,
      matchScore,
      summary,
      matchedSkills,
      missingSkills,
    });

    const analysis = await newAnalysis.save();
    res.json(analysis);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/analysis
// @desc    Get all analyses for the logged-in user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const analyses = await Analysis.find({ user: req.user.id }).sort({
      analysisDate: -1,
    });
    res.json(analyses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

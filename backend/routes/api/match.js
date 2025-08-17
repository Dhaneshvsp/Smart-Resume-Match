// backend/routes/api/match.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdf = require('pdf-parse');
const auth = require('../../middleware/auth.middleware');
const fetch = require('node-fetch');
const JobBatch = require('../../models/JobBatch'); // Import the JobBatch model

const upload = multer({ storage: multer.memoryStorage() }).array('resumes', 20);

// @route   POST api/match
// @desc    Analyze multiple resumes, using past feedback to improve scoring
// @access  Private
router.post('/', [auth, upload], async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ msg: 'At least one resume file is required.' });
    }
    const { jobDescription } = req.body;
    if (!jobDescription) {
      return res.status(400).json({ msg: 'Job description is required.' });
    }

    // --- NEW: Step 1 - Find Recruiter's Preferred Skills ---
    const previousBatches = await JobBatch.find({ user: req.user.id });
    const validatedSkills = new Set();

    previousBatches.forEach(batch => {
      batch.rankedCandidates.forEach(candidate => {
        if (candidate.status === 'Approved') {
          candidate.matchedSkills.forEach(skill => validatedSkills.add(skill));
        }
      });
    });

    const nlpServiceUrl = 'http://127.0.0.1:5001/analyze';
    const analysisPromises = [];

    for (const file of req.files) {
      const analysisPromise = new Promise(async (resolve, reject) => {
        try {
          const data = await pdf(file.buffer);
          const resumeText = data.text;

          // --- UPDATED: Step 2 - Send Preferred Skills to NLP Service ---
          const payload = {
            resume_text: resumeText,
            jd_text: jobDescription,
            validated_skills: [...validatedSkills], // Pass the list of preferred skills
          };

          const nlpResponse = await fetch(nlpServiceUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });

          if (!nlpResponse.ok) {
            return reject(`Failed to analyze ${file.originalname}`);
          }

          const analysisJson = await nlpResponse.json();
          
          resolve({
            fileName: file.originalname,
            ...analysisJson,
          });

        } catch (error) {
          reject(`Error processing ${file.originalname}: ${error.message}`);
        }
      });
      analysisPromises.push(analysisPromise);
    }

    const results = await Promise.all(analysisPromises);
    const rankedResults = results.sort((a, b) => b.matchScore - a.matchScore);
    
    res.json(rankedResults);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

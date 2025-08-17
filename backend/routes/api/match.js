// backend/routes/api/match.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdf = require('pdf-parse');
const auth = require('../../middleware/auth.middleware');
const fetch = require('node-fetch');
const JobBatch = require('../../models/JobBatch');

const upload = multer({ storage: multer.memoryStorage() }).array('resumes', 20);

router.post('/', [auth, upload], async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ msg: 'At least one resume file is required.' });
    }
    const { jobDescription } = req.body;
    if (!jobDescription) {
      return res.status(400).json({ msg: 'Job description is required.' });
    }

    const nlpServiceUrl = process.env.NLP_SERVICE_URL || 'http://127.0.0.1:5001/analyze';
    console.log(`Connecting to NLP Service at: ${nlpServiceUrl}`);

    const previousBatches = await JobBatch.find({ user: req.user.id });
    const validatedSkills = new Set();
    previousBatches.forEach(batch => {
      batch.rankedCandidates.forEach(candidate => {
        if (candidate.status === 'Approved') {
          candidate.matchedSkills.forEach(skill => validatedSkills.add(skill));
        }
      });
    });

    // --- UPDATED: Process resumes sequentially instead of in parallel ---
    const results = [];
    for (const file of req.files) {
      console.log(`Processing file: ${file.originalname}`);
      try {
        const data = await pdf(file.buffer);
        const resumeText = data.text;

        const payload = {
          resume_text: resumeText,
          jd_text: jobDescription,
          validated_skills: [...validatedSkills],
        };

        const nlpResponse = await fetch(nlpServiceUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!nlpResponse.ok) {
          console.error(`NLP Service failed for ${file.originalname}`);
          // We can choose to skip this file and continue
          continue; 
        }

        const analysisJson = await nlpResponse.json();
        results.push({
          fileName: file.originalname,
          ...analysisJson,
        });

      } catch (error) {
        console.error(`Error processing ${file.originalname}:`, error);
      }
    }

    const rankedResults = results.sort((a, b) => b.matchScore - a.matchScore);
    
    res.json(rankedResults);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

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
  console.log('--- BACKEND: /api/match route initiated ---');
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ msg: 'At least one resume file is required.' });
    }
    const { jobDescription } = req.body;
    if (!jobDescription) {
      return res.status(400).json({ msg: 'Job description is required.' });
    }

    const nlpServiceUrl = process.env.NLP_SERVICE_URL || 'http://127.0.0.1:5001/analyze';
    console.log(`BACKEND: Connecting to NLP Service at: ${nlpServiceUrl}`);

    const previousBatches = await JobBatch.find({ user: req.user.id });
    const validatedSkills = new Set();
    previousBatches.forEach(batch => {
      batch.rankedCandidates.forEach(candidate => {
        if (candidate.status === 'Approved') {
          candidate.matchedSkills.forEach(skill => validatedSkills.add(skill));
        }
      });
    });
    console.log(`BACKEND: Found ${validatedSkills.size} previously validated skills.`);

    const results = [];
    for (const file of req.files) {
      console.log(`BACKEND: Processing file: ${file.originalname}`);
      try {
        const data = await pdf(file.buffer);
        const resumeText = data.text;
        
        // --- CRITICAL LOG: Check if text extraction is working ---
        console.log(`BACKEND: Extracted ${resumeText.length} characters from ${file.originalname}.`);
        
        if (resumeText.length === 0) {
            console.log(`BACKEND: WARNING - No text extracted from ${file.originalname}. Skipping.`);
            continue;
        }

        const payload = {
          resume_text: resumeText,
          jd_text: jobDescription,
          validated_skills: [...validatedSkills],
        };
        
        console.log(`BACKEND: Sending payload to NLP service for ${file.originalname}.`);
        
        const nlpResponse = await fetch(nlpServiceUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          timeout: 180000 // 3 minute timeout
        });

        if (!nlpResponse.ok) {
          const errorBody = await nlpResponse.text();
          console.error(`BACKEND: NLP Service returned an error for ${file.originalname}: ${errorBody}`);
          continue;
        }

        const analysisJson = await nlpResponse.json();
        console.log(`BACKEND: Received analysis from NLP service for ${file.originalname}. Score: ${analysisJson.matchScore}`);
        results.push({
          fileName: file.originalname,
          ...analysisJson,
        });

      } catch (error) {
        console.error(`BACKEND: CRITICAL ERROR processing ${file.originalname}:`, error);
      }
    }

    console.log(`BACKEND: Total results processed: ${results.length}`);
    const rankedResults = results.sort((a, b) => b.matchScore - a.matchScore);
    
    console.log('--- BACKEND: /api/match route finished. Sending ranked list. ---');
    res.json(rankedResults);

  } catch (err) {
    console.error('BACKEND: Unhandled exception in /api/match route:', err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

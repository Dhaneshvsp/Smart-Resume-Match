// backend/routes/api/jobs.js
const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth.middleware');
const JobBatch = require('../../models/JobBatch');

// @route   POST api/jobs
// @desc    Save a new job batch analysis
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { jobDescription, jobTitle, rankedCandidates } = req.body;

    const newJobBatch = new JobBatch({
      user: req.user.id,
      jobDescription,
      jobTitle,
      rankedCandidates,
    });

    const jobBatch = await newJobBatch.save();
    res.json(jobBatch);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/jobs
// @desc    Get all job batches for the logged-in user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const jobBatches = await JobBatch.find({ user: req.user.id }).sort({
      analysisDate: -1,
    });
    res.json(jobBatches);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/jobs/:id
// @desc    Get a single job batch by its ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
      const jobBatch = await JobBatch.findById(req.params.id);
  
      if (!jobBatch) {
        return res.status(404).json({ msg: 'Analysis not found' });
      }
  
      // Ensure the user owns this job batch
      if (jobBatch.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'User not authorized' });
      }
  
      res.json(jobBatch);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

// @route   PUT api/jobs/:batchId/candidate/:candidateId
// @desc    Update a candidate's status
// @access  Private
router.put('/:batchId/candidate/:candidateId', auth, async (req, res) => {
  try {
    const { status } = req.body;

    // Validate status
    if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ msg: 'Invalid status value.' });
    }

    const jobBatch = await JobBatch.findById(req.params.batchId);

    if (!jobBatch) {
      return res.status(404).json({ msg: 'Analysis batch not found.' });
    }

    // Ensure user owns the batch
    if (jobBatch.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized.' });
    }

    const candidate = jobBatch.rankedCandidates.id(req.params.candidateId);

    if (!candidate) {
      return res.status(404).json({ msg: 'Candidate not found in this batch.' });
    }

    // Update the status and save the document
    candidate.status = status;
    await jobBatch.save();

    res.json(jobBatch); // Return the updated job batch
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- NEW ROUTE ---
// @route   PUT api/jobs/:batchId/candidate/:candidateId/notes
// @desc    Add or update recruiter notes for a candidate
// @access  Private
router.put('/:batchId/candidate/:candidateId/notes', auth, async (req, res) => {
    try {
      const { notes } = req.body;
  
      const jobBatch = await JobBatch.findById(req.params.batchId);
  
      if (!jobBatch) {
        return res.status(404).json({ msg: 'Analysis batch not found.' });
      }
  
      // Ensure user owns the batch
      if (jobBatch.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'User not authorized.' });
      }
  
      const candidate = jobBatch.rankedCandidates.id(req.params.candidateId);
  
      if (!candidate) {
        return res.status(404).json({ msg: 'Candidate not found in this batch.' });
      }
  
      // Update the notes and save the document
      candidate.notes = notes;
      await jobBatch.save();
  
      res.json(jobBatch); // Return the updated job batch
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

module.exports = router;

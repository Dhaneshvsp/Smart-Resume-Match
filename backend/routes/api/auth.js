// backend/routes/api/auth.js

const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth.middleware');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const fetch = require('node-fetch'); // Ensure node-fetch is installed

// @route   GET api/auth
// @desc    Get authenticated user data
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/auth
// @desc    Authenticate user & get token (Login)
// @access  Public
router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
      }
      const payload = { user: { id: user.id } };
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '5 days' },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   POST api/auth/forgot-password
// @desc    Request a password reset and send email
// @access  Public
router.post('/forgot-password', [
    check('email', 'Please include a valid email').isEmail()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            // For security, we send the same message whether the user exists or not
            return res.json({ msg: 'If an account with that email exists, a password reset link has been sent.' });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        // --- UPDATED: Call the Python Email Service ---
        const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
        const emailServiceUrl = 'http://127.0.0.1:5001/send-email';
        
        const emailPayload = {
            recipient: user.email,
            subject: 'Password Reset Request for Smart Resume Match',
            html_body: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <h2>Password Reset Request</h2>
                    <p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
                    <p>Please click on the following link, or paste this into your browser to complete the process:</p>
                    <p><a href="${resetUrl}" style="background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Your Password</a></p>
                    <p>This link will expire in one hour.</p>
                    <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
                </div>
            `
        };

        const emailResponse = await fetch(emailServiceUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(emailPayload)
        });

        if (!emailResponse.ok) {
            console.error("Failed to send email via Python service.");
            // We don't want to tell the user the email failed, for security reasons.
        }

        res.json({ msg: 'If an account with that email exists, a password reset link has been sent.' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/auth/reset-password/:token
// @desc    Reset the password using a token
// @access  Public
router.post('/reset-password/:token', [
    check('password', 'Please enter a new password with 6 or more characters').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ errors: [{ msg: 'Password reset token is invalid or has expired.' }] });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ msg: 'Your password has been updated successfully.' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

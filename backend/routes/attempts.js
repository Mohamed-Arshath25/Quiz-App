const express = require('express');
const router = express.Router();
const { createAttempt, getUserAttempts, getAllAttempts } = require('../controllers/attemptController');
const { auth, adminAuth } = require('../middleware/auth');

router.post('/', auth, createAttempt);
router.get('/me', auth, getUserAttempts);
router.get('/', adminAuth, getAllAttempts);

module.exports = router;

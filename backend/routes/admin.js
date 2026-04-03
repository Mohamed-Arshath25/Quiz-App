const express = require('express');
const router = express.Router();
const { getUsers, getQuestions, deleteQuestion, getStats } = require('../controllers/adminController');
const { adminAuth } = require('../middleware/auth');

router.get('/users', adminAuth, getUsers);
router.get('/questions', adminAuth, getQuestions);
router.delete('/questions/:id', adminAuth, deleteQuestion);
router.get('/stats', adminAuth, getStats);

module.exports = router;
const express = require('express');
const router = express.Router();
const { generateQuiz, getQuizzes } = require('../controllers/quizController');
const { auth } = require('../middleware/auth');

router.post('/generate-ai-quiz', auth, generateQuiz);
router.get('/:category', auth, getQuizzes);

module.exports = router;
const User = require('../models/User');
const Question = require('../models/Question');
const Attempt = require('../models/Attempt');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: 'Question deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getStats = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const questionCount = await Question.countDocuments();
    const attemptCount = await Attempt.countDocuments();
    res.json({ userCount, questionCount, attemptCount });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
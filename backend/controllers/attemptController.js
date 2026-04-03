const Attempt = require('../models/Attempt');

exports.createAttempt = async (req, res) => {
  try {
    const { score, answers } = req.body;

    if (typeof score !== 'number' || !Array.isArray(answers)) {
      return res.status(400).json({ message: 'Invalid attempt payload' });
    }

    const attempt = new Attempt({
      userId: req.user.user.id,
      score,
      answers,
      date: new Date(),
    });

    await attempt.save();

    res.status(201).json(attempt);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getUserAttempts = async (req, res) => {
  try {
    const attempts = await Attempt.find({ userId: req.user.user.id }).sort({ createdAt: -1 });
    res.json(attempts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getAllAttempts = async (req, res) => {
  try {
    const attempts = await Attempt.find().populate('userId', 'name email').sort({ createdAt: -1 });
    res.json(attempts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

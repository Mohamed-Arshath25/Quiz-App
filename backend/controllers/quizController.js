const mongoose = require('mongoose');
const Question = require('../models/Question');

const FALLBACK_TOPICS = {
  science: ['experiment', 'hypothesis', 'observation', 'evidence'],
  math: ['equation', 'number pattern', 'calculation', 'problem solving'],
  history: ['timeline', 'historical event', 'primary source', 'past society'],
  geography: ['map', 'location', 'climate', 'landform'],
  biology: ['cell', 'organism', 'adaptation', 'ecosystem'],
  physics: ['force', 'motion', 'energy', 'measurement'],
  chemistry: ['atom', 'reaction', 'element', 'compound'],
  computer: ['algorithm', 'program', 'data', 'logic'],
  javascript: ['function', 'variable', 'array', 'event'],
  node: ['server', 'runtime', 'module', 'API'],
  english: ['grammar', 'reading', 'vocabulary', 'writing'],
};

let geminiClientPromise;

async function getGeminiClient() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Missing GEMINI_API_KEY');
  }

  if (!geminiClientPromise) {
    geminiClientPromise = import('@google/genai').then(({ GoogleGenAI }) => {
      return new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
      });
    });
  }

  return geminiClientPromise;
}

function buildFallbackQuiz(topic) {
  const normalizedTopic = topic.trim();
  const lowerTopic = normalizedTopic.toLowerCase();
  const matchedKey = Object.keys(FALLBACK_TOPICS).find((key) => lowerTopic.includes(key));
  const keywords = matchedKey
    ? FALLBACK_TOPICS[matchedKey]
    : ['core idea', 'key concept', 'practical use', 'main example'];

  const safeTopic = normalizedTopic || 'this topic';

  return [
    {
      question: `What is the main focus of "${safeTopic}"?`,
      options: [
        `Understanding the basic ideas of ${safeTopic}`,
        `Ignoring all examples of ${safeTopic}`,
        `Memorizing random facts not related to ${safeTopic}`,
        `Avoiding practice completely`,
      ],
      correctAnswer: `Understanding the basic ideas of ${safeTopic}`,
      image: '',
      category: topic,
    },
    {
      question: `Which word is most closely connected with "${safeTopic}"?`,
      options: [keywords[0], 'recipe', 'planet ring', 'traffic signal'],
      correctAnswer: keywords[0],
      image: '',
      category: topic,
    },
    {
      question: `Which activity would best help a student learn "${safeTopic}"?`,
      options: [
        `Reviewing examples and practicing ${safeTopic}`,
        'Skipping the lesson entirely',
        'Choosing answers at random',
        'Studying an unrelated subject only',
      ],
      correctAnswer: `Reviewing examples and practicing ${safeTopic}`,
      image: '',
      category: topic,
    },
    {
      question: `Why is "${safeTopic}" useful to study?`,
      options: [
        `It builds understanding of ${keywords[1]} and related ideas`,
        'It removes the need to think carefully',
        'It guarantees every answer will be the same',
        'It has no connection to learning at all',
      ],
      correctAnswer: `It builds understanding of ${keywords[1]} and related ideas`,
      image: '',
      category: topic,
    },
    {
      question: `Which question best fits the topic "${safeTopic}"?`,
      options: [
        `How does ${safeTopic} work in a real example?`,
        'What color is silence?',
        'Why do numbers sleep at night?',
        'How many clouds fit inside a pencil?',
      ],
      correctAnswer: `How does ${safeTopic} work in a real example?`,
      image: '',
      category: topic,
    },
  ];
}

function normalizeQuestion(question, topic) {
  if (!question || typeof question !== 'object') {
    return null;
  }

  const cleanQuestion = typeof question.question === 'string' ? question.question.trim() : '';
  const cleanOptions = Array.isArray(question.options)
    ? question.options
        .filter((option) => typeof option === 'string')
        .map((option) => option.trim())
        .filter(Boolean)
    : [];
  const cleanCorrectAnswer =
    typeof question.correctAnswer === 'string' ? question.correctAnswer.trim() : '';

  if (!cleanQuestion || cleanOptions.length !== 4 || !cleanCorrectAnswer) {
    return null;
  }

  if (!cleanOptions.includes(cleanCorrectAnswer)) {
    return null;
  }

  return {
    question: cleanQuestion,
    options: cleanOptions,
    correctAnswer: cleanCorrectAnswer,
    image: typeof question.image === 'string' ? question.image : '',
    category: topic,
  };
}

function parseQuizResponse(rawText, topic) {
  if (typeof rawText !== 'string' || !rawText.trim()) {
    throw new Error('Empty Gemini response');
  }

  const match = rawText.match(/\[.*\]/s);
  if (!match) {
    throw new Error('No JSON array found in Gemini response');
  }

  const parsed = JSON.parse(match[0]);
  if (!Array.isArray(parsed)) {
    throw new Error('Gemini response is not an array');
  }

  const normalized = parsed
    .map((question) => normalizeQuestion(question, topic))
    .filter(Boolean);

  if (!normalized.length) {
    throw new Error('No valid quiz questions found in Gemini response');
  }

  return normalized;
}

async function generateQuizWithGemini(topic) {
  const ai = await getGeminiClient();
  const prompt = `Generate 5 MCQ questions about "${topic}"

STRICT RULES:
- Return ONLY JSON array
- No explanation
- Format:
[
  {
    "question": "",
    "options": ["A","B","C","D"],
    "correctAnswer": ""
  }
]`;

  const response = await ai.models.generateContent({
    model: 'gemini-1.5-flash',
    contents: prompt,
  });

  const rawText = response?.text || '';
  console.log('[Gemini] raw response:', rawText);

  return parseQuizResponse(rawText, topic);
}

async function saveQuestions(questions, topic) {
  if (mongoose.connection.readyState !== 1) {
    console.error('[generateQuiz] skipping save because MongoDB is not connected');
    return;
  }

  for (const question of questions) {
    try {
      await Question.create({
        question: question.question,
        options: question.options,
        correctAnswer: question.correctAnswer,
        image: question.image || '',
        category: topic,
      });
    } catch (dbError) {
      console.error('[generateQuiz] failed to save question', dbError);
    }
  }
}

exports.generateQuiz = async (req, res) => {
  const topic = typeof req.body?.topic === 'string' ? req.body.topic.trim() : '';

  if (!topic) {
    return res.status(400).json({ message: 'Topic is required' });
  }

  let questions = buildFallbackQuiz(topic);

  try {
    questions = await generateQuizWithGemini(topic);
  } catch (error) {
    console.error('[generateQuiz] Gemini error', error);
  }

  await saveQuestions(questions, topic);

  return res.json(
    questions.map((question) => ({
      question: question.question,
      options: question.options,
      correctAnswer: question.correctAnswer,
      image: question.image || '',
    }))
  );
};

exports.getQuizzes = async (req, res) => {
  try {
    const questions = await Question.find({ category: req.params.category });
    res.json(questions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

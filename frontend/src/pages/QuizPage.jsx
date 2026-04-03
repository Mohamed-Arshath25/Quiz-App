import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import correctIcon from '../../../assets/icons/icon-correct.svg';
import nextIcon from '../../../assets/icons/icon-next.svg';
import timerIcon from '../../../assets/icons/icon-timer.svg';
import wrongIcon from '../../../assets/icons/icon-wrong.svg';
import quizIllustration from '../../../assets/illustrations/quiz-illustration.svg';
import { authAxios } from '../context/AuthContext';

const QuizPage = () => {
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [error, setError] = useState('');

  useEffect(() => {
    const quizData = localStorage.getItem('quizData');
    if (!quizData) {
      navigate('/dashboard');
      return;
    }
    setQuiz(JSON.parse(quizData));
  }, [navigate]);

  useEffect(() => {
    if (!quiz) {
      return undefined;
    }

    if (timeLeft <= 0) {
      finishQuiz();
      return undefined;
    }

    const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [quiz, timeLeft]);

  const currentQuestion = useMemo(() => quiz?.questions?.[index], [quiz, index]);
  const selectedAnswer = answers[index];
  const selectedIsCorrect = selectedAnswer?.correct;

  const chooseAnswer = (option) => {
    const nextAnswers = [...answers];
    nextAnswers[index] = {
      question: currentQuestion.question,
      selected: option,
      correct: option === currentQuestion.correctAnswer,
      correctAnswer: currentQuestion.correctAnswer,
    };
    setAnswers(nextAnswers);
  };

  const next = () => {
    if (index + 1 < quiz.questions.length) {
      setIndex(index + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    if (!quiz) {
      return;
    }

    const score = answers.filter((answer) => answer?.correct).length;
    const currentAttempt = {
      score,
      answers,
      topic: quiz.topic,
      completedAt: new Date().toISOString(),
    };

    localStorage.setItem('currentAttempt', JSON.stringify(currentAttempt));

    try {
      await authAxios.post('/attempts', { score, answers });
    } catch (err) {
      console.error('Attempt save failed', err);
    }

    setIsFinished(true);
    navigate('/result');
  };

  if (!quiz) {
    return <p className="text-white p-6">Loading quiz...</p>;
  }

  if (isFinished) {
    return <p className="text-white p-6">Quiz complete. Redirecting...</p>;
  }

  return (
    <div className="min-h-screen p-4 lg:p-6">
      <div className="glass-card p-6 lg:p-8 max-w-6xl mx-auto rounded-[32px] overflow-hidden">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="rounded-[28px] border border-white/10 bg-slate-950/35 p-5">
            <img src={quizIllustration} alt="Quiz illustration" className="w-full max-w-sm mx-auto" />

            <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Topic</p>
                <p className="mt-1 text-white font-semibold">{quiz.topic}</p>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-slate-900/70 px-3 py-2">
                <img src={timerIcon} alt="" className="asset-icon-lg" />
                <span className="text-sm text-white font-semibold">
                  {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                </span>
              </div>
            </div>

            {selectedAnswer && (
              <div className={`mt-4 rounded-2xl border p-4 ${selectedIsCorrect ? 'border-emerald-400/20 bg-emerald-500/10' : 'border-rose-400/20 bg-rose-500/10'}`}>
                <div className="flex items-center gap-3">
                  <img src={selectedIsCorrect ? correctIcon : wrongIcon} alt="" className="asset-icon-lg" />
                  <div>
                    <p className="font-semibold text-white">{selectedIsCorrect ? 'Great choice' : 'Not quite right'}</p>
                    <p className="text-sm text-slate-300">
                      {selectedIsCorrect ? 'You selected the correct answer.' : `Correct answer: ${currentQuestion.correctAnswer}`}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </section>

          <section>
            <div className="flex flex-wrap gap-4 justify-between items-center mb-5">
              <div>
                <p className="text-sm text-slate-300">Question {index + 1} of {quiz.questions.length}</p>
                <h1 className="text-3xl text-white font-bold mt-2">{currentQuestion.question}</h1>
              </div>
            </div>

            {error && <p className="text-red-300 mb-3">{error}</p>}

            {currentQuestion.image && (
              <img src={currentQuestion.image} alt="Question illustration" className="w-full h-64 object-cover rounded-3xl mb-5" />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentQuestion.options.map((option) => {
                const isSelected = selectedAnswer?.selected === option;
                const revealCorrect = selectedAnswer && option === currentQuestion.correctAnswer;

                return (
                  <button
                    key={option}
                    onClick={() => chooseAnswer(option)}
                    className={`p-4 rounded-2xl text-left border transition ${
                      revealCorrect
                        ? 'bg-emerald-500/15 border-emerald-400/30'
                        : isSelected
                          ? 'bg-purple-600/40 border-purple-300/40'
                          : 'bg-slate-900/75 border-white/10 hover:bg-white/5'
                    } text-white`}
                  >
                    <span className="font-medium">{option}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={next}
                className="inline-flex items-center gap-3 px-5 py-3 text-white bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-2xl font-semibold hover:opacity-90"
              >
                <img src={nextIcon} alt="" className="asset-icon" />
                {index + 1 < quiz.questions.length ? 'Next Question' : 'Finish Quiz'}
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-5 py-3 text-white bg-slate-700/80 rounded-2xl border border-white/10"
              >
                Cancel
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;

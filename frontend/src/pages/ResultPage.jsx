import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import aiQuizIllustration from '../../../assets/illustrations/ai-quiz.svg';
import correctIcon from '../../../assets/icons/icon-correct.svg';
import wrongIcon from '../../../assets/icons/icon-wrong.svg';

const ResultPage = () => {
  const [attempt, setAttempt] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('currentAttempt');
    if (!saved) {
      navigate('/dashboard');
      return;
    }
    setAttempt(JSON.parse(saved));
  }, [navigate]);

  const summary = useMemo(() => {
    if (!attempt) {
      return { wrong: 0, total: 0, accuracy: 0 };
    }

    const total = attempt.answers.length;
    const correct = attempt.score;
    return {
      wrong: total - correct,
      total,
      accuracy: total ? Math.round((correct / total) * 100) : 0,
    };
  }, [attempt]);

  if (!attempt) {
    return null;
  }

  return (
    <div className="min-h-screen p-4 lg:p-6 flex items-center justify-center">
      <div className="glass-card p-6 lg:p-8 w-full max-w-6xl rounded-[32px]">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] items-start">
          <section className="rounded-[28px] border border-white/10 bg-slate-950/35 p-5">
            <img src={aiQuizIllustration} alt="AI quiz results illustration" className="w-full max-w-sm mx-auto" />

            <div className="mt-5 space-y-3">
              <h1 className="text-3xl font-bold text-white">Quiz Results</h1>
              <p className="text-slate-300">Topic: {attempt.topic}</p>
              <p className="text-white text-2xl font-semibold">Score: {attempt.score} / {attempt.answers.length}</p>
              <p className="text-sm text-slate-400">Completed: {new Date(attempt.completedAt || Date.now()).toLocaleString()}</p>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Correct</p>
                <p className="mt-2 text-2xl font-bold text-emerald-300">{attempt.score}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Wrong</p>
                <p className="mt-2 text-2xl font-bold text-rose-300">{summary.wrong}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Accuracy</p>
                <p className="mt-2 text-2xl font-bold text-cyan-300">{summary.accuracy}%</p>
              </div>
            </div>
          </section>

          <section>
            <div className="grid gap-3">
              {attempt.answers.map((answer, idx) => (
                <div key={idx} className="p-4 rounded-3xl bg-slate-900/70 border border-white/10">
                  <div className="flex items-start gap-3">
                    <img
                      src={answer.correct ? correctIcon : wrongIcon}
                      alt=""
                      className="asset-icon-lg mt-1"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-purple-100 font-semibold">{idx + 1}. {answer.question}</p>
                      <p className="mt-2 text-slate-300">
                        Selected:{' '}
                        <span className={answer.correct ? 'text-emerald-300' : 'text-rose-300'}>
                          {answer.selected}
                        </span>
                      </p>
                      <p className="text-slate-300">
                        Correct answer:{' '}
                        <span className="text-cyan-300">{answer.correctAnswer || 'unknown'}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white font-semibold"
              >
                Return to Dashboard
              </button>
              <button
                onClick={() => navigate('/quiz')}
                className="px-5 py-3 rounded-2xl bg-slate-700/80 border border-white/10 text-white"
              >
                Review Again
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;

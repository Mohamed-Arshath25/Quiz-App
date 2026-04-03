import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import analyticsIcon from '../../../assets/icons/icon-analytics.svg';
import dashboardIcon from '../../../assets/icons/icon-dashboard.svg';
import generateIcon from '../../../assets/icons/icon-generate.svg';
import quizIcon from '../../../assets/icons/icon-quiz.svg';
import learningIllustration from '../../../assets/illustrations/learning.svg';
import quizIllustration from '../../../assets/illustrations/quiz-illustration.svg';
import Sidebar from '../components/Sidebar';
import { AuthContext, authAxios } from '../context/AuthContext';

const DashboardPage = () => {
  const { user, logout } = useContext(AuthContext);
  const [topic, setTopic] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [performance, setPerformance] = useState({ best: 0, average: 0, total: 0 });
  const navigate = useNavigate();
  const totalQuizzes = stats?.questionCount ?? performance.total;
  const scoreLabel = performance.total ? `${performance.best} best / ${performance.average} avg` : 'No scores yet';
  const recentActivity = attempts.length ? `${attempts.length} recent sessions` : 'No activity yet';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await authAxios.get('/attempts/me');
        setAttempts(res.data);
        if (res.data.length) {
          const scores = res.data.map((attempt) => attempt.score);
          const total = scores.reduce((sum, value) => sum + value, 0);
          setPerformance({
            best: Math.max(...scores),
            average: (total / scores.length).toFixed(1),
            total: res.data.length,
          });
        }

        if (user.role === 'admin') {
          const adminStats = await authAxios.get('/admin/stats');
          setStats(adminStats.data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchStats();
  }, [user]);

  const handleGenerate = async (event) => {
    event.preventDefault();
    if (!topic.trim()) {
      setMessage('Enter a topic to generate');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await authAxios.post('/quizzes/generate-ai-quiz', { topic });
      const quizData = response.data;
      localStorage.setItem('quizData', JSON.stringify({ topic, questions: quizData }));
      localStorage.removeItem('currentAttempt');
      navigate('/quiz');
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || 'Failed to generate quiz. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
      <Sidebar user={user} onLogout={logout} />

      <main className="dashboard-shell space-y-6 rounded-[32px] p-4 lg:p-6">
        <section className="glass-card p-6 lg:p-8 rounded-[32px] overflow-hidden">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-200">
                <img src={dashboardIcon} alt="" className="asset-icon" />
                Quiz AI Dashboard
              </div>
              <h1 className="mt-5 text-3xl lg:text-5xl font-bold text-white leading-tight">
                Clean quiz workflows, clear analytics, and a sharper learning dashboard.
              </h1>
              <p className="mt-4 max-w-2xl text-slate-300 text-base lg:text-lg">
                Welcome back, {user.name}. Build quizzes quickly, track performance, and keep the workspace focused on what matters most.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Current focus</p>
                  <p className="mt-1 text-white font-semibold">{topic || 'Pick your next topic'}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Attempts</p>
                  <p className="mt-1 text-white font-semibold">{performance.total}</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 rounded-[30px] bg-gradient-to-br from-purple-500/25 to-cyan-400/10 blur-3xl" />
              <div className="relative rounded-[30px] border border-white/10 bg-slate-950/35 p-5">
                <img src={learningIllustration} alt="Learning illustration" className="w-full max-w-md mx-auto" />
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-card p-5 rounded-3xl">
            <p className="text-sm text-slate-300">Total Quizzes</p>
            <p className="text-3xl font-bold text-white mt-2">{totalQuizzes}</p>
          </div>
          <div className="glass-card p-5 rounded-3xl">
            <p className="text-sm text-slate-300">Score / Performance</p>
            <p className="text-xl font-bold text-white mt-2">{scoreLabel}</p>
          </div>
          <div className="glass-card p-5 rounded-3xl">
            <p className="text-sm text-slate-300">Recent Activity</p>
            <p className="text-xl font-bold text-white mt-2">{recentActivity}</p>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="glass-card p-6 lg:p-8 rounded-[32px]">
            <div className="flex items-center gap-3 mb-5">
              <img src={generateIcon} alt="" className="asset-icon-lg" />
              <div>
                <h2 className="text-2xl font-semibold text-white">Generate AI Quiz</h2>
                <p className="text-slate-300">A premium generator panel with illustration support and action-driven UI.</p>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_280px] items-center">
              <form onSubmit={handleGenerate} className="space-y-4">
                <input
                  value={topic}
                  onChange={(event) => setTopic(event.target.value)}
                  className="w-full p-4 rounded-2xl border border-white/10 bg-slate-950/70 text-white placeholder:text-slate-500"
                  placeholder="Example: JavaScript arrays, climate change, history of India"
                />
                <button
                  disabled={isLoading}
                  className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-fuchsia-500 font-semibold hover:opacity-90 text-white"
                >
                  <img src={generateIcon} alt="" className="asset-icon" />
                  {isLoading ? 'Generating...' : 'Generate Quiz'}
                </button>
                {message && <p className="text-sm text-red-300">{message}</p>}
              </form>

              <div className="rounded-[28px] bg-slate-950/35 border border-white/10 p-4">
                <img src={quizIllustration} alt="Quiz generator illustration" className="w-full max-w-[240px] mx-auto" />
              </div>
            </div>
          </div>

          <div className="glass-card p-6 rounded-[32px]">
            <div className="flex items-center gap-3 mb-4">
              <img src={analyticsIcon} alt="" className="asset-icon-lg" />
              <div>
                <h2 className="text-xl font-semibold text-white">Performance</h2>
                <p className="text-slate-300 text-sm">Core scoring insights without extra dashboard clutter.</p>
              </div>
            </div>

            <div className="grid gap-3">
              <div className="rounded-2xl p-4 bg-purple-900/25 border border-white/10">
                <p className="text-sm text-purple-200">Attempts</p>
                <p className="text-2xl font-bold text-white">{performance.total}</p>
              </div>
              <div className="rounded-2xl p-4 bg-cyan-900/20 border border-white/10">
                <p className="text-sm text-cyan-200">Best Score</p>
                <p className="text-2xl font-bold text-white">{performance.best}</p>
              </div>
              <div className="rounded-2xl p-4 bg-fuchsia-900/20 border border-white/10">
                <p className="text-sm text-fuchsia-200">Avg Score</p>
                <p className="text-2xl font-bold text-white">{performance.average}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="glass-card p-6 lg:p-8 rounded-[32px]">
          <div className="flex items-center gap-3 mb-4">
            <img src={quizIcon} alt="" className="asset-icon-lg" />
            <div>
              <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
              <p className="text-slate-300 text-sm">The latest completed quizzes in one simple stream.</p>
            </div>
          </div>

          <div className="space-y-3">
            {attempts.length ? (
              attempts.slice(0, 4).map((attempt) => (
                <div key={attempt._id} className="p-4 rounded-2xl bg-slate-950/65 border border-white/10">
                  <p className="text-sm text-purple-200">Score: {attempt.score}</p>
                  <p className="text-xs text-gray-300 mt-1">Date: {new Date(attempt.createdAt).toLocaleString()}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-300 text-sm">No attempts yet.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default DashboardPage;

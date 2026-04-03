import { useContext, useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { AuthContext, authAxios } from '../context/AuthContext';

const AdminPage = () => {
  const { user, logout } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [sRes, uRes, qRes] = await Promise.all([
          authAxios.get('/admin/stats'),
          authAxios.get('/admin/users'),
          authAxios.get('/admin/questions'),
        ]);
        setStats(sRes.data);
        setUsers(uRes.data);
        setQuestions(qRes.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAdminData();
  }, []);

  const removeQuestion = async (id) => {
    try {
      await authAxios.delete(`/admin/questions/${id}`);
      setQuestions((prev) => prev.filter((q) => q._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (user?.role !== 'admin') {
    return <p className="text-white p-6">Access denied: Admin only.</p>;
  }

  return (
    <div className="min-h-screen p-4 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
      <Sidebar user={user} onLogout={logout} />
      <main className="space-y-6">
        <section className="glass-card p-6 rounded-3xl">
          <h1 className="text-2xl font-bold text-white">Admin Analytics</h1>
          <p className="text-purple-200">Manage users and question library.</p>
          {stats && (
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="glass-card p-4 rounded-xl">Users: <strong>{stats.userCount}</strong></div>
              <div className="glass-card p-4 rounded-xl">Questions: <strong>{stats.questionCount}</strong></div>
              <div className="glass-card p-4 rounded-xl">Attempts: <strong>{stats.attemptCount}</strong></div>
            </div>
          )}
        </section>

        <section className="glass-card p-6 rounded-3xl">
          <h2 className="text-xl font-semibold text-white">Users</h2>
          <div className="max-h-48 overflow-auto mt-3 space-y-2">
            {users.map((u) => (
              <div key={u._id} className="p-3 border border-purple-500/20 rounded-xl bg-slate-900/70">
                <p>{u.name} — {u.email}</p>
                <span className="text-xs text-purple-200">Role: {u.role}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="glass-card p-6 rounded-3xl">
          <h2 className="text-xl font-semibold text-white">Question Bank</h2>
          <div className="max-h-64 overflow-auto mt-3 space-y-2">
            {questions.map((q) => (
              <div key={q._id} className="p-3 border border-purple-500/20 rounded-xl bg-slate-900/70">
                <p className="font-semibold text-purple-100">{q.question}</p>
                <button onClick={() => removeQuestion(q._id)} className="mt-2 px-3 py-1 text-xs rounded bg-red-500 hover:bg-red-400">Remove</button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminPage;

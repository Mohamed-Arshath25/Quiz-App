import { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logoIcon from '../../../assets/logos/logo-icon.svg';
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="glass-card p-8 w-full max-w-md rounded-3xl">
        <div className="mb-5 flex items-center gap-3">
          <img src={logoIcon} alt="Quiz AI" className="h-12 w-12" />
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Quiz AI</p>
            <p className="text-sm text-slate-300">Premium quiz workspace</p>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">Login</h1>
        {error && <p className="text-red-400 mb-3">{error}</p>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            className="w-full p-3 rounded-xl bg-slate-800 text-white border border-purple-300/20"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="w-full p-3 rounded-xl bg-slate-800 text-white border border-purple-300/20"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white font-semibold hover:opacity-90"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-purple-300 mt-4 text-sm">
          New? <Link to="/register" className="text-indigo-200 underline">Create account</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

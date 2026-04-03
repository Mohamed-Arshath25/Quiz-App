import { NavLink } from 'react-router-dom';
import analyticsIcon from '../../../assets/icons/icon-analytics.svg';
import dashboardIcon from '../../../assets/icons/icon-dashboard.svg';
import generateIcon from '../../../assets/icons/icon-generate.svg';
import quizIcon from '../../../assets/icons/icon-quiz.svg';
import settingsIcon from '../../../assets/icons/icon-settings.svg';
import timerIcon from '../../../assets/icons/icon-timer.svg';
import usersIcon from '../../../assets/icons/icon-users.svg';
import logo from '../../../assets/logos/logo.svg';

const Sidebar = ({ user, onLogout }) => {
  const isAdmin = user?.role === 'admin';
  const navItems = [
    { label: 'Dashboard', to: '/dashboard', icon: dashboardIcon },
    { label: 'Analytics', to: '/result', icon: analyticsIcon },
    { label: 'Quiz', to: '/quiz', icon: quizIcon },
    { label: 'Users', to: isAdmin ? '/admin' : '/dashboard', icon: usersIcon },
    { label: 'Settings', to: '/dashboard', icon: settingsIcon },
  ];

  return (
    <aside className="w-full lg:w-72 p-5 space-y-5 glass-card rounded-[28px] border border-white/10 soft-ring">
      <div className="rounded-3xl bg-white/5 p-4 border border-white/10">
        <img src={logo} alt="Quiz AI" className="h-10 w-auto" />
        <p className="mt-3 text-sm text-slate-300">Quiz AI brings quiz generation, analytics, and learning workflows into one clean workspace.</p>
      </div>

      <div className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-2xl transition ${
                isActive
                  ? 'bg-gradient-to-r from-purple-500/40 to-cyan-500/30 text-white border border-white/10'
                  : 'text-slate-200 hover:bg-white/5 border border-transparent'
              }`
            }
            to={item.to}
          >
            <img src={item.icon} alt="" className="asset-icon" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>

      <div className="rounded-3xl bg-slate-950/50 border border-white/10 p-4">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Workspace</p>
        <p className="mt-2 text-white font-semibold">{user?.name}</p>
        <p className="text-sm text-slate-400">{isAdmin ? 'Admin access enabled' : 'Learner account'}</p>
      </div>

      <div className="rounded-3xl bg-slate-950/50 border border-white/10 p-4 space-y-3">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Quick Snapshot</p>
        <div className="flex items-center justify-between rounded-2xl bg-white/5 px-3 py-3">
          <div className="flex items-center gap-3">
            <img src={generateIcon} alt="" className="asset-icon" />
            <span className="text-sm text-slate-200">Quiz Builder</span>
          </div>
          <span className="text-xs font-semibold text-purple-200">Ready</span>
        </div>
        <div className="flex items-center justify-between rounded-2xl bg-white/5 px-3 py-3">
          <div className="flex items-center gap-3">
            <img src={analyticsIcon} alt="" className="asset-icon" />
            <span className="text-sm text-slate-200">Analytics</span>
          </div>
          <span className="text-xs font-semibold text-cyan-200">Live</span>
        </div>
        <div className="flex items-center justify-between rounded-2xl bg-white/5 px-3 py-3">
          <div className="flex items-center gap-3">
            <img src={timerIcon} alt="" className="asset-icon" />
            <span className="text-sm text-slate-200">Session Pace</span>
          </div>
          <span className="text-xs font-semibold text-emerald-200">On track</span>
        </div>
      </div>

      <div className="rounded-3xl bg-gradient-to-br from-purple-500/20 to-cyan-500/10 border border-white/10 p-4">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-300">Quick Tip</p>
        <p className="mt-3 text-sm text-white font-medium">Start with a clear topic and short keywords for better quiz generation.</p>
        <p className="mt-2 text-xs text-slate-300">Examples: JavaScript arrays, world history, animals, algebra basics.</p>
      </div>

      <button
        className="w-full px-4 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:opacity-90 text-white font-semibold"
        onClick={onLogout}
      >
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;

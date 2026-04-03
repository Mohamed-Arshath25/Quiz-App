import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center p-6">
    <div className="glass-card p-8 rounded-3xl max-w-lg text-center">
      <h1 className="text-4xl font-bold text-white">404</h1>
      <p className="text-purple-200 mt-2">Page not found</p>
      <Link to="/dashboard" className="mt-4 inline-block px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white">Go home</Link>
    </div>
  </div>
);

export default NotFound;

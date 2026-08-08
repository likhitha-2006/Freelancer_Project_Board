import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Lock, Mail, ArrowRight, UserCheck, Shield, Sparkles } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, googleLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === 'admin') navigate('/admin-dashboard');
      else if (user.role === 'client') navigate('/client-dashboard');
      else navigate('/freelancer-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  const handleGoogleLoginMock = async () => {
    try {
      setLoading(true);
      await googleLogin({
        email: 'google.user@example.com',
        name: 'Google Auth User',
        googleId: 'google-12345',
        role: 'freelancer'
      });
      navigate('/freelancer-dashboard');
    } catch (err) {
      setError('Google auth failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Welcome Back to <span className="gradient-text">ProBoard</span>
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Sign in to access your projects, proposals, and live chat.
          </p>
        </div>

        {/* Quick Demo Login Preset Buttons */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-2">
          <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider mb-2">
            🚀 Quick Demo Logins:
          </span>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              onClick={() => handleQuickLogin('client@acme.com', 'client123')}
              className="px-2.5 py-2 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 text-blue-400 rounded-xl font-bold flex flex-col items-center gap-1 transition-all"
            >
              <UserCheck className="w-4 h-4" />
              Client
            </button>
            <button
              onClick={() => handleQuickLogin('freelancer@dev.com', 'free123')}
              className="px-2.5 py-2 bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 rounded-xl font-bold flex flex-col items-center gap-1 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Freelancer
            </button>
            <button
              onClick={() => handleQuickLogin('admin@platform.com', 'admin123')}
              className="px-2.5 py-2 bg-purple-600/10 hover:bg-purple-600/20 border border-purple-500/30 text-purple-400 rounded-xl font-bold flex flex-col items-center gap-1 transition-all"
            >
              <Shield className="w-4 h-4" />
              Admin
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm rounded-xl">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 text-sm"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 text-sm font-bold text-white gradient-btn rounded-xl shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2"
          >
            {loading ? 'Signing In...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-slate-950 px-2 text-slate-500">Or continue with</span>
          </div>
        </div>

        {/* OAuth Placeholder Button */}
        <button
          onClick={handleGoogleLoginMock}
          className="w-full py-3 border border-slate-700 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.11 0-5.75-2.1-6.69-4.94H1.36v3.15C3.37 21.37 7.42 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.31 14.26c-.24-.72-.38-1.49-.38-2.26s.14-1.54.38-2.26V6.59H1.36C.49 8.33 0 10.11 0 12s.49 3.67 1.36 5.41l3.95-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.42 0 3.37 2.63 1.36 6.59l3.95 3.15c.94-2.84 3.58-4.99 6.69-4.99z"
            />
          </svg>
          Google OAuth Sign In (Placeholder)
        </button>

        <p className="text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-blue-400 hover:text-blue-300">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}

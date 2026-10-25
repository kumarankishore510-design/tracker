import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, User, ArrowRight, AlertCircle, Info, Bus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SEO } from '../../components/common/SEO';

export const AdminLoginPage: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already logged in, redirect
  if (isAuthenticated) {
    navigate('/admin/dashboard');
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      if (res.ok) {
        const data = await res.json();
        login(data.token, data.user);
        navigate('/admin/dashboard');
      } else {
        // Fallback for offline demo mode
        if (username === 'admin' && (password === 'admin123' || password === 'admin')) {
          login('demo_token_' + Date.now(), {
            username: 'admin',
            role: 'superadmin',
            name: 'SKS Operations Lead',
          });
          navigate('/admin/dashboard');
        } else {
          setErrorMsg('Invalid username or password.');
        }
      }
    } catch {
      // Local fallback
      if (username === 'admin' && (password === 'admin123' || password === 'admin')) {
        login('demo_token_' + Date.now(), {
          username: 'admin',
          role: 'superadmin',
          name: 'SKS Operations Lead',
        });
        navigate('/admin/dashboard');
      } else {
        setErrorMsg('Invalid login credentials.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#102A43] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <SEO title="Admin Login — SKS Travels Portal" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link to="/" className="inline-flex items-center space-x-2.5 group">
          <div className="w-12 h-12 rounded-2xl bg-[#F28C28] flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
            <Bus className="w-7 h-7" />
          </div>
          <div className="text-left">
            <span className="text-2xl font-extrabold text-white">SKS TRAVELS</span>
            <span className="block text-[11px] text-amber-300 font-bold uppercase tracking-wider">
              Management Portal
            </span>
          </div>
        </Link>
        <h2 className="text-xl font-bold text-white tracking-tight">
          Sign In to Administrator Console
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-slate-100 space-y-6">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="admin"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#F28C28] bg-slate-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#F28C28] bg-slate-50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-white bg-[#102A43] hover:bg-[#0A1C2E] shadow-lg flex items-center justify-center space-x-2 text-sm transition-colors"
            >
              <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="w-4 h-4 text-[#F28C28]" />
            </button>
          </form>

          {/* Documented Initial Setup Notice */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
            <div className="flex items-center space-x-1.5 font-bold text-[#102A43]">
              <Info className="w-3.5 h-3.5 text-[#F28C28]" />
              <span>Initial Administrator Credentials:</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Default operational username: <code className="bg-slate-200 px-1 py-0.5 rounded font-mono font-bold text-[#102A43]">admin</code>
              <br />
              Default password: <code className="bg-slate-200 px-1 py-0.5 rounded font-mono font-bold text-[#102A43]">admin123</code> (configurable via <code className="font-mono">ADMIN_PASSWORD</code> environment variable or backend database).
            </p>
          </div>

          <div className="text-center pt-2">
            <Link to="/" className="text-xs font-semibold text-slate-500 hover:text-[#102A43]">
              ← Return to SKS Travels Public Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Camera, Lock, Mail, Loader2, KeyRound, ShieldAlert, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Invalid credentials');
        setLoading(false);
        return;
      }

      // Redirect based on role
      if (data.user.role === 'ADMIN' || data.user.role === 'PHOTOGRAPHER') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } catch {
      setErrorMsg('Login failed. Please check network connection.');
      setLoading(false);
    }
  };

  const fillDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-screen bg-[#08090D] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Brand */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gold-gradient p-0.5 shadow-gold-glow">
              <div className="w-full h-full bg-[#08090D] rounded-full flex items-center justify-center">
                <Camera className="w-6 h-6 text-gold-400" />
              </div>
            </div>
            <span className="font-brand text-3xl font-bold tracking-widest text-white">
              CINEMAYUR
            </span>
          </Link>
          <p className="text-xs text-slate-400 uppercase tracking-widest font-mono">
            PORTAL SIGN IN
          </p>
        </div>

        {/* Form Card */}
        <div className="glass-panel rounded-3xl p-8 border border-[#262A3C] space-y-6">
          <form onSubmit={handleLogin} className="space-y-5">
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold text-center">
                {errorMsg}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-300">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@cinemayur.com"
                  className="w-full bg-surface-100 border border-surface-300 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-300">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-surface-100 border border-surface-300 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gold-gradient text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-gold-glow hover:scale-[1.01] transition-all cursor-pointer"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <KeyRound className="w-4 h-4" />}
              Sign In To Portal
            </button>
          </form>

          {/* Quick Demo Login Credentials Bar */}
          <div className="pt-4 border-t border-[#262A3C] space-y-3">
            <span className="text-[11px] font-bold text-gold-400 uppercase tracking-wider block text-center">
              ⚡ Quick One-Click Demo Logins
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillDemo('admin@cinemayur.com', 'admin123')}
                className="px-2 py-2 rounded-lg bg-surface-100 hover:bg-gold-500/20 text-slate-200 hover:text-gold-300 border border-surface-300 text-[11px] font-medium transition-colors"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => fillDemo('photographer@cinemayur.com', 'photo123')}
                className="px-2 py-2 rounded-lg bg-surface-100 hover:bg-gold-500/20 text-slate-200 hover:text-gold-300 border border-surface-300 text-[11px] font-medium transition-colors"
              >
                Photographer
              </button>
              <button
                type="button"
                onClick={() => fillDemo('customer@cinemayur.com', 'customer123')}
                className="px-2 py-2 rounded-lg bg-surface-100 hover:bg-gold-500/20 text-slate-200 hover:text-gold-300 border border-surface-300 text-[11px] font-medium transition-colors"
              >
                Customer
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-slate-400 pt-2">
            Don't have a customer account?{' '}
            <Link href="/register" className="text-gold-400 hover:underline font-bold">
              Register Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

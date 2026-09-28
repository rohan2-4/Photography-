'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Camera, Lock, Mail, Sparkles, ShieldCheck, User, ArrowRight, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

      if (data.user.role === 'ADMIN' || data.user.role === 'PHOTOGRAPHER') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to login.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: demoEmail, password: demoPass }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Demo login failed');

      if (data.user.role === 'ADMIN' || data.user.role === 'PHOTOGRAPHER') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Demo login failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08090D] flex items-center justify-center p-4 selection:bg-amber-400 selection:text-black">
      <div className="w-full max-w-md space-y-8 bg-[#12141D] border border-white/10 p-8 sm:p-10 rounded-3xl shadow-2xl relative overflow-hidden">
        
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>

        {/* Brand */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 p-[1px] shadow-lg shadow-amber-500/20">
              <div className="w-full h-full bg-[#08090D] rounded-[11px] flex items-center justify-center">
                <Camera className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <span className="text-2xl font-brand font-bold text-white tracking-wider">
              CINEMAYUR
            </span>
          </Link>
          <h2 className="text-xl font-serif font-bold text-white pt-2">
            Welcome Back to Studio Portal
          </h2>
          <p className="text-xs text-slate-400">
            Sign in to track your bookings or manage studio availability.
          </p>
        </div>

        {/* Quick Demo Login Buttons */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 space-y-2.5">
          <div className="flex items-center justify-between text-[11px] font-semibold text-amber-300">
            <span>⚡ Quick Demo One-Click Sign In</span>
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('admin@cinemayur.com', 'admin123')}
              className="py-2 px-2 bg-amber-400 text-black rounded-xl text-[10px] font-bold hover:brightness-110 transition-all flex flex-col items-center gap-1 shadow-md"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('photographer@cinemayur.com', 'photo123')}
              className="py-2 px-2 bg-slate-800 text-amber-300 border border-amber-500/40 rounded-xl text-[10px] font-bold hover:bg-slate-700 transition-all flex flex-col items-center gap-1"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Photographer</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('customer@cinemayur.com', 'customer123')}
              className="py-2 px-2 bg-slate-800 text-slate-200 border border-slate-700 rounded-xl text-[10px] font-bold hover:bg-slate-700 transition-all flex flex-col items-center gap-1"
            >
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span>Customer</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-xs p-3 rounded-xl">
            {error}
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="admin@cinemayur.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-white/15 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400"
              />
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-white/15 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-black bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:brightness-110 shadow-lg shadow-amber-500/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-slate-400 flex items-center justify-between border-t border-white/10">
          <span>Don't have an account?</span>
          <Link href="/register" className="text-amber-400 hover:underline font-semibold">
            Create Customer Account →
          </Link>
        </div>

      </div>
    </div>
  );
}

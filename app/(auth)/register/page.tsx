'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Camera, Lock, Mail, User, Phone, Loader2, Sparkles } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Registration failed');
        setLoading(false);
        return;
      }

      router.push('/dashboard');
    } catch {
      setErrorMsg('Registration failed. Please check network connection.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08090D] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
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
            CREATE CUSTOMER ACCOUNT
          </p>
        </div>

        <div className="glass-panel rounded-3xl p-8 border border-[#262A3C] space-y-6">
          <form onSubmit={handleRegister} className="space-y-4">
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold text-center">
                {errorMsg}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-300">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Priya Malhotra"
                  className="w-full bg-surface-100 border border-surface-300 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-300">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="priya@example.com"
                  className="w-full bg-surface-100 border border-surface-300 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-300">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
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
              className="w-full py-4 rounded-xl bg-gold-gradient text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-gold-glow hover:scale-[1.01] transition-all cursor-pointer mt-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              Create Customer Account
            </button>
          </form>

          <div className="text-center text-xs text-slate-400 pt-2 border-t border-[#262A3C]">
            Already have an account?{' '}
            <Link href="/login" className="text-gold-400 hover:underline font-bold">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

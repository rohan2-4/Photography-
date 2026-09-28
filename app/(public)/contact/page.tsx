'use client';

import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, Loader2, Sparkles } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [eventType, setEventType] = useState('Wedding Photography');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, eventType, message }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit contact inquiry');

      setSuccess('Thank you for reaching out to Cinemayur! Our team will contact you within 24 hours.');
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to send message.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
          Get In Touch
        </span>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white">
          Contact Cinemayur Studio
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed">
          Have a question about date availability, custom package pricing, or outstation travel arrangements? Send us a message or visit our studio.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
        
        {/* Left 2 cols: Studio Contact Details */}
        <div className="lg:col-span-2 space-y-8 bg-[#12141D] border border-white/10 p-8 rounded-3xl shadow-2xl">
          <div className="space-y-2">
            <h3 className="text-xl font-serif font-bold text-white">Studio Headquarters</h3>
            <p className="text-xs text-slate-400">Available for in-person coffee consultations & album reviews by appointment.</p>
          </div>

          <div className="space-y-6 text-xs text-slate-300">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="font-semibold text-white block">Main Studio Location</span>
                <p className="text-slate-400 leading-relaxed">
                  Cinemayur Studio, Murti, Tal. Baramati, Dist. PUNE
                </p>
                <p className="text-amber-400 text-[11px]">Owner & Admin: Mayur Gadade</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="font-semibold text-white block">Phone & WhatsApp</span>
                <p className="text-slate-400">+91 7387209509 (Mayur Gadade)</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="font-semibold text-white block">Email Enquiries</span>
                <p className="text-slate-400">gadademayur13@gmail.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="font-semibold text-white block">Operating Hours</span>
                <p className="text-slate-400">Monday – Saturday: 10:00 AM – 8:00 PM</p>
                <p className="text-slate-400">Sunday: Open for scheduled event shoots</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right 3 cols: Contact Form */}
        <div className="lg:col-span-3 bg-[#12141D] border border-white/10 p-8 sm:p-10 rounded-3xl shadow-2xl space-y-6">
          <div className="space-y-1">
            <h3 className="text-2xl font-serif font-bold text-white">Send Us a Message</h3>
            <p className="text-xs text-slate-400">Fill out your details below and we will get back to you with custom quotes.</p>
          </div>

          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 flex items-center gap-3 text-emerald-300 text-xs animate-in fade-in duration-300">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 text-red-300 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Sunita Mehra"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="sunita@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98112 23344"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-900 border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Event Category</label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full bg-slate-900 border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="Wedding Photography">Wedding Photography</option>
                  <option value="Pre-Wedding Shoot">Pre-Wedding Shoot</option>
                  <option value="Engagement">Engagement & Sangeet</option>
                  <option value="Maternity">Maternity & Pregnancy</option>
                  <option value="Baby">Baby & Newborn</option>
                  <option value="Corporate Events">Corporate Events</option>
                  <option value="General Inquiry">General Inquiry</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Message / Inquiry Details</label>
              <textarea
                rows={4}
                required
                placeholder="Tell us about your event dates, venue location, expected guest count..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-slate-900 border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl text-xs font-bold uppercase tracking-wider text-black bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:brightness-110 shadow-lg shadow-amber-500/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Inquiry...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Contact Inquiry</span>
                </>
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

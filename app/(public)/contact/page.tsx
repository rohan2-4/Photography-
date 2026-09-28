'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Loader2, Camera } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [eventType, setEventType] = useState('Wedding Photography');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, eventType, message }),
      });

      if (res.ok) {
        setSubmitted(true);
      }
    } catch {
      alert('Unable to submit inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-mono font-bold tracking-widest text-gold-400 uppercase">
          STUDIO INQUIRIES
        </span>
        <h1 className="text-4xl sm:text-6xl font-serif font-bold text-white">
          Get In Touch
        </h1>
        <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
          Planning a wedding or luxury event? Send us a message or call our lead studio director to discuss your vision.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Contact Info Card */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-8 sm:p-10 border border-[#262A3C] space-y-8 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold-gradient p-0.5">
                <div className="w-full h-full bg-[#08090D] rounded-full flex items-center justify-center">
                  <Camera className="w-5 h-5 text-gold-400" />
                </div>
              </div>
              <div>
                <h3 className="font-brand text-xl font-bold text-white">CINEMAYUR</h3>
                <span className="text-[10px] text-gold-500 uppercase tracking-widest font-semibold">LUXURY STUDIO</span>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              We look forward to capturing your most treasured memories. Reach out directly or visit our Flagship Mumbai Studio.
            </p>

            <div className="space-y-6 pt-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs uppercase font-bold text-slate-400">Flagship Studio Location</h4>
                  <p className="text-sm text-white font-medium mt-0.5">104 Luxury Studio Avenue, Film City Road, Mumbai, Maharashtra 400065</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs uppercase font-bold text-slate-400">Phone & Whatsapp</h4>
                  <p className="text-sm text-white font-medium mt-0.5">+91 98765 43210 / +91 98765 43211</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs uppercase font-bold text-slate-400">Email Address</h4>
                  <p className="text-sm text-white font-medium mt-0.5">contact@cinemayur.com / booking@cinemayur.com</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-surface-100 border border-surface-300 text-xs text-slate-400 space-y-1">
            <span className="font-bold text-gold-400">Studio Visiting Hours:</span>
            <p>Monday – Saturday: 10:00 AM – 8:00 PM (By Appointment)</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-8 sm:p-10 border border-[#262A3C]">
          {submitted ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-gold-500/20 text-gold-400 flex items-center justify-center mx-auto border border-gold-500/40">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-3xl font-serif font-bold text-white">Thank You!</h3>
              <p className="text-slate-300 text-sm max-w-md mx-auto">
                Your message has been saved. Our senior team will reach out to you within 12 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h3 className="text-2xl font-serif font-bold text-white">Send Us A Message</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-300">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ananya Roy"
                    className="w-full bg-surface-100 border border-surface-300 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-300">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ananya@example.com"
                    className="w-full bg-surface-100 border border-surface-300 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-300">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-surface-100 border border-surface-300 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-300">Event Type</label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full bg-surface-100 border border-surface-300 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-500"
                  >
                    <option value="Wedding Photography">Wedding Photography</option>
                    <option value="Pre-Wedding Shoot">Pre-Wedding Shoot</option>
                    <option value="Engagement">Engagement & Sangeet</option>
                    <option value="Maternity">Maternity & Pregnancy</option>
                    <option value="Baby">Baby & Newborn</option>
                    <option value="Corporate Events">Corporate Events</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-300">Your Message / Requirements</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your event date, location, and specific preferences..."
                  className="w-full bg-surface-100 border border-surface-300 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gold-gradient text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-gold-glow hover:scale-[1.01] transition-all"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-4 h-4" />}
                Send Studio Inquiry
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

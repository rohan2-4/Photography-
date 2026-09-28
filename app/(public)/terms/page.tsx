export default function TermsPage() {
  return (
    <div className="pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="text-center space-y-4">
        <span className="text-xs font-mono font-bold tracking-widest text-gold-400 uppercase">
          LEGAL & POLICIES
        </span>
        <h1 className="text-4xl font-serif font-bold text-white">
          Terms & Conditions / Privacy Policy
        </h1>
        <p className="text-slate-400 text-sm">Effective Date: September 2026</p>
      </div>

      <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-[#262A3C] space-y-8 text-slate-300 text-sm leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-xl font-serif font-bold text-white">1. Booking & Advance Payment</h2>
          <p>
            A 30% advance deposit is required to confirm date reservation on the Cinemayur calendar. Dates are held exclusively for confirmed clients once payment verification completes.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-serif font-bold text-white">2. Cancellation & Rescheduling</h2>
          <p>
            Bookings may be rescheduled to an available date with a minimum 30 days prior notice without penalty. Deposits are non-refundable for cancellations made within 14 days of the scheduled event date.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-serif font-bold text-white">3. Copyright & Usage License</h2>
          <p>
            Cinemayur retains standard artist copyright over all photographs and video recordings. Clients receive full personal non-commercial usage rights for social media, printing, and family archives.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-serif font-bold text-white">4. Privacy Policy</h2>
          <p>
            We respect client privacy. Personal information collected during booking (name, phone, email, event details) is stored securely and never sold to third parties.
          </p>
        </section>
      </div>
    </div>
  );
}

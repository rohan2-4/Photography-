import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/db/prisma';
import HomeClientGallery from '@/components/public/HomeClientGallery';
import {
  Sparkles,
  Calendar,
  Camera,
  Film,
  Award,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Star,
  HelpCircle,
  Percent,
  ChevronRight
} from 'lucide-react';

export const revalidate = 0;

export default async function HomePage() {
  // Fetch database content dynamically
  const services = await prisma.service.findMany({
    where: { active: true },
    take: 6,
  });

  const packages = await prisma.package.findMany({
    where: { active: true },
    orderBy: { price: 'desc' },
    take: 4,
  });

  const offers = await prisma.offer.findMany({
    where: { active: true },
    include: { package: true },
    take: 3,
  });

  const portfolioImages = await prisma.portfolioImage.findMany({
    orderBy: { displayOrder: 'asc' },
    take: 12,
  });

  const testimonials = await prisma.testimonial.findMany({
    where: { isFeatured: true },
    take: 6,
  });

  const faqs = [
    {
      q: 'How far in advance should we book Cinemayur for a wedding?',
      a: 'We recommend booking 4 to 9 months in advance for prime wedding season dates (October through April) to guarantee availability.',
    },
    {
      q: 'What is the advance payment requirement?',
      a: 'We require a 30% advance deposit at the time of booking to lock your date exclusively on our calendar. The remaining balance is split before the event day.',
    },
    {
      q: 'How long does image and cinematic video delivery take?',
      a: 'Digital preview highlights are delivered within 48-72 hours. Your complete high-resolution edited photo gallery and 4K cinematic film are delivered within 4 to 6 weeks.',
    },
    {
      q: 'Do you travel for destination weddings across India & internationally?',
      a: 'Yes! Cinemayur covers destination weddings worldwide. Travel and stay arrangements are managed transparently in your custom quotation.',
    },
    {
      q: 'Can we customize our photography & cinematography package?',
      a: 'Absolutely. We offer tailored packages including drone coverage, luxury flush-mount velvet albums, pre-wedding sessions, and additional crew members.',
    },
    {
      q: 'What is your cancellation and rescheduling policy?',
      a: 'Bookings can be rescheduled to an available date with at least 30 days notice without fee penalties. Cancellations are subject to terms outlined in our booking agreement.',
    }
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-20">
        {/* Background Image with Dark Vignette Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1920&auto=format&fit=crop"
            alt="Cinemayur Wedding Photography Hero"
            fill
            className="object-cover object-center scale-105 animate-pulse duration-[10000ms]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08090D] via-[#08090D]/75 to-black/60" />
          <div className="absolute inset-0 bg-radial-vignette opacity-90" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-8 py-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 text-xs sm:text-sm font-semibold tracking-widest uppercase shadow-gold-glow">
            <Sparkles className="w-4 h-4 text-gold-400" />
            Cinemayur — Premium Photography Studio
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold text-white tracking-tight leading-none drop-shadow-2xl">
            Your Moments. <br />
            <span className="text-gold-gradient italic font-normal">Our Story.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-xl text-slate-300 font-light leading-relaxed">
            Professional photography and cinematic experiences for weddings, celebrations, events and unforgettable moments.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/availability"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-gold-gradient text-black font-bold text-sm tracking-wider uppercase shadow-gold-glow hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
            >
              <Calendar className="w-5 h-5" />
              Check Date Availability
            </Link>
            <Link
              href="/portfolio"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-surface-100/90 text-white hover:text-gold-300 font-semibold text-sm tracking-wider uppercase border border-surface-300 hover:border-gold-500/40 transition-all duration-300 flex items-center justify-center gap-3 backdrop-blur-md"
            >
              <Camera className="w-5 h-5 text-gold-400" />
              Explore Portfolio
            </Link>
          </div>
        </div>
      </section>

      {/* 2. FEATURED SERVICES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <span className="text-xs font-bold tracking-[0.3em] text-gold-400 uppercase font-mono">
            WHAT WE DO
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white">
            Featured Photography Services
          </h2>
          <div className="w-24 h-1 bg-gold-gradient mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const features = JSON.parse(service.includedFeatures || '[]');
            return (
              <div
                key={service.id}
                className="group glass-panel rounded-2xl overflow-hidden border border-[#262A3C] hover:border-gold-500/50 transition-all duration-500 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={service.coverImage}
                      alt={service.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#12141D] via-transparent to-transparent" />
                  </div>

                  <div className="p-6 space-y-4">
                    <h3 className="text-2xl font-serif font-bold text-white group-hover:text-gold-300 transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {service.shortDesc}
                    </p>

                    <div className="pt-2 border-t border-[#262A3C] space-y-2">
                      <div className="text-xs text-slate-400">Key Highlights:</div>
                      <ul className="space-y-1.5">
                        {features.slice(0, 3).map((feat: string, idx: number) => (
                          <li key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 flex items-center justify-between border-t border-[#262A3C]/50 mt-4">
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 tracking-wider">Starting From</span>
                    <div className="text-xl font-bold font-serif text-gold-400">
                      ₹{service.startingPrice.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <Link
                    href={`/services#${service.slug}`}
                    className="px-4 py-2 rounded-lg bg-surface-200 text-xs font-semibold text-white group-hover:bg-gold-500 group-hover:text-black transition-colors flex items-center gap-1.5"
                  >
                    View Details
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. WHY CINEMAYUR */}
      <section className="bg-gradient-to-b from-[#0A0C12] via-[#10121C] to-[#0A0C12] py-20 border-y border-[#1E2232]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-xs font-bold tracking-[0.3em] text-gold-400 uppercase font-mono">
              THE CINEMAYUR DIFFERENCE
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white">
              Why Couples & Brands Trust Us
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              We combine fine-art photojournalism with Hollywood-grade cinematography to capture the raw emotions of your most precious celebrations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="glass-panel p-8 rounded-2xl border border-[#262A3C] space-y-4 hover:border-gold-500/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif font-bold text-white">Professional Master Photographers</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Led by award-winning photography directors with over a decade of experience framing high-profile luxury weddings.
              </p>
            </div>

            <div className="glass-panel p-8 rounded-2xl border border-[#262A3C] space-y-4 hover:border-gold-500/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
                <Film className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif font-bold text-white">Cinematic Storytelling</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                We craft feature-film quality highlights with custom sound design, color grading, and aerial drone perspective.
              </p>
            </div>

            <div className="glass-panel p-8 rounded-2xl border border-[#262A3C] space-y-4 hover:border-gold-500/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif font-bold text-white">High-End Color Grading</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Every photograph is individually retouched by fine-art editors to ensure rich skin tones and timeless color palettes.
              </p>
            </div>

            <div className="glass-panel p-8 rounded-2xl border border-[#262A3C] space-y-4 hover:border-gold-500/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif font-bold text-white">Punctual & Reliable Delivery</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Guaranteed 72-hour preview highlights and complete high-resolution cloud gallery delivered strictly on schedule.
              </p>
            </div>

            <div className="glass-panel p-8 rounded-2xl border border-[#262A3C] space-y-4 hover:border-gold-500/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif font-bold text-white">Tailored Custom Packages</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Flexible tiers tailored for intimate rituals or grand multi-day destination galas with complete transparency.
              </p>
            </div>

            <div className="glass-panel p-8 rounded-2xl border border-[#262A3C] space-y-4 hover:border-gold-500/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif font-bold text-white">Seamless Online Booking</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Real-time calendar verification, instant deposit confirmation, and dedicated customer portal tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED PORTFOLIO GALLERY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#262A3C] pb-6">
          <div className="space-y-2">
            <span className="text-xs font-bold tracking-[0.3em] text-gold-400 uppercase font-mono">
              CURATED GALLERY
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white">
              Featured Portfolio
            </h2>
          </div>
          <Link
            href="/portfolio"
            className="text-gold-400 hover:text-gold-300 font-semibold text-sm tracking-wider uppercase flex items-center gap-2 group"
          >
            Explore Full Gallery
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Client Gallery component */}
        <HomeClientGallery portfolioImages={portfolioImages} />
      </section>

      {/* 5. PACKAGES PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-bold tracking-[0.3em] text-gold-400 uppercase font-mono">
            INVESTMENT & TIERS
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white">
            Popular Photography Packages
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Transparent pricing crafted for every celebration scale. Book directly online with guaranteed date reservation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {packages.map((pkg) => {
            const features = JSON.parse(pkg.features || '[]');
            return (
              <div
                key={pkg.id}
                className={`relative rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 ${
                  pkg.isPopular
                    ? 'bg-gradient-to-b from-[#1C1F2E] via-[#141724] to-[#0D0F18] border-2 border-gold-500 shadow-gold-glow scale-105'
                    : 'glass-panel border border-[#262A3C] hover:border-gold-500/40'
                }`}
              >
                {pkg.isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gold-gradient text-black font-bold text-xs uppercase tracking-widest shadow-md">
                    MOST POPULAR
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <span className="text-xs font-semibold text-gold-400 uppercase tracking-wider">
                      {pkg.eventType}
                    </span>
                    <h3 className="text-xl font-serif font-bold text-white mt-1">
                      {pkg.name}
                    </h3>
                  </div>

                  <div className="space-y-1">
                    {pkg.discountedPrice ? (
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-serif font-bold text-white">
                          ₹{pkg.discountedPrice.toLocaleString('en-IN')}
                        </span>
                        <span className="text-sm text-slate-500 line-through">
                          ₹{pkg.price.toLocaleString('en-IN')}
                        </span>
                      </div>
                    ) : (
                      <span className="text-3xl font-serif font-bold text-white">
                        ₹{pkg.price.toLocaleString('en-IN')}
                      </span>
                    )}
                    <div className="text-xs text-slate-400">Duration: {pkg.duration}</div>
                  </div>

                  <ul className="space-y-3 pt-4 border-t border-[#262A3C]">
                    {features.map((feat: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-tight">
                        <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8">
                  <Link
                    href={`/book?packageId=${pkg.id}`}
                    className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2 transition-all ${
                      pkg.isPopular
                        ? 'bg-gold-gradient text-black shadow-gold-glow hover:scale-105'
                        : 'bg-surface-200 text-white hover:bg-gold-500 hover:text-black'
                    }`}
                  >
                    Book Package Now
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. SPECIAL OFFERS */}
      {offers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-panel-gold rounded-3xl p-8 sm:p-12 border border-gold-500/30 relative overflow-hidden">
            <div className="relative z-10 space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 text-gold-400 text-xs font-mono font-bold tracking-widest uppercase">
                    <Percent className="w-4 h-4" />
                    EXCLUSIVE SEASONAL DEALS
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
                    Special Offers & Packages
                  </h2>
                </div>
                <Link
                  href="/offers"
                  className="px-6 py-2.5 rounded-full bg-gold-500/20 text-gold-300 hover:bg-gold-500 hover:text-black font-semibold text-xs uppercase tracking-wider transition-colors border border-gold-500/40 w-fit"
                >
                  View All Offers
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {offers.map((offer) => (
                  <div
                    key={offer.id}
                    className="bg-[#0A0C12]/90 rounded-2xl p-6 border border-gold-500/20 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 text-[10px] font-bold tracking-wider uppercase font-mono">
                        {offer.code}
                      </span>
                      {offer.discountPercent && (
                        <span className="text-lg font-bold text-gold-400 font-serif">
                          {offer.discountPercent}% OFF
                        </span>
                      )}
                      {offer.discountAmount && (
                        <span className="text-lg font-bold text-gold-400 font-serif">
                          ₹{offer.discountAmount.toLocaleString('en-IN')} OFF
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-serif font-bold text-white">
                      {offer.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {offer.terms}
                    </p>
                    <div className="pt-2 flex items-center justify-between border-t border-[#262A3C] text-[11px] text-slate-500">
                      <span>Valid until: {new Date(offer.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      <Link
                        href={`/book?offerCode=${offer.code}`}
                        className="text-gold-400 font-bold hover:underline"
                      >
                        Claim Offer →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 7. AVAILABILITY CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden p-10 sm:p-16 text-center space-y-8 bg-gradient-to-r from-[#171A28] via-[#12141F] to-[#171A28] border border-gold-500/30 shadow-2xl">
          <div className="max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-bold tracking-[0.3em] text-gold-400 uppercase font-mono">
              PLANNING YOUR SPECIAL DAY?
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white">
              Check If Your Preferred Date Is Available
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              We limit our bookings to ensure uncompromised quality. Verify whether our lead photography crew is free for your event date.
            </p>
          </div>

          <div>
            <Link
              href="/availability"
              className="inline-flex items-center gap-3 px-10 py-4 rounded-full bg-gold-gradient text-black font-bold text-sm tracking-wider uppercase shadow-gold-glow hover:scale-105 transition-all duration-300"
            >
              <Calendar className="w-5 h-5" />
              Check Your Date Now
            </Link>
          </div>
        </div>
      </section>

      {/* 8. TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-bold tracking-[0.3em] text-gold-400 uppercase font-mono">
            TESTIMONIALS
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white">
            Words From Our Couples
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="glass-panel rounded-2xl p-8 border border-[#262A3C] space-y-6 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-gold-400">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm italic leading-relaxed">
                  "{t.review}"
                </p>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-[#262A3C]">
                {t.photoUrl ? (
                  <div className="relative w-11 h-11 rounded-full overflow-hidden border border-gold-500/40">
                    <Image src={t.photoUrl} alt={t.name} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="w-11 h-11 rounded-full bg-surface-200 text-gold-400 flex items-center justify-center font-bold text-sm">
                    {t.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-bold font-serif text-white">{t.name}</h4>
                  <span className="text-[11px] text-gold-400/80">{t.eventType}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. FAQ ACCORDION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold tracking-[0.3em] text-gold-400 uppercase font-mono">
            FREQUENTLY ASKED QUESTIONS
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
            Everything You Need To Know
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <details
              key={idx}
              className="glass-panel rounded-2xl border border-[#262A3C] p-6 group cursor-pointer transition-colors"
            >
              <summary className="font-serif text-lg font-semibold text-white group-hover:text-gold-300 flex items-center justify-between list-none">
                <span className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-gold-400 shrink-0" />
                  {faq.q}
                </span>
                <ChevronRight className="w-5 h-5 text-slate-400 group-open:rotate-90 transition-transform" />
              </summary>
              <p className="mt-4 text-sm text-slate-400 leading-relaxed pl-8">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}

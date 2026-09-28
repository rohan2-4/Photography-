'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Loader2, 
  ArrowRight,
  AlertCircle,
  Check,
  Building2,
  Sparkles,
  Camera,
  Layers
} from 'lucide-react';

interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
}

interface Package {
  id: string;
  serviceId?: string | null;
  name: string;
  eventType: string;
  price: number;
  discountedPrice?: number | null;
  duration: string;
}

export default function BookPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialPackageId = searchParams.get('packageId') || '';
  const initialDate = searchParams.get('date') || '';
  const initialStartTime = searchParams.get('startTime') || '09:00';
  const initialEndTime = searchParams.get('endTime') || '18:00';

  const [services, setServices] = useState<Service[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [selectedPackageId, setSelectedPackageId] = useState<string>(initialPackageId);
  
  const [eventDate, setEventDate] = useState(initialDate);
  const [isFullDay, setIsFullDay] = useState(false);
  const [startTime, setStartTime] = useState(initialStartTime);
  const [endTime, setEndTime] = useState(initialEndTime);
  const [city, setCity] = useState('');
  const [location, setLocation] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Customer details
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  // Category specific dynamic details
  const [categoryDetails, setCategoryDetails] = useState<Record<string, any>>({});

  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load Services and Packages
  useEffect(() => {
    async function loadData() {
      try {
        setFetchingData(true);
        const [servicesRes, packagesRes, meRes] = await Promise.all([
          fetch('/api/services'),
          fetch('/api/packages'),
          fetch('/api/auth/me'),
        ]);

        const servicesData = await servicesRes.json();
        const packagesData = await packagesRes.json();
        const meData = await meRes.json();

        const loadedServices: Service[] = servicesData.services || [];
        const loadedPackages: Package[] = packagesData.packages || [];

        setServices(loadedServices);
        setPackages(loadedPackages);

        // Pre-select service based on initialPackageId if present
        let initialSvcId = '';
        if (initialPackageId) {
          const matchPkg = loadedPackages.find(p => p.id === initialPackageId);
          if (matchPkg && matchPkg.serviceId) {
            initialSvcId = matchPkg.serviceId;
          }
        }

        if (!initialSvcId && loadedServices.length > 0) {
          initialSvcId = loadedServices[0].id;
        }

        setSelectedServiceId(initialSvcId);

        // User auto-fill
        if (meData.user) {
          setCustomerName(meData.user.name || '');
          setCustomerEmail(meData.user.email || '');
          setCustomerPhone(meData.user.phone || '');
        }
      } catch (err) {
        console.error('Failed to load services/packages:', err);
      } finally {
        setFetchingData(false);
      }
    }

    loadData();
  }, [initialPackageId]);

  // Selected Service Object
  const selectedService = useMemo(() => {
    return services.find(s => s.id === selectedServiceId);
  }, [services, selectedServiceId]);

  // Packages filtered by selected category
  const filteredPackages = useMemo(() => {
    if (!selectedServiceId) return packages;
    return packages.filter(p => p.serviceId === selectedServiceId);
  }, [packages, selectedServiceId]);

  // Whenever selected category changes, auto update package selection
  const handleCategoryChange = (svcId: string) => {
    setSelectedServiceId(svcId);
    setCategoryDetails({}); // Reset category questions
    const matchPkgs = packages.filter(p => p.serviceId === svcId);
    if (matchPkgs.length > 0) {
      setSelectedPackageId(matchPkgs[0].id);
    } else {
      setSelectedPackageId('');
    }
  };

  const selectedPackage = packages.find((p) => p.id === selectedPackageId);
  const packagePrice = selectedPackage ? (selectedPackage.discountedPrice || selectedPackage.price) : 0;

  const handleDetailChange = (key: string, value: any) => {
    setCategoryDetails(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedServiceId || !selectedService) {
      setError('Please select a Shoot Category.');
      return;
    }
    if (!selectedPackageId || !selectedPackage) {
      setError('Please select a photography package for the selected category.');
      return;
    }
    if (!eventDate) {
      setError('Please select a valid event date.');
      return;
    }
    if (!customerName || !customerEmail || !customerPhone || !city || !location) {
      setError('Please fill in all mandatory customer, city, and location details.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerEmail,
          customerPhone,
          eventType: selectedService.name,
          serviceId: selectedService.id,
          packageId: selectedPackageId,
          eventDate,
          isFullDay,
          startTime: isFullDay ? '06:00' : startTime,
          endTime: isFullDay ? '23:59' : endTime,
          city,
          location,
          categoryDetails,
          additionalNotes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit booking');
      }

      router.push(`/booking/${data.booking.bookingNumber}`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An error occurred during booking.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Dynamic Questions UI based on Category Name
  const renderCategoryQuestions = () => {
    if (!selectedService) return null;
    const name = selectedService.name.toLowerCase();

    if (name.includes('car') || name.includes('bike') || name.includes('delivery')) {
      return (
        <div className="space-y-4 pt-4 border-t border-white/10">
          <h4 className="text-xs uppercase tracking-wider font-semibold text-amber-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Vehicle Delivery Details
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-300">Vehicle Type</label>
              <select
                value={categoryDetails.vehicleType || 'Car'}
                onChange={(e) => handleDetailChange('vehicleType', e.target.value)}
                className="w-full mt-1 bg-slate-900 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Car">Car</option>
                <option value="Bike">Bike / Superbike</option>
                <option value="Luxury Commercial">Commercial / Luxury</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-300">Vehicle Make & Model</label>
              <input
                type="text"
                placeholder="e.g. Mahindra Thar Roxx / BMW Z4"
                value={categoryDetails.vehicleModel || ''}
                onChange={(e) => handleDetailChange('vehicleModel', e.target.value)}
                className="w-full mt-1 bg-slate-900 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-300">Showroom / Delivery Venue</label>
              <input
                type="text"
                placeholder="e.g. PPS Mahindra, Baramati"
                value={categoryDetails.showroomName || ''}
                onChange={(e) => handleDetailChange('showroomName', e.target.value)}
                className="w-full mt-1 bg-slate-900 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>
      );
    }

    if (name.includes('baby')) {
      return (
        <div className="space-y-4 pt-4 border-t border-white/10">
          <h4 className="text-xs uppercase tracking-wider font-semibold text-amber-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Baby Shoot Details
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-300">Baby Age (Months / Years)</label>
              <input
                type="text"
                placeholder="e.g. 6 Months / 1 Year"
                value={categoryDetails.babyAge || ''}
                onChange={(e) => handleDetailChange('babyAge', e.target.value)}
                className="w-full mt-1 bg-slate-900 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-300">Preferred Theme / Props</label>
              <input
                type="text"
                placeholder="e.g. Royal Prince, Floral Setup, Little Chef"
                value={categoryDetails.babyTheme || ''}
                onChange={(e) => handleDetailChange('babyTheme', e.target.value)}
                className="w-full mt-1 bg-slate-900 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>
      );
    }

    if (name.includes('wedding') && !name.includes('pre-wedding')) {
      return (
        <div className="space-y-4 pt-4 border-t border-white/10">
          <h4 className="text-xs uppercase tracking-wider font-semibold text-amber-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Wedding Details
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-300">Venue Type</label>
              <select
                value={categoryDetails.venueType || 'Resort'}
                onChange={(e) => handleDetailChange('venueType', e.target.value)}
                className="w-full mt-1 bg-slate-900 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Resort">Destination Resort</option>
                <option value="Lawn">Open Lawn / Garden</option>
                <option value="Hall">Marriage Hall / Banquet</option>
                <option value="Temple">Temple / Traditional Venue</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-300">Estimated Guest Count</label>
              <input
                type="number"
                placeholder="e.g. 500"
                value={categoryDetails.guestCount || ''}
                onChange={(e) => handleDetailChange('guestCount', e.target.value)}
                className="w-full mt-1 bg-slate-900 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-300">Events Included</label>
              <input
                type="text"
                placeholder="e.g. Haldi, Sangeet, Wedding, Reception"
                value={categoryDetails.functionsIncluded || ''}
                onChange={(e) => handleDetailChange('functionsIncluded', e.target.value)}
                className="w-full mt-1 bg-slate-900 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>
      );
    }

    if (name.includes('politician') || name.includes('reels')) {
      return (
        <div className="space-y-4 pt-4 border-t border-white/10">
          <h4 className="text-xs uppercase tracking-wider font-semibold text-amber-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Political & Social Media Reels Requirements
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-300">Required Reel Count</label>
              <input
                type="text"
                placeholder="e.g. 5 Cinematic Reels / Monthly Package"
                value={categoryDetails.reelCount || ''}
                onChange={(e) => handleDetailChange('reelCount', e.target.value)}
                className="w-full mt-1 bg-slate-900 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-300">Target Social Platforms</label>
              <select
                value={categoryDetails.platformFocus || 'Instagram'}
                onChange={(e) => handleDetailChange('platformFocus', e.target.value)}
                className="w-full mt-1 bg-slate-900 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Instagram">Instagram Reels & Stories</option>
                <option value="YouTube">YouTube Shorts & Videos</option>
                <option value="Facebook">Facebook Campaign</option>
                <option value="Multi-Platform">All Major Platforms</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-300">Campaign / Event Purpose</label>
              <input
                type="text"
                placeholder="e.g. Election Campaign, Rally, Public Meet"
                value={categoryDetails.campaignObjective || ''}
                onChange={(e) => handleDetailChange('campaignObjective', e.target.value)}
                className="w-full mt-1 bg-slate-900 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>
      );
    }

    if (name.includes('business') || name.includes('corporate')) {
      return (
        <div className="space-y-4 pt-4 border-t border-white/10">
          <h4 className="text-xs uppercase tracking-wider font-semibold text-amber-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Corporate / Business Shoot Details
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-300">Company / Brand Name</label>
              <input
                type="text"
                placeholder="e.g. Cinemayur Studios Pvt Ltd"
                value={categoryDetails.companyName || ''}
                onChange={(e) => handleDetailChange('companyName', e.target.value)}
                className="w-full mt-1 bg-slate-900 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-300">Shoot Type</label>
              <select
                value={categoryDetails.corporateShootType || 'Product & Services'}
                onChange={(e) => handleDetailChange('corporateShootType', e.target.value)}
                className="w-full mt-1 bg-slate-900 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Product & Services">Product Showcase</option>
                <option value="Team Headshots">Team Headshots & Executive Profiles</option>
                <option value="Office Ambience">Office & Factory Ambience</option>
                <option value="Corporate Event">Corporate Summit / Launch Event</option>
              </select>
            </div>
          </div>
        </div>
      );
    }

    if (name.includes('engagement')) {
      return (
        <div className="space-y-4 pt-4 border-t border-white/10">
          <h4 className="text-xs uppercase tracking-wider font-semibold text-amber-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Engagement Shoot Details
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-300">Ring Ceremony Timing</label>
              <input
                type="text"
                placeholder="e.g. Morning 10:30 AM"
                value={categoryDetails.ceremonyTime || ''}
                onChange={(e) => handleDetailChange('ceremonyTime', e.target.value)}
                className="w-full mt-1 bg-slate-900 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-300">Couple Outfit Count</label>
              <input
                type="text"
                placeholder="e.g. 2 Outfit Changes"
                value={categoryDetails.outfitCount || ''}
                onChange={(e) => handleDetailChange('outfitCount', e.target.value)}
                className="w-full mt-1 bg-slate-900 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>
      );
    }

    if (name.includes('pre-wedding')) {
      return (
        <div className="space-y-4 pt-4 border-t border-white/10">
          <h4 className="text-xs uppercase tracking-wider font-semibold text-amber-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Pre-Wedding Concept Details
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-300">Preferred Locations</label>
              <input
                type="text"
                placeholder="e.g. Mahabaleshwar / Fort / Beach Resort"
                value={categoryDetails.locations || ''}
                onChange={(e) => handleDetailChange('locations', e.target.value)}
                className="w-full mt-1 bg-slate-900 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-300">Shoot Concept / Style</label>
              <input
                type="text"
                placeholder="e.g. Cinematic Royal, Retro, Western Casual"
                value={categoryDetails.conceptStyle || ''}
                onChange={(e) => handleDetailChange('conceptStyle', e.target.value)}
                className="w-full mt-1 bg-slate-900 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>
      );
    }

    if (name.includes('birthday')) {
      return (
        <div className="space-y-4 pt-4 border-t border-white/10">
          <h4 className="text-xs uppercase tracking-wider font-semibold text-amber-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Birthday Party Details
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-300">Celebrant Age / Milestone</label>
              <input
                type="text"
                placeholder="e.g. 1st Birthday / 25th Birthday"
                value={categoryDetails.celebrantAge || ''}
                onChange={(e) => handleDetailChange('celebrantAge', e.target.value)}
                className="w-full mt-1 bg-slate-900 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-300">Party Theme</label>
              <input
                type="text"
                placeholder="e.g. Superhero Theme, Neon Party"
                value={categoryDetails.partyTheme || ''}
                onChange={(e) => handleDetailChange('partyTheme', e.target.value)}
                className="w-full mt-1 bg-slate-900 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>
      );
    }

    if (name.includes('maternity')) {
      return (
        <div className="space-y-4 pt-4 border-t border-white/10">
          <h4 className="text-xs uppercase tracking-wider font-semibold text-amber-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Maternity Shoot Details
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-300">Pregnancy Trimester / Month</label>
              <input
                type="text"
                placeholder="e.g. 7th Month / 8th Month"
                value={categoryDetails.pregnancyMonth || ''}
                onChange={(e) => handleDetailChange('pregnancyMonth', e.target.value)}
                className="w-full mt-1 bg-slate-900 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-300">Setup Preference</label>
              <select
                value={categoryDetails.maternitySetup || 'Studio & Outdoor'}
                onChange={(e) => handleDetailChange('maternitySetup', e.target.value)}
                className="w-full mt-1 bg-slate-900 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Studio & Outdoor">Indoor Studio & Natural Outdoor</option>
                <option value="Home Comfort">Home Comfort Shoot</option>
                <option value="Scenic Outdoor">Scenic Nature Spot</option>
              </select>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4 pt-4 border-t border-white/10">
        <h4 className="text-xs uppercase tracking-wider font-semibold text-amber-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> Specific Shoot Requirements
        </h4>
        <div>
          <label className="text-xs font-medium text-slate-300">Describe Your Shoot Vision</label>
          <input
            type="text"
            placeholder="e.g. Fashion portrait, Drone aerial coverage, Social media campaign..."
            value={categoryDetails.shootVision || ''}
            onChange={(e) => handleDetailChange('shootVision', e.target.value)}
            className="w-full mt-1 bg-slate-900 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>
    );
  };

  if (fetchingData) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
        <p className="text-xs text-slate-400">Loading Cinemayur booking portal...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold flex items-center justify-center gap-1.5">
          <Camera className="w-4 h-4" /> Official Reservation Portal
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white">
          Book Your Cinemayur Experience
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
          Select your shoot category, package, date, and custom details to request your date directly with Mayur Gadade.
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/40 rounded-2xl p-4 flex items-center gap-3 text-red-300 text-xs">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 columns: Inputs */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Step 1: Shoot Category & Package Selection */}
          <div className="bg-[#12141D] border border-white/10 rounded-2xl p-6 space-y-5">
            <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center font-bold">1</span>
              <span>Shoot Category & Package Selection</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Shoot Category</label>
                <select
                  value={selectedServiceId}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full bg-slate-900 border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400 font-medium"
                >
                  {services.map((svc) => (
                    <option key={svc.id} value={svc.id}>
                      {svc.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Photography Package</label>
                <select
                  value={selectedPackageId}
                  onChange={(e) => setSelectedPackageId(e.target.value)}
                  disabled={filteredPackages.length === 0}
                  className="w-full bg-slate-900 border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400 font-medium disabled:opacity-50"
                >
                  {filteredPackages.length > 0 ? (
                    filteredPackages.map((pkg) => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.name} — ₹{(pkg.discountedPrice || pkg.price).toLocaleString('en-IN')}
                      </option>
                    ))
                  ) : (
                    <option value="">No packages available for this category</option>
                  )}
                </select>
              </div>
            </div>

            {/* Category Conditional Questions */}
            {renderCategoryQuestions()}
          </div>

          {/* Step 2: Date, Full-Day & Time Schedule */}
          <div className="bg-[#12141D] border border-white/10 rounded-2xl p-6 space-y-5">
            <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center font-bold">2</span>
              <span>Date, Full-Day & Schedule</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Event Date</label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full bg-slate-900 border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400 [color-scheme:dark]"
                />
              </div>

              {/* Full Day Checkbox */}
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-3 cursor-pointer bg-slate-900 border border-white/15 rounded-xl px-4 py-3 w-full hover:border-amber-400/50 transition-all">
                  <input
                    type="checkbox"
                    checked={isFullDay}
                    onChange={(e) => setIsFullDay(e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 text-amber-500 focus:ring-amber-400 bg-slate-950"
                  />
                  <div className="text-left">
                    <span className="text-xs font-semibold text-white block">Full-Day Shoot</span>
                    <span className="text-[10px] text-slate-400 block">Reserve full day availability</span>
                  </div>
                </label>
              </div>
            </div>

            {!isFullDay && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Start Time</label>
                  <input
                    type="time"
                    required={!isFullDay}
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full bg-slate-900 border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400 [color-scheme:dark]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">End Time</label>
                  <input
                    type="time"
                    required={!isFullDay}
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full bg-slate-900 border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400 [color-scheme:dark]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Step 3: Location & Customer Information */}
          <div className="bg-[#12141D] border border-white/10 rounded-2xl p-6 space-y-5">
            <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center font-bold">3</span>
              <span>Location & Contact Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">City / District</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Baramati, Pune, Satara, Mumbai"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-slate-900 border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Exact Venue / Location Address</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Murti, Baramati / Resort Name"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-900 border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Your Full Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-slate-900 border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="your.email@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-300">Phone / WhatsApp Number</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 7387209509"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-slate-900 border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-300">Additional Notes / Special Requests (Optional)</label>
                <textarea
                  rows={3}
                  placeholder="Specify lighting, drone requirements, or specific shot lists..."
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  className="w-full bg-slate-900 border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right column: Booking Request Summary Card */}
        <div className="space-y-6">
          <div className="bg-[#12141D] border border-amber-500/30 rounded-2xl p-6 space-y-6 sticky top-24 shadow-2xl">
            <h3 className="text-lg font-serif font-bold text-white border-b border-white/10 pb-3">
              Request Summary
            </h3>

            {selectedService && selectedPackage ? (
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-amber-400 font-semibold block">
                    {selectedService.name}
                  </span>
                  <h4 className="text-base font-serif font-bold text-white mt-0.5">
                    {selectedPackage.name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Duration: {isFullDay ? 'Full Day Shoot' : selectedPackage.duration}
                  </p>
                </div>

                <div className="space-y-2 pt-3 border-t border-white/10 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Package Pricing:</span>
                    <span className="font-semibold text-white">
                      ₹{packagePrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Payment Status:</span>
                    <span className="font-semibold text-amber-400">Direct Admin Confirmation</span>
                  </div>
                </div>

                <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-[11px] text-slate-400 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Direct Photographer Contact</span>
                  </div>
                  <p>No upfront payment required. Your request is submitted to owner Mayur Gadade for date approval.</p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl text-xs font-bold uppercase tracking-wider text-black bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:brightness-110 shadow-lg shadow-amber-500/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting Request...</span>
                    </>
                  ) : (
                    <>
                      <ArrowRight className="w-4 h-4" />
                      <span>Submit Booking Request</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <p className="text-xs text-slate-400">Select a category & package to view summary.</p>
            )}
          </div>
        </div>

      </form>
    </div>
  );
}

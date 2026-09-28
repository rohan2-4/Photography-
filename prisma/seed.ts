import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

function getSeedPassword(name: string, developmentPassword: string): string {
  const password = process.env[name];
  if (process.env.NODE_ENV === 'production' && !password) {
    throw new Error(`${name} must be set when seeding a production database.`);
  }
  return password || developmentPassword;
}

async function main() {
  console.log('Seeding Cinemayur database...');

  if (process.env.NODE_ENV === 'production') {
    const existingCounts = await Promise.all([
      prisma.user.count(),
      prisma.service.count(),
      prisma.package.count(),
      prisma.offer.count(),
      prisma.portfolioImage.count(),
      prisma.booking.count(),
      prisma.availabilityBlock.count(),
      prisma.payment.count(),
      prisma.testimonial.count(),
      prisma.contactMessage.count(),
    ]);
    if (existingCounts.some((count) => count > 0)) {
      throw new Error('Refusing to seed a non-empty production database.');
    }
  }

  // 1. Clear existing data
  await prisma.payment.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.availabilityBlock.deleteMany();
  await prisma.offer.deleteMany();
  await prisma.package.deleteMany();
  await prisma.service.deleteMany();
  await prisma.portfolioImage.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.user.deleteMany();

  // 2. Users
  const adminPassword = await bcrypt.hash(getSeedPassword('ADMIN_PASSWORD', 'admin123'), 10);
  const photoPassword = await bcrypt.hash(getSeedPassword('PHOTOGRAPHER_PASSWORD', 'photo123'), 10);
  const customerPassword = await bcrypt.hash(getSeedPassword('CUSTOMER_PASSWORD', 'customer123'), 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Mayur Gadade (Owner & Admin)',
      email: 'gadademayur13@gmail.com',
      passwordHash: adminPassword,
      role: 'ADMIN',
      phone: '+91 7387209509',
    },
  });

  const photographer = await prisma.user.create({
    data: {
      name: 'Rohan Verma (Cinematographer)',
      email: 'photographer@cinemayur.com',
      passwordHash: photoPassword,
      role: 'PHOTOGRAPHER',
      phone: '+91 98765 43211',
    },
  });

  const customer = await prisma.user.create({
    data: {
      name: 'Priya & Vikram Malhotra',
      email: 'customer@cinemayur.com',
      passwordHash: customerPassword,
      role: 'CUSTOMER',
      phone: '+91 98765 43212',
    },
  });

  console.log('Users created:', { admin: admin.email, photographer: photographer.email, customer: customer.email });

  // 3. Official Cinemayur Shoot Categories (10 Core Services)
  const carBikeService = await prisma.service.create({
    data: {
      name: 'Car / Bike Delivery Shoot',
      slug: 'car-bike-delivery-shoot',
      shortDesc: 'Cinematic unveilings, luxury car delivery reveals, and superbike features.',
      description: 'Capture the sheer excitement of taking delivery of your new dream car or superbike. Dynamic tracking shots, cinematic slow-mo reveals, exhaust notes, and portrait celebrations.',
      startingPrice: 15000,
      duration: '2-4 Hours',
      displayOrder: 1,
      coverImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop',
      includedFeatures: JSON.stringify([
        'Cinematic Unveiling & Key Handover Coverage',
        '4K Ultra HD Reel & Slow-Mo Video Edits',
        'Studio Quality Automotive Lighting Shots',
        'Color Graded High-Resolution Digital Gallery'
      ]),
    },
  });

  const babyService = await prisma.service.create({
    data: {
      name: 'Baby Shoot',
      slug: 'baby-shoot',
      shortDesc: 'Gentle, safe, adorable newborn and milestone baby portraiture.',
      description: 'Cozy, temperature-controlled studio setups or home sessions for newborns, toddlers, and milestone birthdays with sanitized themes and props.',
      startingPrice: 18000,
      duration: '2-3 Hours',
      displayOrder: 2,
      coverImage: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=1200&auto=format&fit=crop',
      includedFeatures: JSON.stringify([
        'Sanitized Props, Costumes & Cute Setups',
        'Patient & Gentle Certified Handler Assistance',
        '25 Retouched Fine-Art Prints & Digital Files',
        'Custom Hardcover Keepsake Album'
      ]),
    },
  });

  const weddingService = await prisma.service.create({
    data: {
      name: 'Wedding Shoot',
      slug: 'wedding-shoot',
      shortDesc: 'Royal cinematic storytelling, candid moments, and timeless wedding films.',
      description: 'Your wedding is a story told once in a lifetime. We capture every sacred ritual, emotional tears, royal mandap vows, and high-energy celebrations.',
      startingPrice: 85000,
      duration: '1 to 3 Days',
      displayOrder: 3,
      coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
      includedFeatures: JSON.stringify([
        'Lead Photographer & Cinematographer',
        'Traditional & Candid Multi-Camera Coverage',
        'High-Resolution Edited Digital Gallery',
        'Handcrafted Premium Velvet Album',
        '4K Teaser & Full Highlight Wedding Film',
        'Drone Aerial Photography'
      ]),
    },
  });

  const politicianSocialService = await prisma.service.create({
    data: {
      name: 'Politician & Social Media Reels',
      slug: 'politician-social-media-reels',
      shortDesc: 'High-impact political rally coverage, campaign branding, and viral reels.',
      description: 'Fast-paced, authoritative visual coverage for political campaigns, public rallies, social media branding, and viral short-form video reels.',
      startingPrice: 25000,
      duration: 'Full Day / Campaign Event',
      displayOrder: 4,
      coverImage: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?q=80&w=1200&auto=format&fit=crop',
      includedFeatures: JSON.stringify([
        'Same-Day Delivery of High-Impact Instagram/YouTube Reels',
        'Crowd Dynamics & Stage Keynote Photography',
        'Speech Highlight Audio & Video Editing',
        'Custom Political Branding & Logo Overlay'
      ]),
    },
  });

  const corporateService = await prisma.service.create({
    data: {
      name: 'Business / Corporate Shoot',
      slug: 'business-corporate-shoot',
      shortDesc: 'Executive summits, product launches, galas, and headshots.',
      description: 'Sharp, executive, high-impact photography for brand summits, award galas, corporate headshots, and company facility documentation.',
      startingPrice: 35000,
      duration: '4-8 Hours',
      displayOrder: 5,
      coverImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop',
      includedFeatures: JSON.stringify([
        'Rapid 24-Hour Preview Images for Press Release',
        'Executive Headshot Station Setup',
        'Full Commercial Usage & Copyright Licensing',
        'Highlight Film & Event Documentary'
      ]),
    },
  });

  const engagementService = await prisma.service.create({
    data: {
      name: 'Engagement Shoot',
      slug: 'engagement-shoot',
      shortDesc: 'Ring ceremony, high-energy sangeet dance, and couple portraits.',
      description: 'Vibrant candid moments, glamorous stage choreography, close-up ring exchanges, and festive family celebration framing.',
      startingPrice: 40000,
      duration: '6 Hours',
      displayOrder: 6,
      coverImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop',
      includedFeatures: JSON.stringify([
        '2 Senior Photographers (Candid + Stage)',
        '150 High-Res Edited Portraits',
        'Full HD Sangeet & Ring Ceremony Highlight Video',
        'Private Shareable Online Gallery'
      ]),
    },
  });

  const preWeddingService = await prisma.service.create({
    data: {
      name: 'Pre-Wedding Shoot',
      slug: 'pre-wedding-shoot',
      shortDesc: 'Romantic, artistic, location-based story sessions for couples.',
      description: 'Express your romance before the big day at dreamy scenic locations. Custom theme styling, concept choreography, and romantic cinematic teasers.',
      startingPrice: 35000,
      duration: 'Full Day (8 Hours)',
      displayOrder: 7,
      coverImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200&auto=format&fit=crop',
      includedFeatures: JSON.stringify([
        '2 Scenic Outdoor Locations',
        '3 Costume & Style Changes',
        '50 Signature Edited Portraits',
        '1-Minute Cinematic Instagram Reel',
        'Drone Aerial Shots'
      ]),
    },
  });

  const birthdayService = await prisma.service.create({
    data: {
      name: 'Birthday Shoot',
      slug: 'birthday-shoot',
      shortDesc: 'Vibrant party coverage, cake cutting moments, and family portraits.',
      description: 'Capture the joyful chaos of birthdays, milestone celebrations, cake smashes, and party fun with crisp candid photography.',
      startingPrice: 20000,
      duration: '3-5 Hours',
      displayOrder: 8,
      coverImage: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=1200&auto=format&fit=crop',
      includedFeatures: JSON.stringify([
        'Full Party & Venue Candid Coverage',
        'Cake Cutting & Guest Portraiture',
        '100 Edited High-Res Photos',
        'Cinematic 2-Minute Highlight Reel'
      ]),
    },
  });

  const maternityService = await prisma.service.create({
    data: {
      name: 'Maternity Shoot',
      slug: 'maternity-shoot',
      shortDesc: 'Graceful, elegant maternal portraits celebrating new beginnings.',
      description: 'Preserve the magic of impending motherhood with artistic studio lighting, gown styling support, and tender partner poses.',
      startingPrice: 25000,
      duration: '3 Hours',
      displayOrder: 9,
      coverImage: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?q=80&w=1200&auto=format&fit=crop',
      includedFeatures: JSON.stringify([
        'Indoor Luxury Studio or Sunset Outdoor Location',
        'Designer Gown & Styling Assistance',
        '30 Retouched Fine-Art Portraits',
        'Framed Wall Portrait (12x18)'
      ]),
    },
  });

  const trendingOtherService = await prisma.service.create({
    data: {
      name: 'Trending / Other Shoot',
      slug: 'trending-other-shoot',
      shortDesc: 'Custom viral concepts, fashion editorials, and tailored photography.',
      description: 'Flexible, trend-focused photography for unique concepts, fashion lookbooks, music videos, and special client requests.',
      startingPrice: 30000,
      duration: 'Custom Duration',
      displayOrder: 10,
      coverImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop',
      includedFeatures: JSON.stringify([
        'Custom Concept Styling & Lighting Setup',
        'Tailored High-Res Photo & Reel Edits',
        'Full Commercial Usage & Raw Files Option'
      ]),
    },
  });

  // 4. Packages Bound to Category (Service)
  const royalWeddingPkg = await prisma.package.create({
    data: {
      serviceId: weddingService.id,
      name: 'The Royal Heritage Wedding',
      slug: 'royal-heritage-wedding',
      eventType: 'Wedding Shoot',
      price: 150000,
      discountedPrice: 125000,
      duration: '2 Full Days',
      photographers: 4,
      editedPhotos: 500,
      videoCoverage: true,
      albumIncluded: true,
      droneCoverage: true,
      preWeddingSession: true,
      isPopular: true,
      features: JSON.stringify([
        'Complete 2-Day Wedding & Reception Coverage',
        '4-Member Crew (2 Candid Photographers, 2 Cinematographers)',
        '4K Cinematic Wedding Film + 3-Min Teaser Trailer',
        '2 Premium Flush-Mount Leatherette Albums (40 Pages)',
        'Complimentary Pre-Wedding Session with Drone Footage',
        'Raw Footages & Private Online Cloud Gallery'
      ]),
    },
  });

  const classicWeddingPkg = await prisma.package.create({
    data: {
      serviceId: weddingService.id,
      name: 'Classic Elegance Wedding',
      slug: 'classic-elegance-wedding',
      eventType: 'Wedding Shoot',
      price: 85000,
      discountedPrice: 75000,
      duration: '1 Full Day',
      photographers: 2,
      editedPhotos: 300,
      videoCoverage: true,
      albumIncluded: true,
      droneCoverage: false,
      preWeddingSession: false,
      isPopular: false,
      features: JSON.stringify([
        'Full Day Wedding & Rituals Coverage',
        '2 Senior Photographers (Candid + Traditional)',
        'HD Highlight Film (10-15 Mins)',
        '1 Handcrafted Premium Album (30 Pages)',
        '300 High-Res Edited Digital Photos'
      ]),
    },
  });

  const romancePreWeddingPkg = await prisma.package.create({
    data: {
      serviceId: preWeddingService.id,
      name: 'Cinematic Escapes Pre-Wedding',
      slug: 'cinematic-escapes-pre-wedding',
      eventType: 'Pre-Wedding Shoot',
      price: 45000,
      discountedPrice: 35000,
      duration: 'Full Day (8 Hours)',
      photographers: 2,
      editedPhotos: 60,
      videoCoverage: true,
      albumIncluded: true,
      droneCoverage: true,
      preWeddingSession: true,
      isPopular: true,
      features: JSON.stringify([
        '2 Destination / Scenic Locations',
        '3 Costume Changes with On-Set Assistant',
        '4K Cinematic Reel (60 Secs) for Social Media',
        'Aerial Drone Couple Shots',
        '1 Printed Acrylic Table Frame'
      ]),
    },
  });

  const deliveryCinematicPkg = await prisma.package.create({
    data: {
      serviceId: carBikeService.id,
      name: 'Cinematic Vehicle Delivery Unveil',
      slug: 'cinematic-vehicle-delivery-unveil',
      eventType: 'Car / Bike Delivery Shoot',
      price: 20000,
      discountedPrice: 15000,
      duration: '3 Hours',
      photographers: 2,
      editedPhotos: 35,
      videoCoverage: true,
      albumIncluded: false,
      droneCoverage: true,
      preWeddingSession: false,
      isPopular: true,
      features: JSON.stringify([
        'Showroom Unveiling & Key Handover Coverage',
        '4K Ultra HD Slow-Mo Reel for Instagram/YouTube',
        'Cinematic Exhaust & Driving Tracking Shots',
        'High-Resolution Digital Color-Graded Gallery'
      ]),
    },
  });

  const babyMilestonePkg = await prisma.package.create({
    data: {
      serviceId: babyService.id,
      name: 'Baby Milestone & Newborn Joy',
      slug: 'baby-milestone-newborn-joy',
      eventType: 'Baby Shoot',
      price: 22000,
      discountedPrice: 18000,
      duration: '3 Hours',
      photographers: 1,
      editedPhotos: 30,
      videoCoverage: true,
      albumIncluded: true,
      droneCoverage: false,
      preWeddingSession: false,
      isPopular: true,
      features: JSON.stringify([
        'Sanitized Props, Theme Setups & Outfit Costumes',
        'Patient & Safe Certified Handling',
        '30 Retouched High-Res Soft Portraits',
        '1 Printed Keepsake Mini Photo Book'
      ]),
    },
  });

  const politicalReelsPkg = await prisma.package.create({
    data: {
      serviceId: politicianSocialService.id,
      name: 'Social Media & Political Campaign Reels',
      slug: 'social-media-political-campaign-reels',
      eventType: 'Politician & Social Media Reels',
      price: 35000,
      discountedPrice: 28000,
      duration: 'Full Day Event',
      photographers: 2,
      editedPhotos: 150,
      videoCoverage: true,
      albumIncluded: false,
      droneCoverage: true,
      preWeddingSession: false,
      isPopular: true,
      features: JSON.stringify([
        '3 Fast-Edited Trending Reels (Same Day Turnaround)',
        'Speech & Rally Stage Multi-Angle Video Coverage',
        'Custom Logo & Political Subtitle Overlays',
        'Aerial Drone Crowd Shots'
      ]),
    },
  });

  const engagementGalaPkg = await prisma.package.create({
    data: {
      serviceId: engagementService.id,
      name: 'Grand Engagement & Sangeet',
      slug: 'grand-engagement-sangeet',
      eventType: 'Engagement',
      price: 50000,
      discountedPrice: null,
      duration: '6 Hours',
      photographers: 2,
      editedPhotos: 200,
      videoCoverage: true,
      albumIncluded: true,
      droneCoverage: false,
      preWeddingSession: false,
      isPopular: false,
      features: JSON.stringify([
        'Stage Ring Ceremony & Candid Dance Coverage',
        'High Quality Edited Highlight Video',
        '1 Compact Coffee Table Book Album',
        'Online Digital Shareable Gallery'
      ]),
    },
  });

  const maternityLuxePkg = await prisma.package.create({
    data: {
      serviceId: maternityService.id,
      name: 'Blissful Glow Maternity',
      slug: 'blissful-glow-maternity',
      eventType: 'Maternity',
      price: 30000,
      discountedPrice: 25000,
      duration: '3 Hours',
      photographers: 1,
      editedPhotos: 30,
      videoCoverage: false,
      albumIncluded: true,
      droneCoverage: false,
      preWeddingSession: false,
      isPopular: false,
      features: JSON.stringify([
        'Luxury Indoor Studio + Outdoor Sunset Shots',
        'Access to Designer Gown Wardrobe',
        '30 Retouched High-Resolution Images',
        'Custom Framed Wall Portrait (12x18)'
      ]),
    },
  });

  const corporateSummitPkg = await prisma.package.create({
    data: {
      serviceId: corporateService.id,
      name: 'Executive Summit & Gala',
      slug: 'executive-summit-gala',
      eventType: 'Corporate Events',
      price: 60000,
      discountedPrice: 50000,
      duration: 'Full Day (8 Hours)',
      photographers: 3,
      editedPhotos: 400,
      videoCoverage: true,
      albumIncluded: false,
      droneCoverage: true,
      preWeddingSession: false,
      isPopular: false,
      features: JSON.stringify([
        'Keynote, Panel & Networking Candid Coverage',
        'On-site Headshot Corner for Executives',
        'Same-Day Press Release Preview Photos (20 Images)',
        'Full HD Event Summary Video (3-5 Mins)'
      ]),
    },
  });

  // 5. Special Offers
  await prisma.offer.create({
    data: {
      packageId: royalWeddingPkg.id,
      title: 'Wedding Season Royal Special',
      code: 'ROYALWED20',
      discountPercent: 20,
      startDate: new Date('2026-09-01'),
      endDate: new Date('2026-12-31'),
      terms: 'Valid on Royal Heritage Wedding package bookings made for dates between Oct 2026 and March 2027. Advance deposit required.',
      active: true,
    },
  });

  await prisma.offer.create({
    data: {
      packageId: romancePreWeddingPkg.id,
      title: 'Romantic Pre-Wedding Bundle Discount',
      code: 'PREWED10K',
      discountAmount: 10000,
      startDate: new Date('2026-09-01'),
      endDate: new Date('2026-11-30'),
      terms: 'Get ₹10,000 off on Cinematic Escapes Pre-Wedding package when booked alongside any wedding package.',
      active: true,
    },
  });

  await prisma.offer.create({
    data: {
      packageId: corporateSummitPkg.id,
      title: 'Corporate Early Bird Gala Offer',
      code: 'CORP15',
      discountPercent: 15,
      startDate: new Date('2026-08-01'),
      endDate: new Date('2026-10-31'),
      terms: 'Applicable for full-day corporate conventions and summits. Minimum 15-day advance booking.',
      active: true,
    },
  });

  // 6. Portfolio Images (20 High Quality Photography Items)
  const portfolioItems = [
    {
      title: 'Royal Mandap Sacred Vows',
      category: 'Weddings',
      imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
      isFeatured: true,
      displayOrder: 1,
    },
    {
      title: 'Golden Hour Sunset Romance',
      category: 'Pre-Wedding',
      imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200&auto=format&fit=crop',
      isFeatured: true,
      displayOrder: 2,
    },
    {
      title: 'Traditional Bride Fine Art Portrait',
      category: 'Portraits',
      imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop',
      isFeatured: true,
      displayOrder: 3,
    },
    {
      title: 'Sangeet Stage Choreography',
      category: 'Events',
      imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop',
      isFeatured: true,
      displayOrder: 4,
    },
    {
      title: 'Graceful Sunset Maternity',
      category: 'Maternity',
      imageUrl: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?q=80&w=1200&auto=format&fit=crop',
      isFeatured: true,
      displayOrder: 5,
    },
    {
      title: 'Peaceful Newborn Dreams',
      category: 'Baby',
      imageUrl: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=1200&auto=format&fit=crop',
      isFeatured: true,
      displayOrder: 6,
    },
    {
      title: 'High Fashion Runway Editorial',
      category: 'Fashion',
      imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop',
      isFeatured: true,
      displayOrder: 7,
    },
    {
      title: 'Palace Courtyard First Look',
      category: 'Weddings',
      imageUrl: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=1200&auto=format&fit=crop',
      isFeatured: false,
      displayOrder: 8,
    },
    {
      title: 'Lakeside Couple Reflection',
      category: 'Pre-Wedding',
      imageUrl: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=1200&auto=format&fit=crop',
      isFeatured: true,
      displayOrder: 9,
    },
    {
      title: 'Joyful Haldi Ceremony Splash',
      category: 'Weddings',
      imageUrl: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=1200&auto=format&fit=crop',
      isFeatured: false,
      displayOrder: 10,
    },
    {
      title: 'Corporate Leadership Keynote',
      category: 'Events',
      imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop',
      isFeatured: false,
      displayOrder: 11,
    },
    {
      title: 'Minimalist Studio Portrait',
      category: 'Portraits',
      imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop',
      isFeatured: false,
      displayOrder: 12,
    },
    {
      title: 'Motherhood Serenity',
      category: 'Maternity',
      imageUrl: 'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?q=80&w=1200&auto=format&fit=crop',
      isFeatured: false,
      displayOrder: 13,
    },
    {
      title: 'First Birthday Cake Smash',
      category: 'Baby',
      imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1200&auto=format&fit=crop',
      isFeatured: false,
      displayOrder: 14,
    },
    {
      title: 'Vogue Style Fashion Glamour',
      category: 'Fashion',
      imageUrl: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1200&auto=format&fit=crop',
      isFeatured: false,
      displayOrder: 15,
    },
    {
      title: 'Royal Barat Entrance Drama',
      category: 'Weddings',
      imageUrl: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1200&auto=format&fit=crop',
      isFeatured: false,
      displayOrder: 16,
    },
    {
      title: 'Mist & Mountains Couple Escape',
      category: 'Pre-Wedding',
      imageUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1200&auto=format&fit=crop',
      isFeatured: false,
      displayOrder: 17,
    },
    {
      title: 'Gala Award Night Sparkles',
      category: 'Events',
      imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop',
      isFeatured: false,
      displayOrder: 18,
    },
    {
      title: 'Groom Royal Sherwani Look',
      category: 'Portraits',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop',
      isFeatured: false,
      displayOrder: 19,
    },
    {
      title: 'Candid Family Celebration Hug',
      category: 'Events',
      imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1200&auto=format&fit=crop',
      isFeatured: false,
      displayOrder: 20,
    }
  ];

  for (const item of portfolioItems) {
    await prisma.portfolioImage.create({ data: item });
  }
  console.log('Portfolio items created');

  // 7. Testimonials
  const testimonials = [
    {
      name: 'Ananya & Siddharth Oberoi',
      eventType: 'Royal Wedding in Udaipur',
      rating: 5,
      review: 'Mayur and the Cinemayur team captured our 3-day wedding in Udaipur with artistic perfection. The 4K film looks like a Bollywood movie trailer! Every single guest was stunned by the albums.',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      isFeatured: true,
    },
    {
      name: 'Rohan & Neha Kapoor',
      eventType: 'Pre-Wedding Shoot in Rishikesh',
      rating: 5,
      review: 'Our pre-wedding shoot was effortlessly comfortable. The drone shots along the Ganges river gave us chills. Highly professional and punctual team!',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
      isFeatured: true,
    },
    {
      name: 'Dr. Meera Vasudevan',
      eventType: 'Maternity Session',
      rating: 5,
      review: 'As an expecting mom, I was worried about comfort. The Cinemayur team handled everything with so much care. The pictures look heavenly!',
      photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
      isFeatured: true,
    },
    {
      name: 'Vikramaditya Tech Solutions',
      eventType: 'Annual Leadership Summit',
      rating: 5,
      review: 'Delivered 400+ high-res edited corporate event photos within 24 hours for our press release. Outstanding commitment and precision.',
      photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
      isFeatured: true,
    },
    {
      name: 'Kavita & Devendra Singhania',
      eventType: 'Silver Anniversary Gala',
      rating: 5,
      review: 'Cinemayur brings timeless luxury to photography. The candid emotional shots of our parents brought tears to everyone’s eyes.',
      photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
      isFeatured: true,
    }
  ];

  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t });
  }

  // 8. Availability Blocks
  await prisma.availabilityBlock.create({
    data: {
      date: new Date('2026-10-15'),
      reason: 'Photographer Studio Maintenance & Gear Upgrade',
      createdBy: 'ADMIN',
    },
  });

  await prisma.availabilityBlock.create({
    data: {
      date: new Date('2026-11-01'),
      reason: 'Blocked for Private Destination Shoot',
      createdBy: 'ADMIN',
    },
  });

  // 9. Bookings & Payments
  const confirmedBooking = await prisma.booking.create({
    data: {
      bookingNumber: 'CIN-2026-0001',
      customerId: customer.id,
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone || '+91 98765 43212',
      eventType: 'Wedding Photography',
      eventDate: new Date('2026-10-25'),
      startTime: '08:00',
      endTime: '22:00',
      location: 'The Leela Palace, Udaipur, Rajasthan',
      packageId: royalWeddingPkg.id,
      additionalNotes: 'Need focus on bridalentry and fireworks during reception.',
      amount: 125000,
      depositAmount: 37500,
      paidAmount: 37500,
      bookingStatus: 'CONFIRMED',
      paymentStatus: 'PARTIAL',
    },
  });

  await prisma.payment.create({
    data: {
      bookingId: confirmedBooking.id,
      transactionId: 'TXN-CIN-998822',
      amount: 37500,
      paymentMethod: 'MOCK_CARD',
      paymentType: 'ADVANCE',
      status: 'SUCCESS',
      paidAt: new Date('2026-09-10'),
    }
  });

  const pendingBooking = await prisma.booking.create({
    data: {
      bookingNumber: 'CIN-2026-0002',
      customerName: 'Rajesh & Simran Gill',
      customerEmail: 'rajesh.gill@example.com',
      customerPhone: '+91 99887 76655',
      eventType: 'Pre-Wedding Shoot',
      eventDate: new Date('2026-11-12'),
      startTime: '06:00',
      endTime: '18:00',
      location: 'Amber Fort & Jal Mahal, Jaipur',
      packageId: romancePreWeddingPkg.id,
      additionalNotes: 'Prefer morning sunrise lighting at Jal Mahal.',
      amount: 35000,
      depositAmount: 10500,
      paidAmount: 10500,
      bookingStatus: 'PENDING',
      paymentStatus: 'PARTIAL',
    },
  });

  await prisma.payment.create({
    data: {
      bookingId: pendingBooking.id,
      transactionId: 'TXN-CIN-998823',
      amount: 10500,
      paymentMethod: 'MOCK_CARD',
      paymentType: 'ADVANCE',
      status: 'SUCCESS',
      paidAt: new Date('2026-09-12'),
    }
  });

  const completedBooking = await prisma.booking.create({
    data: {
      bookingNumber: 'CIN-2026-0003',
      customerName: 'Aarav & Diya Gupta',
      customerEmail: 'aarav.gupta@example.com',
      customerPhone: '+91 91234 56789',
      eventType: 'Engagement',
      eventDate: new Date('2026-08-15'),
      startTime: '16:00',
      endTime: '22:00',
      location: 'Taj Lands End, Mumbai',
      packageId: engagementGalaPkg.id,
      additionalNotes: 'Indoor air-conditioned ballroom venue.',
      amount: 50000,
      depositAmount: 15000,
      paidAmount: 50000,
      bookingStatus: 'COMPLETED',
      paymentStatus: 'PAID',
    },
  });

  await prisma.payment.create({
    data: {
      bookingId: completedBooking.id,
      transactionId: 'TXN-CIN-881144',
      amount: 15000,
      paymentMethod: 'MOCK_CARD',
      paymentType: 'ADVANCE',
      status: 'SUCCESS',
      paidAt: new Date('2026-08-01'),
    }
  });

  await prisma.payment.create({
    data: {
      bookingId: completedBooking.id,
      transactionId: 'TXN-CIN-881145',
      amount: 35000,
      paymentMethod: 'MOCK_CARD',
      paymentType: 'REMAINING',
      status: 'SUCCESS',
      paidAt: new Date('2026-08-15'),
    }
  });

  // 10. Contact messages
  await prisma.contactMessage.create({
    data: {
      name: 'Sunita Mehra',
      email: 'sunita.mehra@example.com',
      phone: '+91 98112 23344',
      eventType: 'Wedding Photography',
      message: 'Hello Cinemayur team! We are planning a 3-day wedding in Goa in January 2027. Do you travel for destination weddings?',
      status: 'UNREAD',
    },
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

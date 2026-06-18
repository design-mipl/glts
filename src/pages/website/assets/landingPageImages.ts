/** Curated travel imagery for homepage Travel Solutions cards (Unsplash). */

export const travelSolutionImages = {
  marine: {
    src: 'https://images.unsplash.com/photo-1494412574640-08084c076e68?auto=format&fit=crop&w=1200&h=750&q=90',
    fallback:
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&h=750&q=90',
    alt: 'Container ship at port for marine crew travel',
  },
  corporate: {
    src: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&h=750&q=90',
    fallback:
      'https://images.unsplash.com/photo-1570168007207-a0e90bb4cde2?auto=format&fit=crop&w=1200&h=750&q=90',
    alt: 'Business professionals in a corporate travel and mobility setting',
  },
  retail: {
    src: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&h=750&q=90',
    fallback:
      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&h=750&q=90',
    alt: 'Leisure travelers on a scenic road trip',
  },
} as const

/** Taller hero imagery on Travel Solutions cards — fixed height keeps cards equal in the grid. */
export const SOLUTION_CARD_IMAGE_HEIGHT = {
  xs: 280,
  md: 320,
} as const

type LandingImageAsset = {
  src: string
  fallback: string
  alt: string
}

/** Editorial imagery for the Why GreenLight Works methodology carousel. */
export const methodologyCarouselImages = {
  whatWeDo: {
    src: 'https://images.unsplash.com/photo-1554224154-26032fced8bd?auto=format&fit=crop&w=1400&h=900&q=90',
    fallback:
      'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=1400&h=900&q=90',
    alt: 'Visa documents and checklist being reviewed before embassy submission',
  },
  whyGreenlight: {
    src: 'https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?auto=format&fit=crop&w=1400&h=900&q=90',
    fallback:
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1400&h=900&q=90',
    alt: 'Professional visa assistance team validating travel documents before submission',
  },
  checkCollage: [
    {
      src: 'https://images.unsplash.com/photo-1618044733300-9472054094ee?auto=format&fit=crop&w=800&h=1200&q=90',
      fallback:
        'https://images.unsplash.com/photo-1554224154-22dec7ec8818?auto=format&fit=crop&w=800&h=1200&q=90',
      alt: 'Passport and visa paperwork prepared for embassy requirements validation',
    },
    {
      src: 'https://images.unsplash.com/photo-1554224154-26032fced8bd?auto=format&fit=crop&w=800&h=600&q=90',
      fallback:
        'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&h=600&q=90',
      alt: 'Document checklist and passport pages being reviewed for accuracy',
    },
    {
      src: 'https://images.unsplash.com/photo-1554224154-e1d77c0c8f4f?auto=format&fit=crop&w=800&h=600&q=90',
      fallback:
        'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&h=600&q=90',
      alt: 'Visa eligibility and compliance checklist for application completeness',
    },
    {
      src: 'https://images.unsplash.com/photo-1581553673739-c4906b5d0de8?auto=format&fit=crop&w=800&h=1200&q=90',
      fallback:
        'https://images.unsplash.com/photo-1554224154-22dec7ec8818?auto=format&fit=crop&w=800&h=1200&q=90',
      alt: 'Approved and stamped travel documents prepared for final submission',
    },
  ] satisfies LandingImageAsset[],
} as const

/** Staggered collage imagery for the homepage hero (right column). */
export const heroCollageImages = [
  {
    src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&h=700&q=90',
    fallback:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&h=700&q=90',
    alt: 'Scenic lake and mountain destination',
  },
  {
    src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&h=1100&q=90',
    fallback:
      'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=900&h=1100&q=90',
    alt: 'Tropical beach and turquoise water',
  },
  {
    src: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1100&h=800&q=90',
    fallback:
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1100&h=800&q=90',
    alt: 'Resort walkway with palm trees and ocean view',
  },
  {
    src: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=700&h=1000&q=90',
    fallback:
      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=700&h=1000&q=90',
    alt: 'Traveler on a scenic road trip adventure',
  },
] as const satisfies readonly LandingImageAsset[]

/** Hero background carousel imagery (travel/location focused). */
export const heroBackgroundCarouselImages = [
  {
    src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2200&h=1300&q=90',
    fallback:
      'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&w=2200&h=1300&q=90',
    alt: 'Aerial view of coastal city and ocean',
  },
  {
    src: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=2200&h=1300&q=90',
    fallback:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2200&h=1300&q=90',
    alt: 'Traveler overlooking mountain lake destination',
  },
  {
    src: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=2200&h=1300&q=90',
    fallback:
      'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=2200&h=1300&q=90',
    alt: 'Urban skyline and travel landmarks at sunset',
  },
] as const

/** Full-width background for the homepage final CTA band. */
export const finalCtaBackgroundImage = {
  src: 'https://images.unsplash.com/photo-1529070538674-2d45b6d94784?auto=format&fit=crop&w=2400&h=900&q=90',
  fallback:
    'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=2400&h=900&q=90',
  alt: 'Commercial airplane flying through the sky',
} as const

/** Destination-style imagery for the homepage Visa Services showcase cards. */
export const visaServiceShowcaseImages = {
  tourist: {
    src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&h=900&q=90',
    fallback:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1400&h=900&q=90',
    alt: 'Scenic tropical destination for tourist visa travel',
  },
  business: {
    src: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?auto=format&fit=crop&w=1400&h=900&q=90',
    fallback:
      'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1400&h=900&q=90',
    alt: 'Business traveler working in an international airport lounge',
  },
  student: {
    src: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1400&h=900&q=90',
    fallback:
      'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1400&h=900&q=90',
    alt: 'International students on a university campus',
  },
  work: {
    src: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&h=900&q=90',
    fallback:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&h=900&q=90',
    alt: 'Professional work setting for overseas employment visa',
  },
  familyVisit: {
    src: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1400&h=900&q=90',
    fallback:
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1400&h=900&q=90',
    alt: 'Family reunion during international travel',
  },
  refusalSupport: {
    src: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1400&h=900&q=90',
    fallback:
      'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=1400&h=900&q=90',
    alt: 'Passport and visa document review consultation',
  },
} as const

/** Additional Travel Services interactive showcase imagery. */
export const additionalTravelServices = [
  {
    id: 'travel-insurance',
    title: 'Travel Insurance',
    description:
      'Comprehensive coverage aligned to your itinerary, embassy requirements, and trip duration — so you travel protected from departure to return.',
    cta: { label: 'Learn More', href: '/countries' },
    image: {
      src: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&h=900&q=90',
      fallback:
        'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&h=900&q=90',
      alt: 'Travel insurance planning with passport and documents',
    },
  },
  {
    id: 'flight-assistance',
    title: 'Flight Assistance',
    description:
      'Booking support, itinerary documentation, and flight confirmations formatted for visa applications and embassy review.',
    cta: { label: 'Get Assistance', href: '/countries' },
    image: {
      src: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&h=900&q=90',
      fallback:
        'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&h=900&q=90',
      alt: 'Airplane wing view during international flight',
    },
  },
  {
    id: 'hotel-bookings',
    title: 'Hotel Bookings',
    description:
      'Confirmed stays that meet proof-of-accommodation standards — with receipts and booking details ready for your visa file.',
    cta: { label: 'Learn More', href: '/countries' },
    image: {
      src: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&h=900&q=90',
      fallback:
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&h=900&q=90',
      alt: 'Premium hotel room for international travel accommodation',
    },
  },
  {
    id: 'forex-assistance',
    title: 'Forex Assistance',
    description:
      'Competitive exchange rates and travel-fund documentation to satisfy embassy financial proof requirements.',
    cta: { label: 'Get Assistance', href: '/countries' },
    image: {
      src: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&w=1200&h=900&q=90',
      fallback:
        'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=1200&h=900&q=90',
      alt: 'International currency and forex for travel',
    },
  },
  {
    id: 'documentation-support',
    title: 'Documentation Support',
    description:
      'Itineraries, invitation letters, cover letters, and supporting paperwork prepared and reviewed end-to-end.',
    cta: { label: 'Learn More', href: '/countries' },
    image: {
      src: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=1200&h=900&q=90',
      fallback:
        'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&h=900&q=90',
      alt: 'Travel documentation and passport paperwork review',
    },
  },
] as const
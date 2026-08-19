/** Full-bleed homepage hero — global mobility composite (local asset, original quality). */
export const landingHeroTravelImage = {
  src: '/images/glts-hero.png?v=3',
  fallback: '/images/glts-hero.png?v=3',
  alt: 'Global mobility — aircraft, cargo shipping, skyline, and corporate travel briefing',
} as const

/** Map pin marker for the How It Works progress track. */
export const howItWorksMapPinImage = {
  src: '/images/how-it-works/map-pin.png',
  fallback: '/images/how-it-works/map-pin.png',
  alt: 'Map location pin',
} as const

/** Real passport cover for the How It Works promo card. */
export const howItWorksPassportImage = {
  src: '/images/how-it-works-passport.png?v=2',
  fallback: '/images/how-it-works-passport.png?v=2',
  alt: 'Republic of India passport cover',
} as const

/** Supporting visual for the homepage How It Works section. */
export const howItWorksSupportImage = {
  src: 'https://images.unsplash.com/photo-1530521954074-e13fc9781574?auto=format&fit=crop&w=1200&h=1500&q=90',
  fallback:
    'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&h=1500&q=90',
  alt: 'Traveler in a modern airport terminal looking toward departure gates',
} as const

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

/** Premium travel still for the Why Choose GreenLight section. */
export const whyChooseGreenlightImage = {
  src: '/images/why-choose-greenlight.png',
  fallback: '/images/why-choose-greenlight.png',
  alt: 'Premium travel essentials — suitcase, map, and journey-ready details',
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
  src: '/images/final-cta-hero.png',
  fallback: '/images/final-cta-hero.png',
  alt: 'Travelers at a port toward a city skyline with ship and airplane at sunset',
} as const

/** Premium editorial image for the FAQ section left support card. */
export const faqSupportCardImage = {
  src: '/images/faq/support-card.png',
  fallback: '/images/faq/support-card.png',
  alt: 'Indian passport and boarding pass in an airport lounge overlooking a runway at sunset',
} as const

/** Destination-style imagery for the homepage Visa Services showcase cards. */
export const visaServiceShowcaseImages = {
  tourist: {
    src: '/images/visa-services/tourist.png',
    fallback: '/images/visa-services/tourist.png',
    alt: 'Couple relaxing on a tropical beach — tourist visa travel',
  },
  business: {
    src: '/images/visa-services/business.png',
    fallback: '/images/visa-services/business.png',
    alt: 'Business traveler with passport and suitcase in an airport terminal',
  },
  student: {
    src: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1400&h=900&q=90',
    fallback:
      'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1400&h=900&q=90',
    alt: 'International students on a university campus',
  },
  transit: {
    src: '/images/visa-services/transit.png',
    fallback: '/images/visa-services/transit.png',
    alt: 'Traveler walking through a modern airport terminal during transit',
  },
  family: {
    src: '/images/visa-services/tourist.png',
    fallback: '/images/visa-services/tourist.png',
    alt: 'Family preparing travel documents for a visit visa',
  },
  other: {
    src: '/images/visa-services/business.png',
    fallback: '/images/visa-services/business.png',
    alt: 'Visa specialist reviewing a country-specific application',
  },
} as const

/** Featured + compact cards for the homepage Additional Services section. */
export const additionalServicesFeatured = {
  id: 'travel-insurance',
  title: 'Travel Insurance',
  description: 'Comprehensive travel protection for every journey.',
  href: '/v2/countries',
  image: {
    src: '/images/additional-services/travel-insurance.png?v=2',
    fallback: '/images/additional-services/travel-insurance.png?v=2',
    alt: 'Couple overlooking a coastal landscape — travel with peace of mind',
    objectPosition: '72% center',
  },
} as const

export const additionalServicesGrid = [
  {
    id: 'student-visa-guidance',
    title: 'Student Visa Guidance',
    description: 'Expert support for study-abroad applications.',
    href: '/v2/countries',
    image: {
      src: '/images/additional-services/student-visa-guidance.png',
      fallback: '/images/additional-services/student-visa-guidance.png',
      alt: 'Student studying in a library',
    },
  },
  {
    id: 'senior-citizen-assistance',
    title: 'Senior Citizen Assistance',
    description: 'Patient, guided help for senior travelers.',
    href: '/v2/countries',
    image: {
      src: '/images/additional-services/senior-citizen-assistance.png',
      fallback: '/images/additional-services/senior-citizen-assistance.png',
      alt: 'Senior couple reviewing travel plans together',
    },
  },
  {
    id: 'guided-document-preparation',
    title: 'Guided Document Preparation',
    description: 'Step-by-step checklist and file review.',
    href: '/v2/countries',
    image: {
      src: '/images/additional-services/guided-document-preparation.png',
      fallback: '/images/additional-services/guided-document-preparation.png',
      alt: 'Visa specialist reviewing a document checklist',
    },
  },
  {
    id: 'travel-documentation',
    title: 'Travel Documentation',
    description: 'Itineraries, letters, and embassy-ready paperwork.',
    href: '/v2/countries',
    image: {
      src: '/images/additional-services/travel-documentation.png',
      fallback: '/images/additional-services/travel-documentation.png',
      alt: 'Passport and travel documents organizer',
    },
  },
  {
    id: 'hotels',
    title: 'Hotels',
    description: 'Confirmed stays that meet visa requirements.',
    href: '/v2/countries',
    image: {
      src: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&h=800&q=90',
      fallback:
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&h=800&q=90',
      alt: 'Premium hotel accommodation for international travel',
    },
  },
  {
    id: 'airport-transfers',
    title: 'Airport Transfers',
    description: 'Reliable pickups from arrival to destination.',
    href: '/v2/countries',
    image: {
      src: '/images/additional-services/airport-transfers.png',
      fallback: '/images/additional-services/airport-transfers.png',
      alt: 'Chauffeur greeting a traveler at airport arrivals',
    },
  },
  {
    id: 'forex',
    title: 'Forex',
    description: 'Competitive rates and travel-fund support.',
    href: '/v2/countries',
    image: {
      src: '/images/additional-services/forex.png',
      fallback: '/images/additional-services/forex.png',
      alt: 'Foreign currency exchange at a travel desk',
    },
  },
  {
    id: 'holidays',
    title: 'Holidays',
    description: 'Curated holiday packages beyond your visa.',
    href: '/v2/countries',
    image: {
      src: '/images/additional-services/holidays.png',
      fallback: '/images/additional-services/holidays.png',
      alt: 'Couple relaxing on a beach holiday',
    },
  },
] as const

/** Retail-safe services for the expanding horizontal Additional Services slider. */
export const additionalServicesSlider = [
  {
    id: 'travel-insurance',
    title: 'Travel Insurance',
    description: 'Travel protection options aligned to your itinerary and visa journey.',
    ctaLabel: 'View Options',
    href: '/v2/countries',
    image: additionalServicesFeatured.image,
  },
  {
    id: 'ticket-for-visa',
    title: 'Ticket for Visa',
    description: 'Flight reservation support for visa documentation where required.',
    ctaLabel: 'Check Details',
    href: '/v2/countries',
    image: {
      src: '/images/additional-services/travel-documentation.png',
      fallback: '/images/additional-services/travel-documentation.png',
      alt: 'Flight itinerary and travel documents prepared for a visa application',
    },
  },
  {
    id: 'hotel-booking-for-visa',
    title: 'Hotel Booking for Visa',
    description: 'Accommodation booking support for embassy-ready application files.',
    ctaLabel: 'Check Details',
    href: '/v2/countries',
    image: {
      src: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&h=800&q=90',
      fallback:
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&h=800&q=90',
      alt: 'Hotel accommodation prepared for visa documentation',
    },
  },
  {
    id: 'passport-assistance',
    title: 'Passport Assistance',
    description: 'Support for passport readiness checks before visa submission.',
    ctaLabel: 'Check Details',
    href: '/v2/countries',
    image: {
      src: '/images/additional-services/guided-document-preparation.png',
      fallback: '/images/additional-services/guided-document-preparation.png',
      alt: 'Passport and document checklist reviewed before visa submission',
    },
  },
  {
    id: 'appointment-assistance',
    title: 'Appointment Assistance',
    description: 'Guidance for visa appointments, biometrics and submission scheduling.',
    ctaLabel: 'Check Details',
    href: '/v2/countries',
    image: {
      src: '/images/additional-services/senior-citizen-assistance.png',
      fallback: '/images/additional-services/senior-citizen-assistance.png',
      alt: 'Traveler receiving guided appointment assistance',
    },
  },
] as const

/** @deprecated Prefer `additionalServicesSlider`. */
export const additionalTravelServices = additionalServicesSlider.map((service) => ({
  id: service.id,
  title: service.title,
  description: service.description,
  cta: { label: service.ctaLabel, href: service.href },
  image: service.image,
}))

import type { FAQItem } from '../../components/FAQSection'
import type { TestimonialItem } from '../../components/TestimonialSection'
import type { VisaCategoryCardItem } from '../../components/VisaCategoryCardsSection'
import { testimonialPortraits } from '../../assets/testimonialPortraits'

export const marineVisaCategories: VisaCategoryCardItem[] = [
  {
    id: 'seafarer-crew-visas',
    title: 'Seafarer / Crew Visas',
    description: 'Documentation and embassy filing for crew joining and leaving vessels worldwide.',
    image: {
      src: '/images/marine-visa-categories/seafarer-crew-visas.png',
      fallback: '/images/marine-visa-categories/seafarer-crew-visas.png',
      alt: 'Port operations supervisor directing crew alongside a container vessel',
    },
  },
  {
    id: 'offshore-crew-visas',
    title: 'Offshore Crew Visas',
    description: 'Visa support for offshore rotations, platform movements, and remote deployment schedules.',
    image: {
      src: '/images/marine-visa-categories/offshore-crew-visas.png',
      fallback: '/images/marine-visa-categories/offshore-crew-visas.png',
      alt: 'Offshore crew walking a vessel deck at sunset during rotation',
    },
  },
  {
    id: 'superintendent-visas',
    title: 'Superintendent Visas',
    description: 'Business and assignment visas for superintendents, inspectors, and marine specialists.',
    image: {
      src: '/images/marine-visa-categories/superintendent-visas.png',
      fallback: '/images/marine-visa-categories/superintendent-visas.png',
      alt: 'Marine superintendents reviewing vessel plans during a shipyard inspection',
    },
  },
]

export const marineFaqs: FAQItem[] = [
  {
    q: 'Can you process visas for crew joining vessels at short notice?',
    a: 'Yes. Marine crew workflows are built around tight sailing schedules, with priority handling available for urgent rotations and port-of-call movements.',
  },
  {
    q: 'Do you support offshore crew and superintendent travel?',
    a: 'We handle seafarer visas, offshore crew movements, and superintendent travel documentation based on destination, flag state, and assignment type.',
  },
  {
    q: 'What documents are required for seafarer visa applications?',
    a: 'Requirements vary by destination, but typically include seaman book, employment contract, vessel particulars, and employer support letters. We provide a checklist before filing.',
  },
  {
    q: 'How do you handle urgent port-of-call visa requirements?',
    a: 'Our marine desk coordinates embassy submissions against sailing windows and port schedules, with escalation paths for time-critical joiners and sign-offs.',
  },
  {
    q: 'Can multiple crew members be managed under one account?',
    a: 'Yes. Shipping companies and crew management firms can manage multiple crew applications, rotations, and documentation records in one workspace.',
  },
  {
    q: 'Do you maintain compliance records for marine crew travel?',
    a: 'Yes. Compliance record management is available as part of marine support and retainer services, including audit-ready documentation trails.',
  },
  {
    q: 'Which destinations do you support for marine crew visas?',
    a: 'We support major crew-change hubs and common marine destinations worldwide. Eligibility and document requirements are confirmed before filing for each country.',
  },
  {
    q: 'Can you coordinate transit and joining documentation together?',
    a: 'Yes. Travel and transit documentation can be handled alongside visa filing so crew arrive with embassy-ready paperwork aligned to vessel schedules.',
  },
  {
    q: 'Is 24×7 support available for marine travel emergencies?',
    a: 'Round-the-clock assistance is available for itinerary changes, urgent joiners, and travel coordination during active marine operations.',
  },
]

export type MarineCompanyType = {
  title: string
  description: string
  image: { src: string; fallback: string; alt: string }
  entrance: 'from-top' | 'from-bottom'
}

export const marineCompanyTypes: MarineCompanyType[] = [
  {
    title: 'Shipping Companies',
    description: 'Fleet operators managing crew rotations across international routes and port calls.',
    image: {
      src: '/images/marine-companies/shipping-companies.png',
      fallback: '/images/marine-companies/shipping-companies.png',
      alt: 'Cargo vessel and shipping fleet at international port',
    },
    entrance: 'from-top',
  },
  {
    title: 'Crew Management Firms',
    description: 'Manning agencies coordinating visas for multi-vessel crew deployment programs.',
    image: {
      src: '/images/marine-companies/crew-management.png',
      fallback: '/images/marine-companies/crew-management.png',
      alt: 'Maritime crew coordination and vessel staffing operations',
    },
    entrance: 'from-bottom',
  },
  {
    title: 'Offshore Service Providers',
    description: 'Offshore operators supporting platform crews, specialists, and rotation logistics.',
    image: {
      src: '/images/marine-companies/offshore-operators.png',
      fallback: '/images/marine-companies/offshore-operators.png',
      alt: 'Offshore platform and remote marine operations',
    },
    entrance: 'from-top',
  },
]

export const marineAdditionalServices = [
  {
    id: 'travel-transit-documentation',
    title: 'Travel & Transit Documentation',
    description:
      'Complete documentation support including travel itineraries, transit permits, invitation letters, and embassy-ready paperwork.',
    ctaLabel: 'Get Started',
    href: '/track',
    image: {
      src: '/images/marine-additional-services/travel-transit-documentation.png',
      fallback: '/images/marine-additional-services/travel-transit-documentation.png',
      alt: 'Passport, boarding passes, and visa paperwork arranged for travel documentation',
    },
  },
  {
    id: 'compliance-record-management',
    title: 'Compliance Record Management',
    description:
      'Secure management of crew documentation, compliance records, certifications, and renewal tracking.',
    ctaLabel: 'Learn More',
    href: '/track',
    image: {
      src: '/images/marine-additional-services/compliance-record-management.png',
      fallback: '/images/marine-additional-services/compliance-record-management.png',
      alt: 'Compliance officer reviewing maritime documentation with port operations in view',
    },
  },
  {
    id: 'travel-insurance-support',
    title: 'Travel Insurance Support',
    description:
      'Comprehensive travel insurance solutions for crew members and offshore professionals.',
    ctaLabel: 'Learn More',
    href: '/track',
    image: {
      src: '/images/marine-additional-services/travel-insurance-support.png',
      fallback: '/images/marine-additional-services/travel-insurance-support.png',
      alt: 'Travel consultant advising a client on travel insurance coverage',
    },
  },
  {
    id: 'forex-support',
    title: 'Forex Support',
    description:
      'Foreign currency exchange assistance with competitive rates for international travel.',
    ctaLabel: 'Learn More',
    href: '/track',
    image: {
      src: '/images/marine-additional-services/forex-support.png',
      fallback: '/images/marine-additional-services/forex-support.png',
      alt: 'International currencies and payment card on a world map',
    },
  },
  {
    id: 'travel-assistance-24x7',
    title: '24×7 Travel Assistance',
    description:
      'Round-the-clock support for itinerary changes, emergencies, and travel coordination.',
    ctaLabel: 'Learn More',
    href: '/track',
    image: {
      src: '/images/marine-additional-services/travel-assistance-24x7.png',
      fallback: '/images/marine-additional-services/travel-assistance-24x7.png',
      alt: 'Travel specialist providing round-the-clock assistance at a service desk',
    },
  },
] as const

export const marineRetainerPlans = [
  {
    id: 'single-voyage',
    title: 'Single Voyage Plan',
    description: 'Perfect for one-time visa requirements.',
    icon: 'ship',
  },
  {
    id: 'multi-voyage',
    title: 'Multi Voyage Plan',
    description: 'Cost-effective solutions for multiple voyages.',
    icon: 'globe',
  },
  {
    id: 'fleet-management',
    title: 'Fleet Management Plan',
    description: 'Centralized visa management for your entire fleet.',
    icon: 'fleet',
  },
  {
    id: 'custom-enterprise',
    title: 'Custom Enterprise Plan',
    description: 'Tailored solutions for large shipping organizations.',
    icon: 'building',
  },
] as const

export const marineRetainerPlansHeading = 'Flexible Plans. Reliable Partnership.'

export const marineRetainerPlansSubtitle =
  'Flexible plans designed for shipping companies of all sizes. Choose the plan that fits your operations and scale with confidence.'

export const marineRetainerPlansImage = {
  src: '/images/marine-retainer-plans/cargo-ship.png',
  fallback: '/images/marine-retainer-plans/cargo-ship.png',
  alt: 'Aerial view of a cargo container ship underway at sea',
} as const

export const marineTestimonials: TestimonialItem[] = [
  {
    quote:
      'We rotated 312 crew across 14 ports last quarter without a single missed sailing. Their marine travel desk is an extension of our operations team.',
    name: 'Hiroshi Kondo',
    service: 'Shipping Company · Crew Operations',
    initials: 'HK',
    avatarBg: 'linear-gradient(135deg, #0A2540 0%, #1E4D6B 100%)',
    avatarSrc: testimonialPortraits.hiroshiKondo,
    rating: 4.5,
  },
  {
    quote:
      'Port clearance delays dropped once GreenLight took over document review and embassy coordination for our offshore rotations.',
    name: 'Maria Santos',
    service: 'Offshore Operator · Crewing Manager',
    initials: 'MS',
    avatarBg: 'linear-gradient(135deg, #123B5C 0%, #0A2540 100%)',
    avatarSrc: testimonialPortraits.mariaSantos,
    rating: 4.5,
  },
  {
    quote:
      'Their team cleared 28 seafarers for a Singapore port call in under 72 hours. We finally have a visa partner that understands sailing schedules.',
    name: 'Lars Eriksson',
    service: 'Crew Manager · Baltic Fleet Services',
    initials: 'LE',
    avatarBg: 'linear-gradient(135deg, #4A8F3F 0%, #73C064 100%)',
    avatarSrc: testimonialPortraits.larsEriksson,
    rating: 4.5,
  },
  {
    quote:
      'From seaman book review to embassy submission, every step was tracked. Our manning agency reduced rework on marine visa files by half.',
    name: 'Ananya Desai',
    service: 'Crew Management Firm',
    initials: 'AD',
    avatarBg: 'linear-gradient(135deg, #5A9A4E 0%, #73C064 100%)',
    avatarSrc: testimonialPortraits.ananyaDesai,
    rating: 4.5,
  },
  {
    quote:
      'Superintendent travel and platform crew rotations are handled in one place. Compliance records are always ready when auditors ask.',
    name: 'James Whitfield',
    service: 'Offshore Service Provider',
    initials: 'JW',
    avatarBg: 'linear-gradient(135deg, #1E4D6B 0%, #73C064 100%)',
    avatarSrc: testimonialPortraits.jamesWhitfield,
    rating: 4.5,
  },
  {
    quote:
      'Urgent joiners used to derail our port windows. GreenLight built a marine workflow that keeps vessels moving and crew compliant.',
    name: 'Fatima Al-Hassan',
    service: 'Shipping Company · Marine HR',
    initials: 'FA',
    avatarBg: 'linear-gradient(135deg, #73C064 0%, #4A8F3F 100%)',
    avatarSrc: testimonialPortraits.fatimaAlHassan,
    rating: 4.5,
  },
]

export const marineHeroCtas = {
  primary: { label: 'Talk to a Marine Visa Specialist', href: '/track' },
  secondary: { label: 'Request a Consultation', href: '/track' },
} as const

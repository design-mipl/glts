import {
  servicesHeroImage,
  servicesCategoryImages,
  servicesAdditionalImages,
  servicesFinalCtaImage,
} from '../../assets/servicesPageImages'

export const servicesHeroContent = {
  label: 'OUR SERVICES',
  heading: 'Expert Visa Solutions for Every Journey',
  description:
    'GreenLight provides expert-led visa services for individuals, businesses, and marine professionals — accurate, compliant, and guided from start to approval.',
  primaryCta: { label: 'Explore Services', href: '#service-categories' },
  image: servicesHeroImage,
} as const

export const serviceCategories: {
  id: string
  title: string
  description: string
  highlights: string[]
  ctaLabel: string
  href: string
  image: { src: string; fallback: string; alt: string; objectPosition?: string }
}[] = [
  {
    id: 'retail',
    title: 'Retail Visa Services',
    description:
      'Guided visa assistance for tourists, families, students, and individual travelers who need clear requirements and embassy-ready files.',
    highlights: [
      'Tourist & leisure visas',
      'Family & visit applications',
      'Student visa guidance',
      'Document checklist support',
      'Real-time application tracking',
    ],
    ctaLabel: 'View Retail Services',
    href: '/',
    image: servicesCategoryImages.retail,
  },
  {
    id: 'corporate',
    title: 'Corporate Visa Services',
    description:
      'Business travel and mobility support for HR teams, executives, and project travelers who need reliable turnaround and compliance.',
    highlights: [
      'Business & project visas',
      'Dedicated account coordination',
      'Bulk application handling',
      'Embassy-ready documentation',
      'Priority processing options',
    ],
    ctaLabel: 'View Corporate Services',
    href: '/corporate',
    image: servicesCategoryImages.corporate,
  },
  {
    id: 'marine',
    title: 'Marine Visa Services',
    description:
      'Crew and offshore visa handling for shipping companies, crew managers, and marine professionals operating on tight deployment schedules.',
    highlights: [
      'Seafarer & crew visas',
      'Offshore crew support',
      'Superintendent visas',
      'Transit documentation',
      'Port-of-call coordination',
    ],
    ctaLabel: 'View Marine Services',
    href: '/marine-crew',
    image: servicesCategoryImages.marine,
  },
]

export const servicesAdditional = {
  featured: {
    id: 'travel-transit-documentation',
    title: 'Travel & Transit Documentation',
    description:
      'Itineraries, transit letters, and embassy-ready paperwork that keep travelers moving without documentation gaps.',
    ctaLabel: 'Learn More',
    href: '/track',
    image: servicesAdditionalImages.travelTransit,
  },
  cards: [
    {
      id: 'compliance-record-management',
      title: 'Compliance Record Management',
      description: 'Centralized visa records and audit-ready documentation trails.',
      ctaLabel: 'Learn More',
      href: '/track',
      image: servicesAdditionalImages.compliance,
    },
    {
      id: 'travel-insurance-support',
      title: 'Travel Insurance Support',
      description: 'Travel protection assistance tailored to trip type and duration.',
      ctaLabel: 'Learn More',
      href: '/track',
      image: servicesAdditionalImages.insurance,
    },
    {
      id: 'forex-support',
      title: 'Forex Support',
      description: 'Foreign exchange assistance for travel funds and assignments.',
      ctaLabel: 'Learn More',
      href: '/track',
      image: servicesAdditionalImages.forex,
    },
  ],
} as const

export const servicesFinalCta = {
  heading: 'Need Help Choosing the Right Service?',
  description:
    'Our visa specialists will help you select the right solution based on your travel needs.',
  primaryButton: { label: 'Contact Us', href: '/track' },
  secondaryButton: { label: 'Request Consultation', href: '/track' },
  image: servicesFinalCtaImage,
} as const

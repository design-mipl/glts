import {
  LayoutDashboard,
  ShieldCheck,
  Send,
  Radio,
  type LucideIcon,
} from 'lucide-react'
import type { FAQItem } from '../../components/FAQSection'
import type { TestimonialItem } from '../../components/TestimonialSection'
import type { VisaCategoryCardItem } from '../../components/VisaCategoryCardsSection'
import { testimonialPortraits } from '../../assets/testimonialPortraits'

export const marineImpactPoints = [
  {
    title: 'Missed sailings',
    description: 'Crew cannot join vessels on schedule when visa processing falls behind rotation windows.',
  },
  {
    title: 'Crew rotation issues',
    description: 'Overlapping contracts and reliefs create documentation pressure across multiple movements.',
  },
  {
    title: 'Port clearance delays',
    description: 'Incomplete or incorrect visa documentation slows embarkation and disembarkation.',
  },
  {
    title: 'Operational impact',
    description: 'Fleet schedules, manning plans, and client commitments are affected by travel delays.',
  },
]

export const marineAccuracyVisuals = {
  badgeLabel: 'Global Marine Operations',
  primary: {
    src: 'https://images.unsplash.com/photo-1494412574640-08084c076e68?auto=format&fit=crop&w=1200&h=1400&q=90',
    fallback:
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&h=1400&q=90',
    alt: 'Cargo vessel departing international port',
  },
  secondaryTop: {
    src: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=1000&h=700&q=90',
    fallback:
      'https://images.unsplash.com/photo-1569396116180-210c182bedb8?auto=format&fit=crop&w=1000&h=700&q=90',
    alt: 'Offshore operations and marine platform logistics',
  },
  secondaryBottom: {
    src: 'https://images.unsplash.com/photo-1473445361085-b9a07f55608b?auto=format&fit=crop&w=1000&h=700&q=90',
    fallback:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1000&h=700&q=90',
    alt: 'Crew operations and vessel movement scheduling',
  },
} as const

export const marineVisaCategories: VisaCategoryCardItem[] = [
  {
    id: 'seafarer-crew-visas',
    title: 'Seafarer / Crew Visas',
    description: 'Documentation and embassy filing for crew joining and leaving vessels worldwide.',
    image: {
      src: 'https://images.unsplash.com/photo-1494412574640-08084c076e68?auto=format&fit=crop&w=1200&h=750&q=90',
      fallback:
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&h=750&q=90',
      alt: 'Cargo vessel for seafarer and crew visa category',
    },
  },
  {
    id: 'offshore-crew-visas',
    title: 'Offshore Crew Visas',
    description: 'Visa support for offshore rotations, platform movements, and remote deployment schedules.',
    image: {
      src: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=1200&h=750&q=90',
      fallback:
        'https://images.unsplash.com/photo-1569396116180-210c182bedb8?auto=format&fit=crop&w=1200&h=750&q=90',
      alt: 'Offshore platform operations for offshore crew visas',
    },
  },
  {
    id: 'superintendent-visas',
    title: 'Superintendent Visas',
    description: 'Business and assignment visas for superintendents, inspectors, and marine specialists.',
    image: {
      src: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1200&h=750&q=90',
      fallback:
        'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&h=750&q=90',
      alt: 'Marine inspection and superintendent assignments',
    },
  },
]

export const marineDestinations = [
  'China',
  'Belgium',
  'Netherlands',
  'Australia',
  'France',
  'Philippines',
  'United States',
  'Singapore',
  'United Kingdom',
  'South Korea',
] as const

export const marineProcessSteps: {
  title: string
  description: string
  icon: LucideIcon
}[] = [
  {
    title: 'Requirements Visible on Portal',
    description:
      'Country-specific crew visa requirements, checklists, and submission rules are available before filing begins.',
    icon: LayoutDashboard,
  },
  {
    title: 'Detailed Document Review',
    description:
      'Marine specialists review seafarer books, contracts, joining instructions, and embassy requirements.',
    icon: ShieldCheck,
  },
  {
    title: 'Application & Submission Handling',
    description:
      'Applications are prepared and submitted according to crew movement schedules and vessel timelines.',
    icon: Send,
  },
  {
    title: 'Tracking & Live Updates',
    description:
      'Coordinators receive live status updates, milestone alerts, and visibility across active crew cases.',
    icon: Radio,
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
      src: 'https://images.unsplash.com/photo-1494412574640-08084c076e68?auto=format&fit=crop&w=800&h=600&q=90',
      fallback:
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&h=600&q=90',
      alt: 'Cargo vessel and shipping fleet at international port',
    },
    entrance: 'from-top',
  },
  {
    title: 'Crew Management Firms',
    description: 'Manning agencies coordinating visas for multi-vessel crew deployment programs.',
    image: {
      src: 'https://images.unsplash.com/photo-1473445361085-b9a07f55608b?auto=format&fit=crop&w=800&h=600&q=90',
      fallback:
        'https://images.unsplash.com/photo-1578575437140-597bb0e5c8c0?auto=format&fit=crop&w=800&h=600&q=90',
      alt: 'Maritime crew coordination and vessel staffing operations',
    },
    entrance: 'from-bottom',
  },
  {
    title: 'Offshore Service Providers',
    description: 'Offshore operators supporting platform crews, specialists, and rotation logistics.',
    image: {
      src: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=800&h=600&q=90',
      fallback:
        'https://images.unsplash.com/photo-1569396116180-210c182bedb8?auto=format&fit=crop&w=800&h=600&q=90',
      alt: 'Offshore platform and remote marine operations',
    },
    entrance: 'from-top',
  },
]

export const marineAdditionalServiceCards = [
  {
    id: 'travel-transit-documentation',
    title: 'Travel & Transit Documentation',
    points: [
      'Crew travel documentation',
      'Port-entry requirements',
      'Transit coordination',
    ],
    image:
      'https://images.unsplash.com/photo-1494412574640-08084c076e68?auto=format&fit=crop&w=1200&h=900&q=90',
    fallback:
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&h=900&q=90',
  },
  {
    id: 'compliance-record-management',
    title: 'Compliance Record Management',
    points: [
      'Audit-ready records',
      'Crew documentation tracking',
      'Compliance support',
    ],
    image:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&h=900&q=90',
    fallback:
      'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=1200&h=900&q=90',
  },
  {
    id: 'travel-insurance-support',
    title: 'Travel Insurance Support',
    points: ['Crew travel protection', 'Medical travel coverage'],
    image:
      'https://images.unsplash.com/photo-1554224154-26032fced8bd?auto=format&fit=crop&w=1200&h=900&q=90',
    fallback:
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&h=900&q=90',
  },
  {
    id: 'forex-support',
    title: 'Forex Support',
    points: ['Currency exchange assistance', 'International travel support'],
    image:
      'https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&w=1200&h=900&q=90',
    fallback:
      'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=1200&h=900&q=90',
  },
] as const

export const marineRetainerPlans = [
  'Dedicated account manager',
  'Priority processing',
  'Documentation management',
  'Monthly reporting',
  'Escalation support',
]

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

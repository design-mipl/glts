import {
  CalendarX,
  Clock,
  Plane,
  CircleDollarSign,
  Building2,
  FileCheck2,
  BadgeCheck,
  Headphones,
  Globe2,
  type LucideIcon,
} from 'lucide-react'
import type { FAQItem } from '../../components/FAQSection'
import type { TestimonialItem } from '../../components/TestimonialSection'
import type { VisaCategoryCardItem } from '../../components/VisaCategoryCardsSection'
import { testimonialPortraits } from '../../assets/testimonialPortraits'

export const corporateHeroCtas = {
  primary: { label: 'Speak with Our Corporate Team', href: '/track' },
  secondary: { label: 'Schedule a Consultation', href: '/track' },
} as const

export const corporateHeroStats: {
  value: string
  label: string
  icon: LucideIcon
}[] = [
  { value: '500+', label: 'Corporate Clients', icon: Building2 },
  { value: '25,000+', label: 'Business Visas Processed', icon: FileCheck2 },
  { value: '98%', label: 'Approval Success Rate*', icon: BadgeCheck },
  { value: '24/7', label: 'Dedicated Corporate Support', icon: Headphones },
  { value: '35+', label: 'Countries Covered', icon: Globe2 },
]

export const corporateTestimonials: TestimonialItem[] = [
  {
    quote:
      'Their team handled our 40-person delegation visas without a single embassy rejection. Reporting and escalation support made coordination straightforward.',
    name: 'Rajesh Mehta',
    service: 'HR Director · Multinational Tech',
    initials: 'RM',
    avatarBg: 'linear-gradient(135deg, #4A8F3F 0%, #73C064 100%)',
    avatarSrc: testimonialPortraits.rajeshMehta,
    rating: 4.5,
  },
  {
    quote:
      'From document checklist to courier tracking, everything was transparent. Business visas to Singapore were processed ahead of our conference deadline.',
    name: 'Elena Vasquez',
    service: 'Corporate Travel Coordinator',
    initials: 'EV',
    avatarBg: 'linear-gradient(135deg, #123B5C 0%, #0A2540 100%)',
    avatarSrc: testimonialPortraits.elenaVasquez,
    rating: 4.5,
  },
  {
    quote:
      'Our mobility team manages 200+ employee trips a year. GreenLight gives us one dashboard for requirements, filings, and live status across regions.',
    name: 'David Okonkwo',
    service: 'Global Mobility · HR Team',
    initials: 'DO',
    avatarBg: 'linear-gradient(135deg, #0A2540 0%, #1E4D6B 100%)',
    avatarSrc: testimonialPortraits.davidOkonkwo,
    rating: 4.5,
  },
  {
    quote:
      'Group applications for our sales summit used to take weeks of back-and-forth. They processed 35 business travelers with consistent embassy-ready files.',
    name: 'Sophie Laurent',
    service: 'Business Travel Manager',
    initials: 'SL',
    avatarBg: 'linear-gradient(135deg, #5A9A4E 0%, #73C064 100%)',
    avatarSrc: testimonialPortraits.sophieLaurent,
    rating: 4.5,
  },
  {
    quote:
      'Compliance documentation for cross-border assignments is finally centralized. Our legal and HR teams trust the audit trail on every corporate case.',
    name: 'Michael Chen',
    service: 'Multinational Company · Compliance',
    initials: 'MC',
    avatarBg: 'linear-gradient(135deg, #1E4D6B 0%, #73C064 100%)',
    avatarSrc: testimonialPortraits.michaelChen,
    rating: 4.5,
  },
  {
    quote:
      'Dedicated account support means our travel coordinators get answers the same day. Visa delays no longer derail client meetings or site visits.',
    name: 'Priya Nair',
    service: 'Corporate Travel Coordinator',
    initials: 'PN',
    avatarBg: 'linear-gradient(135deg, #73C064 0%, #4A8F3F 100%)',
    avatarSrc: testimonialPortraits.priyaNair,
    rating: 4.5,
  },
]

export const corporateFaqs: FAQItem[] = [
  {
    q: 'How do you handle urgent business travel visa requests?',
    a: 'Corporate accounts receive priority review, dedicated escalation paths, and timeline estimates before submission so travel coordinators can plan around meeting dates.',
  },
  {
    q: 'Can we manage employee visas across multiple destinations?',
    a: 'Yes. Corporate portals support multi-country business visa workflows, centralized document storage, and live status for authorized team members.',
  },
  {
    q: 'Do you support group visa applications for corporate delegations?',
    a: 'Yes. We coordinate bulk business travel filings, shared documentation standards, and embassy submissions for teams attending conferences, site visits, and client engagements.',
  },
  {
    q: 'How does compliance documentation work for corporate accounts?',
    a: 'Invitation letters, employment records, and embassy-specific requirements are reviewed before filing. Compliance trails are maintained for audit and internal reporting.',
  },
  {
    q: 'Can our travel management team track all active applications?',
    a: 'Yes. Travel coordinators and stakeholders receive live application status, milestone updates, and visibility across active corporate cases from one workspace.',
  },
  {
    q: 'What account support is available for corporate retainer clients?',
    a: 'Retainer plans may include a dedicated account manager, priority processing, documentation management, monthly reporting, and escalation handling.',
  },
]

export const corporateImpactPoints = [
  {
    title: 'Missed Meetings',
    description: 'Business travelers cannot enter destination countries on schedule.',
    icon: CalendarX,
  },
  {
    title: 'Project Delays',
    description: 'Incomplete documentation and visa processing gaps impact project timelines.',
    icon: Clock,
  },
  {
    title: 'Travel Interruptions',
    description: 'Assignment travel, site visits, and client engagements are disrupted.',
    icon: Plane,
  },
  {
    title: 'Operational Costs',
    description: 'Rebooking, rescheduling, and last-minute travel changes increase costs.',
    icon: CircleDollarSign,
  },
] as const

export const corporateAccuracyVisuals = {
  badgeLabel: 'Enterprise Travel Support',
  primary: {
    src: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&h=1400&q=90',
    fallback:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&h=1400&q=90',
    alt: 'International corporate team collaboration',
  },
  secondaryTop: {
    src: 'https://images.unsplash.com/photo-1577415124269-fc1140a69e91?auto=format&fit=crop&w=1000&h=700&q=90',
    fallback:
      'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1000&h=700&q=90',
    alt: 'Business travelers in airport and mobility planning context',
  },
  secondaryBottom: {
    src: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1000&h=700&q=90',
    fallback:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1000&h=700&q=90',
    alt: 'Project deployment and international workforce operations',
  },
} as const

export const corporateVisaCategories: VisaCategoryCardItem[] = [
  {
    id: 'business-travel-visas',
    title: 'Business Travel Visas',
    description:
      'Visa handling for meetings, conferences, client visits, and business travel requirements.',
    image: {
      src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&h=750&q=90',
      fallback:
        'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&h=750&q=90',
      alt: 'Corporate meeting and business travel planning',
    },
  },
  {
    id: 'project-assignment-visas',
    title: 'Project & Assignment Visas',
    description:
      'Specialized visa support for project deployments, temporary assignments, and international workforce mobility.',
    image: {
      src: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&h=750&q=90',
      fallback:
        'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&h=750&q=90',
      alt: 'Project teams and global assignment mobility',
    },
  },
]

export const corporateAdditionalServices = [
  {
    id: 'travel-transit-documentation',
    title: 'Travel & Transit Documentation',
    description:
      'Business travel documentation, transit requirements, and destination-specific travel support for corporate travelers.',
    ctaLabel: 'Get Started',
    href: '/track',
    image: {
      src: '/images/corporate-additional-services/travel-transit-documentation.png',
      fallback: '/images/corporate-additional-services/travel-transit-documentation.png',
      alt: 'Passport, visa booklet, boarding passes, and stamp arranged for travel documentation',
    },
  },
  {
    id: 'compliance-record-management',
    title: 'Compliance Record Management',
    description:
      'Centralized visa records, audit-ready documentation, and compliance tracking for corporate travelers.',
    ctaLabel: 'Learn More',
    href: '/track',
    image: {
      src: '/images/corporate-additional-services/compliance-record-management.png',
      fallback: '/images/corporate-additional-services/compliance-record-management.png',
      alt: 'Compliance checklist and dashboard review for corporate visa records',
    },
  },
  {
    id: 'travel-insurance-support',
    title: 'Travel Insurance Support',
    description:
      'Travel protection and insurance assistance for employees, executives, and project teams.',
    ctaLabel: 'Learn More',
    href: '/track',
    image: {
      src: '/images/corporate-additional-services/travel-insurance-support.png',
      fallback: '/images/corporate-additional-services/travel-insurance-support.png',
      alt: 'Travel insurance application form with passport and boarding passes',
    },
  },
  {
    id: 'forex-support',
    title: 'Forex Support',
    description:
      'Foreign exchange assistance for global business travel and international assignments.',
    ctaLabel: 'Learn More',
    href: '/track',
    image: {
      src: '/images/corporate-additional-services/forex-support.png',
      fallback: '/images/corporate-additional-services/forex-support.png',
      alt: 'International currencies and card on a world map for forex support',
    },
  },
] as const

export const corporateRetainerPlans = [
  {
    id: 'account-manager',
    title: 'Dedicated Corporate Account Manager',
    description: 'A single point of contact for all your needs.',
    icon: 'user',
  },
  {
    id: 'priority-processing',
    title: 'Priority Visa Processing',
    description: 'Faster turnaround and priority handling.',
    icon: 'priority',
  },
  {
    id: 'documentation',
    title: 'Documentation Management',
    description: 'End-to-end handling with accuracy.',
    icon: 'docs',
  },
  {
    id: 'reporting',
    title: 'Monthly Activity & Status Reporting',
    description: 'Regular insights and performance updates.',
    icon: 'reporting',
  },
  {
    id: 'escalation',
    title: 'Escalation Handling',
    description: 'Quick resolution with priority escalation.',
    icon: 'escalation',
  },
] as const

export const corporateRetainerPlansHeading = 'Reliable Support. Measurable Value.'

export const corporateRetainerPlansSubtitle =
  'Retainer plans designed to simplify your corporate travel needs with priority service and expert support.'

export const corporateRetainerPlansImage = {
  src: '/images/corporate-retainer-plans/boardroom.png',
  fallback: '/images/corporate-retainer-plans/boardroom.png',
  alt: 'Modern corporate boardroom overlooking a city skyline',
} as const

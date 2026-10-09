import {
  BadgeCheck,
  Briefcase,
  ClipboardList,
  Eye,
  FileStack,
  GitBranch,
  GraduationCap,
  ListChecks,
  Plane,
  PlaneTakeoff,
  ShieldAlert,
  type LucideIcon,
} from 'lucide-react'
import { retailAdvantageImages } from '../../assets/retailAdvantageImages'
import { retailServiceImages } from '../../assets/retailServiceImages'

/** Public marketing path — avoids conflict with customer portal at `/retail/*`. */
export const RETAIL_PAGE_PATH = '/visa-services'

export const retailHeroCtas = {
  primary: { label: 'Apply Online', href: '/apply/new' },
  secondary: { label: 'Talk to an Expert', href: '/enquiry' },
} as const

export const retailHeroTrustPoints: {
  label: string
  icon: LucideIcon
}[] = [
  { label: 'Expert Review', icon: BadgeCheck },
  { label: 'Transparent Process', icon: Eye },
  { label: 'Real-time Tracking', icon: ListChecks },
]

export const retailServices: {
  id: string
  title: string
  description: string
  href: string
  icon: LucideIcon
  image: {
    src: string
    fallback: string
    alt: string
    objectPosition?: string
  }
}[] = [
  {
    id: 'tourist-family',
    title: 'Tourist & Family Visa',
    description: 'Expert guidance for holidays, family visits, and leisure travel visas.',
    href: '/countries',
    icon: Plane,
    image: retailServiceImages.touristFamily,
  },
  {
    id: 'business',
    title: 'Business Visa',
    description: 'Professional support for meetings, conferences, and business travel.',
    href: '/countries',
    icon: Briefcase,
    image: retailServiceImages.business,
  },
  {
    id: 'student',
    title: 'Student Visa',
    description: 'Complete assistance for overseas education and study travel files.',
    href: '/enquiry',
    icon: GraduationCap,
    image: retailServiceImages.student,
  },
  {
    id: 'transit',
    title: 'Transit Visa',
    description: 'Clear guidance for short stopovers and transit documentation needs.',
    href: '/countries',
    icon: PlaneTakeoff,
    image: retailServiceImages.transit,
  },
  {
    id: 'refusal',
    title: 'Refusal Cases',
    description: 'Specialist review and reapplication support after a visa refusal.',
    href: '/enquiry',
    icon: ShieldAlert,
    image: retailServiceImages.refusal,
  },
]

export const retailAdvantages: {
  id: string
  title: string
  description: string
  icon: LucideIcon
  image: {
    src: string
    fallback: string
    alt: string
    objectPosition: string
  }
}[] = [
  {
    id: 'category-selection',
    title: 'Clear Visa Category Selection',
    description: 'Help applicants choose the correct visa before applying.',
    icon: ClipboardList,
    image: retailAdvantageImages.categorySelection,
  },
  {
    id: 'document-lists',
    title: 'Defined Document Lists',
    description: 'Know exactly which documents are required before submission.',
    icon: FileStack,
    image: retailAdvantageImages.documentLists,
  },
  {
    id: 'fewer-surprises',
    title: 'Fewer Last-minute Surprises',
    description: 'Expert review identifies issues early to reduce delays and rework.',
    icon: BadgeCheck,
    image: retailAdvantageImages.fewerSurprises,
  },
  {
    id: 'transparent-steps',
    title: 'Transparent Steps',
    description: 'Applicants stay informed throughout every stage of the visa process.',
    icon: Eye,
    image: retailAdvantageImages.transparentSteps,
  },
  {
    id: 'defined-workflow',
    title: 'Defined Workflow',
    description:
      'Every application follows a structured review process so nothing important is missed.',
    icon: GitBranch,
    image: retailAdvantageImages.definedWorkflow,
  },
]

export const retailFinalCta = {
  heading: 'Ready to Start Your Visa Application?',
  description: 'Apply online in a few simple steps or speak with our visa experts.',
  primaryButton: { label: 'Apply Online', href: '/apply/new' },
  secondaryButton: { label: 'Talk to an Expert', href: '/enquiry' },
  trustPoints: ['Secure Process', 'Expert Support', 'Real-time Updates'] as const,
  image: {
    src: '/images/retail-final-cta.png',
    fallback: '/images/retail-final-cta.png',
    alt: 'Traveler preparing documents in an airport lounge before departure',
  },
} as const

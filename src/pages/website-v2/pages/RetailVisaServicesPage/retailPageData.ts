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
  UsersRound,
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
    id: 'tourist',
    title: 'Tourist Visa',
    description: 'For holidays, leisure travel and visiting tourist destinations.',
    href: '/countries',
    icon: Plane,
    image: retailServiceImages.tourist,
  },
  {
    id: 'business',
    title: 'Business Visa',
    description: 'For business meetings, conferences, events and short-term business travel.',
    href: '/countries',
    icon: Briefcase,
    image: retailServiceImages.business,
  },
  {
    id: 'student',
    title: 'Student Visa',
    description: 'Guidance and application support for students travelling overseas for education.',
    href: '/enquiry',
    icon: GraduationCap,
    image: retailServiceImages.student,
  },
  {
    id: 'transit',
    title: 'Transit Visa',
    description: 'For travellers transiting through another country on their journey.',
    href: '/countries',
    icon: PlaneTakeoff,
    image: retailServiceImages.transit,
  },
  {
    id: 'visit-family',
    title: 'Visit & Family Visa',
    description: 'Support for visiting family, friends and other short-term stays.',
    href: '/countries',
    icon: UsersRound,
    image: retailServiceImages.visitFamily,
  },
  {
    id: 'other',
    title: 'Other Visa Types',
    description: 'Explore work, project, medical and other specialized visa categories.',
    href: '/enquiry',
    icon: FileStack,
    image: retailServiceImages.other,
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
  image: {
    src: '/images/retail-final-cta.png',
    fallback: '/images/retail-final-cta.png',
    alt: 'Traveler preparing documents in an airport lounge before departure',
  },
} as const

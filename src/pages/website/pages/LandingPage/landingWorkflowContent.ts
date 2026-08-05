import { ClipboardCheck, Laptop, FileSearch, Plane } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type HowItWorksStep = {
  id: string
  number: string
  title: string
  description: string
  icon: LucideIcon
  image: { src: string; alt: string; objectPosition?: string }
  overlay: readonly string[]
}

/** Homepage How It Works — interactive storytelling steps. */
export const howItWorksSteps: HowItWorksStep[] = [
  {
    id: 'check-requirements',
    number: '01',
    title: 'Check Requirements',
    description: 'Confirm your visa type, eligibility, and required documents.',
    icon: ClipboardCheck,
    image: {
      src: '/images/how-it-works/step-01-check-requirements.png',
      alt: 'Visa consultant reviewing documents with a traveler',
      // Keep the consultation (both people + document desk) in the landscape crop.
      objectPosition: 'center 40%',
    },
    overlay: ['Visa Eligibility', 'Required Documents', 'Destination Rules'],
  },
  {
    id: 'apply-online',
    number: '02',
    title: 'Apply Online',
    description: 'Complete and submit your visa application securely online.',
    icon: Laptop,
    image: {
      src: '/images/how-it-works/step-02-apply-online.png',
      alt: 'Traveler filling an online visa application on a laptop with passport beside it',
      objectPosition: 'center 48%',
    },
    overlay: ['Online Application', 'Secure Upload', 'Quick Submission'],
  },
  {
    id: 'document-verification',
    number: '03',
    title: 'Document Verification',
    description: 'Our experts verify your documents for accuracy and compliance.',
    icon: FileSearch,
    image: {
      src: '/images/how-it-works/step-03-document-verification.png',
      alt: 'Visa officer reviewing passport and application documents',
      objectPosition: 'center 28%',
    },
    overlay: ['Expert Review', 'Compliance Check', 'Embassy Ready'],
  },
  {
    id: 'receive-visa',
    number: '04',
    title: 'Receive Visa',
    description: 'Track your application and receive your approved visa.',
    icon: Plane,
    image: {
      src: '/images/how-it-works/step-04-receive-visa.png',
      alt: 'Happy traveler holding passport at the airport',
      objectPosition: 'center 30%',
    },
    overlay: ['Visa Approved', 'Ready to Travel', 'Track Anytime'],
  },
]

/** @deprecated Prefer `howItWorksSteps`. Kept for any remaining imports. */
export const landingWorkflowSteps = howItWorksSteps.map((step) => ({
  title: step.title,
  description: step.description,
  icon: step.icon,
}))

export const howItWorksPromoBenefits = [
  'Instant Results',
  '100% Secure',
  'Expert Support',
] as const

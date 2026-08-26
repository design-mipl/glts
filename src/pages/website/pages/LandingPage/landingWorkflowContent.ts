import { ClipboardCheck, Laptop, FileSearch, Send, Plane } from 'lucide-react'
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
    description:
      'Select your destination and visa type to understand eligibility, documents, fees and estimated processing timelines.',
    icon: ClipboardCheck,
    image: {
      src: '/v1/images/how-it-works/step-01-check-requirements.png',
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
    description: 'Complete your application and securely upload your supporting documents.',
    icon: Laptop,
    image: {
      src: '/v1/images/how-it-works/step-02-apply-online.png',
      alt: 'Traveler filling an online visa application on a laptop with passport beside it',
      objectPosition: 'center 48%',
    },
    overlay: ['Online Application', 'Secure Upload', 'Quick Submission'],
  },
  {
    id: 'expert-review',
    number: '03',
    title: 'Expert Review',
    description:
      'Our visa specialists review your documents and application before submission, helping identify issues early.',
    icon: FileSearch,
    image: {
      src: '/v1/images/how-it-works/step-03-document-verification.png',
      alt: 'Visa officer reviewing passport and application documents',
      objectPosition: 'center 28%',
    },
    overlay: ['Expert Review', 'Compliance Check', 'Embassy Ready'],
  },
  {
    id: 'submission',
    number: '04',
    title: 'Submission',
    description:
      'Your application is reviewed & submitted as per country requirements - online/offline.',
    icon: Send,
    image: {
      src: '/v1/images/how-it-works/step-03-document-verification.png',
      alt: 'Visa officer reviewing passport and application documents',
      objectPosition: 'center 28%',
    },
    overlay: ['Embassy Rules', 'Online or Offline', 'Submission Ready'],
  },
  {
    id: 'track-receive-visa',
    number: '05',
    title: 'Track your application & receive your Visa',
    description: 'Follow updates through the process and receive your visa once the decision is complete.',
    icon: Plane,
    image: {
      src: '/v1/images/how-it-works/step-04-receive-visa.png',
      alt: 'Happy traveler holding passport at the airport',
      objectPosition: 'center 30%',
    },
    overlay: ['Live Status', 'Decision Updates', 'Visa Received'],
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

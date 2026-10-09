import {
  FileCheck2,
  ShieldCheck,
  Globe2,
  Radar,
  Headphones,
  type LucideIcon,
} from 'lucide-react'
import {
  aboutHeroImage,
  aboutWhoWeAreImage,
  aboutWhyGreenLightImage,
  aboutIndustryImages,
  aboutFinalCtaImage,
} from '../../assets/aboutPageImages'

export const aboutHeroContent = {
  label: 'ABOUT GREENLIGHT',
  heading: 'Your Trusted Partner for Accurate Visa Solutions',
  description:
    'GreenLight delivers accurate, compliant, and technology-enabled visa solutions for Retail, Corporate, and Marine clients — with expert review before every submission.',
  primaryCta: { label: 'Talk to an Expert', href: '/track' },
  image: aboutHeroImage,
} as const

export const aboutWhoWeAre = {
  heading: 'Who We Are',
  paragraphs: [
    'GreenLight Travel Solutions is a specialized visa partner supporting Retail travelers, Corporate mobility teams, and Marine & offshore crews across complex, country-specific requirements.',
    'We combine deep process expertise with structured document review so every application is accurate, compliant, and embassy-ready before it leaves our desk.',
    'From individual leisure trips to multi-crew deployments and enterprise travel programs, our focus stays the same: precision, accountability, and clear communication.',
  ],
  image: aboutWhoWeAreImage,
} as const

export const aboutWhyGreenLight = {
  label: 'WHY GREENLIGHT',
  heading: 'Why Customers Choose GreenLight',
  description:
    'Trusted visa expertise, compliance-first processes, and dedicated support for Retail, Corporate, and Marine travelers worldwide.',
  image: aboutWhyGreenLightImage,
} as const

export const aboutDifferentiators: {
  title: string
  description: string
  icon: LucideIcon
}[] = [
  {
    title: 'Expert Review',
    description: 'Every application is verified before submission.',
    icon: FileCheck2,
  },
  {
    title: 'Country Expertise',
    description: 'Destination-specific visa guidance.',
    icon: Globe2,
  },
  {
    title: 'Compliance First',
    description: 'Reduced risk through accurate documentation.',
    icon: ShieldCheck,
  },
  {
    title: 'Live Status Tracking',
    description: 'Real-time application visibility.',
    icon: Radar,
  },
  {
    title: 'Dedicated Support',
    description: 'Expert assistance from start to approval.',
    icon: Headphones,
  },
]

export const aboutIndustries: {
  title: string
  description: string
  href: string
  image: { src: string; fallback: string; alt: string }
}[] = [
  {
    title: 'Retail Travelers',
    description: 'Tourist, family, and personal travel visas with guided document preparation.',
    href: '/',
    image: aboutIndustryImages.retail,
  },
  {
    title: 'Corporate Businesses',
    description: 'Business travel and project visas with dedicated account coordination.',
    href: '/corporate',
    image: aboutIndustryImages.corporate,
  },
  {
    title: 'Marine & Offshore',
    description: 'Crew, superintendent, and offshore visa handling for vessel operations.',
    href: '/marine-crew',
    image: aboutIndustryImages.marine,
  },
  {
    title: 'Travel Partners',
    description: 'Reliable visa fulfillment support for agencies and travel management companies.',
    href: '/travel-agents',
    image: aboutIndustryImages.partners,
  },
]

export const aboutFinalCta = {
  heading: 'Ready to Start Your Visa Journey?',
  description:
    'Our experts are ready to help you choose the right visa solution with confidence.',
  primaryButton: { label: 'Contact Us', href: '/track' },
  secondaryButton: { label: 'Explore Services', href: '/services' },
  image: aboutFinalCtaImage,
} as const

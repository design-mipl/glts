import { FileCheck2, PenLine, ShieldCheck, type LucideIcon } from 'lucide-react'

export type ExtraServiceId = 'attestation' | 'notary' | 'travel-insurance'

export type ExtraServiceImage = {
  src: string
  fallback: string
  alt: string
  objectPosition?: string
}

export type ExtraServiceDefinition = {
  id: ExtraServiceId
  tabLabel: string
  headline: string
  lead: string
  highlights: string[]
  image: ExtraServiceImage
  capability: {
    title: string
    description: string
    icon: LucideIcon
  }
}

export const extraServiceSelectOptions: { label: string; value: ExtraServiceId }[] = [
  { value: 'attestation', label: 'Attestation' },
  { value: 'notary', label: 'Notary' },
  { value: 'travel-insurance', label: 'Travel Insurance' },
]

export const extraServices: ExtraServiceDefinition[] = [
  {
    id: 'attestation',
    tabLabel: 'Attestation',
    headline: 'Document attestation, embassy-ready.',
    lead: 'MEA, embassy, and HRD attestation support for visa filings and corporate documentation — tracked from collection to return.',
    highlights: [
      'Embassy and MEA attestation coordination',
      'Educational and commercial document handling',
      'Tracked collection and secure return',
    ],
    image: {
      src: '/images/additional-services/guided-document-preparation.png',
      fallback: '/images/additional-services/guided-document-preparation.png',
      alt: 'Visa specialist reviewing attestation documents on a checklist',
    },
    capability: {
      title: 'Attestation',
      description:
        'Embassy, MEA, and HRD attestation for educational certificates, commercial papers, and personal documents required for visa and mobility files.',
      icon: FileCheck2,
    },
  },
  {
    id: 'notary',
    tabLabel: 'Notary',
    headline: 'Notary services when your file needs it.',
    lead: 'Affidavits, declarations, and certified copies prepared and notarised to embassy specifications — without the back-and-forth.',
    highlights: [
      'Affidavits and sponsor declarations',
      'Certified true copies for embassy filing',
      'Format aligned to consulate requirements',
    ],
    image: {
      src: '/images/additional-services/travel-documentation.png',
      fallback: '/images/additional-services/travel-documentation.png',
      alt: 'Notarised travel documents and passport paperwork prepared for submission',
    },
    capability: {
      title: 'Notary',
      description:
        'Affidavits, sponsor declarations, consent letters, and certified true copies notarised to the format embassies and consulates expect.',
      icon: PenLine,
    },
  },
  {
    id: 'travel-insurance',
    tabLabel: 'Travel Insurance',
    headline: 'Travel protection aligned to your trip.',
    lead: 'Coverage options matched to your itinerary, visa category, and destination requirements — arranged alongside your visa file.',
    highlights: [
      'Medical and evacuation coverage options',
      'Plans aligned to visa documentation needs',
      'Arranged alongside your application file',
    ],
    image: {
      src: '/images/additional-services/travel-insurance.png?v=2',
      fallback: '/images/additional-services/travel-insurance.png?v=2',
      alt: 'Couple overlooking a coastal landscape — travel with peace of mind',
      objectPosition: '72% center',
    },
    capability: {
      title: 'Travel Insurance',
      description:
        'Medical, trip cancellation, and baggage coverage options aligned to your destination checklist and visa documentation needs.',
      icon: ShieldCheck,
    },
  },
]

export function resolveExtraServiceId(value: string | null): ExtraServiceId {
  const match = extraServices.find((service) => service.id === value)
  return match?.id ?? 'attestation'
}

export function extraServiceIndex(id: ExtraServiceId): number {
  return extraServices.findIndex((service) => service.id === id)
}

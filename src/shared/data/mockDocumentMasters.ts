import type { DocumentMaster } from '@/shared/types/documentMaster'

function daysAgo(days: number) {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString()
}

/** Initial seed — IDs align with country master documentMappings.documentId. */
export const SEED_DOCUMENT_MASTERS: DocumentMaster[] = [
  {
    id: 'passport',
    documentType: 'Passport',
    description:
      'Primary identity document used for OCR and visa filing. Bio page must be clear and glare-free.',
    status: 'active',
    createdAt: daysAgo(120),
    updatedAt: daysAgo(14),
  },
  {
    id: 'photo',
    documentType: 'Applicant Photo',
    description: 'Recent passport-size photograph as per embassy requirements.',
    status: 'active',
    createdAt: daysAgo(120),
    updatedAt: daysAgo(30),
  },
  {
    id: 'bank',
    documentType: 'Bank Statement',
    description: 'Financial proof as per embassy checklist. Last 3 months, stamped by bank.',
    status: 'active',
    createdAt: daysAgo(90),
    updatedAt: daysAgo(7),
  },
  {
    id: 'travel-ticket',
    documentType: 'Travel Ticket',
    description: 'Confirmed flight or travel booking showing itinerary and traveler name.',
    status: 'active',
    createdAt: daysAgo(75),
    updatedAt: daysAgo(6),
  },
  {
    id: 'insurance',
    documentType: 'Insurance',
    description: 'Travel medical insurance covering the visa stay period as per embassy requirements.',
    status: 'active',
    createdAt: daysAgo(75),
    updatedAt: daysAgo(6),
  },
  {
    id: 'cdc',
    documentType: 'CDC',
    description: 'Continuous discharge certificate for marine workflows.',
    status: 'active',
    createdAt: daysAgo(85),
    updatedAt: daysAgo(5),
  },
  {
    id: 'vessel-letter',
    documentType: 'Vessel Joining Letter',
    description: 'Joining confirmation issued by shipping company on company letterhead.',
    status: 'active',
    createdAt: daysAgo(80),
    updatedAt: daysAgo(12),
  },
  {
    id: 'invitation',
    documentType: 'Invitation Letter',
    description: 'Invitation from host company or embassy agent for business or crew travel.',
    status: 'inactive',
    createdAt: daysAgo(60),
    updatedAt: daysAgo(2),
  },
  {
    id: 'employment-letter',
    documentType: 'Employment Letter',
    description: 'Employer confirmation letter for visa applications requiring employment proof.',
    status: 'inactive',
    createdAt: daysAgo(45),
    updatedAt: daysAgo(45),
  },
]

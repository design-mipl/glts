export interface DocumentVerificationChecklistItem {
  id: string
  label: string
}

export interface DocumentVerificationChecklistSection {
  id: string
  title: string
  items: DocumentVerificationChecklistItem[]
}

export const DOCUMENT_VERIFICATION_CHECKLIST_SECTIONS: DocumentVerificationChecklistSection[] = [
  {
    id: 'basic-verification',
    title: 'Basic Verification',
    items: [
      { id: 'cdc-number-validity', label: 'CDC Number & Validity' },
      { id: 'passport-details', label: 'Passport Details' },
      { id: 'jurisdiction', label: 'Jurisdiction' },
    ],
  },
  {
    id: 'loi',
    title: 'Letter of Invitation (LOI)',
    items: [
      { id: 'loi-consulate-address', label: 'Accurate Consulate Address' },
      { id: 'loi-date', label: 'Proper Date' },
      { id: 'loi-subject', label: 'Proper Subject Line' },
      { id: 'loi-applicant-name', label: 'Applicant Name as per Passport' },
      { id: 'loi-cdc-details', label: 'CDC Details' },
      { id: 'loi-vessel-name', label: 'Vessel Name' },
      { id: 'loi-expenses-bearer', label: 'Who Will Bear the Expenses' },
      { id: 'loi-issue-date', label: 'Issue Date of LOI' },
    ],
  },
  {
    id: 'covering-letter',
    title: 'Covering Letter',
    items: [
      { id: 'covering-consulate-address', label: 'Accurate Consulate Address' },
      { id: 'covering-date', label: 'Proper Date' },
      { id: 'covering-subject', label: 'Proper Subject Line' },
      { id: 'covering-applicant-name', label: 'Applicant Name as per Passport' },
      { id: 'covering-cdc-details', label: 'CDC Details' },
      { id: 'covering-vessel-name', label: 'Vessel Name' },
      { id: 'covering-expenses-bearer', label: 'Who Will Bear the Expenses' },
      { id: 'covering-issue-date', label: 'Issue Date of Covering Letter' },
    ],
  },
  {
    id: 'cross-verification',
    title: 'Cross Verification',
    items: [
      { id: 'company-name-match', label: 'Company Name Match Between LOI & Covering Letter' },
      { id: 'company-address-match', label: 'Company Address Match Between LOI & Covering Letter' },
      {
        id: 'signature-stamp-check',
        label: 'Signature & Company Stamp Check (if required)',
      },
      { id: 'rank-check', label: 'Rank Check Across All Documents' },
    ],
  },
  {
    id: 'vessel-route',
    title: 'Vessel & Route Verification',
    items: [
      { id: 'port-vessel-route', label: 'Port & Vessel Route Check' },
      {
        id: 'vessel-imo',
        label: 'Vessel IMO Number Check (if required by consulate)',
      },
      { id: 'seaman-contract', label: 'Seaman Contract Check (if applicable)' },
    ],
  },
  {
    id: 'travel-verification',
    title: 'Travel Verification',
    items: [
      {
        id: 'sign-on-date',
        label: 'Sign-On Date Check (Tickets must correspond to the sign-on date in LOI)',
      },
      { id: 'ticket-date-destination', label: 'Ticket Date & Destination Check' },
    ],
  },
  {
    id: 'supporting-documents',
    title: 'Supporting Documents',
    items: [
      { id: 'photo-spec', label: 'Photo Specification Check' },
      { id: 'insurance', label: 'Insurance' },
    ],
  },
]

export const DOCUMENT_VERIFICATION_CHECKLIST_ITEM_COUNT = DOCUMENT_VERIFICATION_CHECKLIST_SECTIONS.reduce(
  (total, section) => total + section.items.length,
  0,
)

export type VerificationOutcome = 'ready' | 'correction' | 'missing'

export const VERIFICATION_OUTCOME_OPTIONS: { value: VerificationOutcome; label: string }[] = [
  { value: 'ready', label: 'Verified & Ready for Submission' },
  { value: 'correction', label: 'Correction Required' },
  { value: 'missing', label: 'Document Missing' },
]

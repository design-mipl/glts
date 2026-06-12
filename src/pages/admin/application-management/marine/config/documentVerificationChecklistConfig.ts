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
    id: 'applicant-details',
    title: 'Applicant Details',
    items: [
      { id: 'passport-details', label: 'Passport Details Verified' },
      { id: 'cdc-number', label: 'CDC Number Verified' },
      { id: 'cdc-validity', label: 'CDC Validity Verified' },
      { id: 'jurisdiction', label: 'Jurisdiction Verified' },
    ],
  },
  {
    id: 'loi',
    title: 'Letter of Invitation (LOI)',
    items: [
      { id: 'loi-uploaded', label: 'LOI Uploaded' },
      { id: 'loi-consulate-address', label: 'Accurate Consulate Address' },
      { id: 'loi-date', label: 'Proper Date' },
      { id: 'loi-subject', label: 'Proper Subject Line' },
      { id: 'loi-applicant-name', label: 'Applicant Name as per Passport' },
      { id: 'loi-cdc-details', label: 'CDC Details Correct' },
      { id: 'loi-vessel-name', label: 'Vessel Name Correct' },
      { id: 'loi-expenses-bearer', label: 'Expenses Bearer Mentioned' },
      { id: 'loi-issue-date', label: 'LOI Issue Date Available' },
    ],
  },
  {
    id: 'covering-letter',
    title: 'Covering Letter',
    items: [
      { id: 'covering-uploaded', label: 'Covering Letter Uploaded' },
      { id: 'covering-consulate-address', label: 'Accurate Consulate Address' },
      { id: 'covering-date', label: 'Proper Date' },
      { id: 'covering-subject', label: 'Proper Subject Line' },
      { id: 'covering-applicant-name', label: 'Applicant Name as per Passport' },
      { id: 'covering-cdc-details', label: 'CDC Details Correct' },
      { id: 'covering-vessel-name', label: 'Vessel Name Correct' },
      { id: 'covering-expenses-bearer', label: 'Expenses Bearer Mentioned' },
      { id: 'covering-issue-date', label: 'Covering Letter Issue Date Available' },
    ],
  },
  {
    id: 'cross-verification',
    title: 'Cross Verification',
    items: [
      { id: 'company-name-match', label: 'Company Name Matches Between LOI & Covering Letter' },
      { id: 'company-address-match', label: 'Company Address Matches Between LOI & Covering Letter' },
      { id: 'signature-verified', label: 'Signature Verified' },
      { id: 'company-stamp', label: 'Company Stamp Verified (If Required)' },
      { id: 'rank-match', label: 'Rank Matches Across Documents' },
    ],
  },
  {
    id: 'vessel-travel',
    title: 'Vessel & Travel Verification',
    items: [
      { id: 'port-verified', label: 'Port Verified' },
      { id: 'vessel-route', label: 'Vessel Route Verified' },
      { id: 'sign-on-date', label: 'Sign-On Date Verified' },
      { id: 'ticket-date-match', label: 'Ticket Date Matches Sign-On Date' },
      { id: 'ticket-destination', label: 'Ticket Destination Verified' },
      { id: 'vessel-imo', label: 'Vessel IMO Number Verified (If Required)' },
      { id: 'seaman-contract', label: 'Seaman Contract Verified (If Applicable)' },
    ],
  },
  {
    id: 'supporting-documents',
    title: 'Supporting Documents',
    items: [
      { id: 'photo-spec', label: 'Photo Specification Verified' },
      { id: 'insurance', label: 'Insurance Verified' },
    ],
  },
  {
    id: 'appointment',
    title: 'Appointment',
    items: [{ id: 'appointment-verified', label: 'Appointment Taken / Verified' }],
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

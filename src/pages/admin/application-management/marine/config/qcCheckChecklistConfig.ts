export interface QcCheckChecklistItem {
  id: string
  label: string
}

export interface QcCheckChecklistSection {
  id: string
  title: string
  items: QcCheckChecklistItem[]
}

export const QC_CHECK_CHECKLIST_SECTIONS: QcCheckChecklistSection[] = [
  {
    id: 'appointment-verification',
    title: 'Appointment Verification',
    items: [{ id: 'appointment-booked-verified', label: 'Appointment Booked / Verified' }],
  },
  {
    id: 'application-form-verification',
    title: 'Application Form Verification',
    items: [
      { id: 'form-filled-per-checklist', label: 'Form filled correctly as per checklist' },
      { id: 'passport-details-verified', label: 'Passport Details Verified' },
      { id: 'cdc-number-validity-verified', label: 'CDC Number and Validity Verified' },
      { id: 'jurisdiction-verified', label: 'Jurisdiction Verified' },
    ],
  },
  {
    id: 'loi-verification',
    title: 'Letter of Invitation (LOI) Verification',
    items: [
      { id: 'loi-consulate-address', label: 'Accurate Consulate Address' },
      { id: 'loi-date', label: 'Proper Date' },
      { id: 'loi-subject', label: 'Proper Subject Line' },
      { id: 'loi-applicant-name', label: 'Applicant Name as per Passport' },
      { id: 'loi-cdc-details', label: 'CDC Details Verified' },
      { id: 'loi-vessel-name', label: 'Vessel Name Verified' },
      { id: 'loi-expense-bearer', label: 'Expense Bearer Mentioned' },
      { id: 'loi-issue-date', label: 'LOI Issue Date Verified' },
    ],
  },
  {
    id: 'covering-letter-verification',
    title: 'Covering Letter Verification',
    items: [
      { id: 'covering-consulate-address', label: 'Accurate Consulate Address' },
      { id: 'covering-date', label: 'Proper Date' },
      { id: 'covering-subject', label: 'Proper Subject Line' },
      { id: 'covering-applicant-name', label: 'Applicant Name as per Passport' },
      { id: 'covering-cdc-details', label: 'CDC Details Verified' },
      { id: 'covering-vessel-name', label: 'Vessel Name Verified' },
      { id: 'covering-expense-bearer', label: 'Expense Bearer Mentioned' },
      { id: 'covering-issue-date', label: 'Covering Letter Issue Date Verified' },
    ],
  },
  {
    id: 'cross-document-validation',
    title: 'Cross-Document Validation',
    items: [
      {
        id: 'company-name-address-match',
        label: 'Company Name & Address Match Between LOI and Covering Letter',
      },
      {
        id: 'signature-stamp-verified',
        label: 'Signature and Company Stamp Verified (if applicable)',
      },
      { id: 'rank-verified', label: 'Rank Verified' },
      { id: 'port-vessel-route-verified', label: 'Port & Vessel Route Verified' },
      {
        id: 'sign-on-date-verified',
        label:
          'Sign-On Date Verified (Ticket date must correspond with the sign-on date mentioned in the LOI)',
      },
      {
        id: 'vessel-imo-verified',
        label: 'Vessel IMO Number Verified (if required by the Consulate)',
      },
      { id: 'seaman-contract-verified', label: 'Seaman Contract Verified (if applicable)' },
    ],
  },
  {
    id: 'supporting-documents-verification',
    title: 'Supporting Documents Verification',
    items: [
      { id: 'photo-specifications-verified', label: 'Photo Specifications Verified' },
      { id: 'ticket-date-destination-verified', label: 'Ticket Date & Destination Verified' },
      { id: 'insurance-verified', label: 'Insurance Verified' },
    ],
  },
  {
    id: 'final-qc-confirmation',
    title: 'Final QC Confirmation',
    items: [
      { id: 'all-documents-reviewed', label: 'All documents reviewed and validated' },
      { id: 'no-discrepancies', label: 'No discrepancies found' },
      { id: 'ready-for-submission', label: 'Ready for Submission' },
    ],
  },
]

export const QC_CHECK_CHECKLIST_ITEM_COUNT = QC_CHECK_CHECKLIST_SECTIONS.reduce(
  (total, section) => total + section.items.length,
  0,
)

export type QcCheckOutcome = 'ready' | 'correction' | 'blocked'

export const QC_CHECK_OUTCOME_OPTIONS: { value: QcCheckOutcome; label: string }[] = [
  { value: 'ready', label: 'Verified & ready for submission' },
  { value: 'correction', label: 'Correction required' },
  { value: 'blocked', label: 'Document missing / blocked' },
]

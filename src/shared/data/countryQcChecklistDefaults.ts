import type { CountryQcChecklistKind, CountryQcChecklistTemplate } from '@/shared/types/countryMaster'

const OPS_SECTIONS = [
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
      { id: 'signature-stamp-check', label: 'Signature & Company Stamp Check (if required)' },
      { id: 'rank-check', label: 'Rank Check Across All Documents' },
    ],
  },
  {
    id: 'vessel-route',
    title: 'Vessel & Route Verification',
    items: [
      { id: 'port-vessel-route', label: 'Port & Vessel Route Check' },
      { id: 'vessel-imo', label: 'Vessel IMO Number Check (if required by consulate)' },
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
] as const

const DOCS_SECTIONS = [
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
] as const

function buildTemplate(
  title: string,
  subtitle: string,
  sections: readonly {
    readonly id: string
    readonly title: string
    readonly items: readonly { readonly id: string; readonly label: string }[]
  }[],
): CountryQcChecklistTemplate {
  return {
    title,
    subtitle,
    sections: sections.map((section, sectionIndex) => ({
      id: section.id,
      title: section.title,
      sortOrder: sectionIndex,
      enabled: true,
      items: section.items.map((item, itemIndex) => ({
        id: item.id,
        label: item.label,
        sortOrder: itemIndex,
        enabled: true,
      })),
    })),
  }
}

const DEFAULT_OPS_TEMPLATE = buildTemplate(
  'OPS Team – Document Verification Checklist',
  'Final validation before the file reaches the Submission Team.',
  OPS_SECTIONS,
)

const DEFAULT_DOCS_TEMPLATE = buildTemplate(
  'Documentation Team – Internal QC Checklist',
  'Quality check before external portal submission.',
  DOCS_SECTIONS,
)

export function getDefaultQcChecklistTemplate(kind: CountryQcChecklistKind): CountryQcChecklistTemplate {
  const source = kind === 'ops' ? DEFAULT_OPS_TEMPLATE : DEFAULT_DOCS_TEMPLATE
  return structuredClone(source)
}

/** Title and subtitle are fixed per checklist kind — only sections/items are configurable. */
export function applyQcChecklistKindMetadata(
  kind: CountryQcChecklistKind,
  template: CountryQcChecklistTemplate,
): CountryQcChecklistTemplate {
  const defaults = kind === 'ops' ? DEFAULT_OPS_TEMPLATE : DEFAULT_DOCS_TEMPLATE
  return {
    ...template,
    title: defaults.title,
    subtitle: defaults.subtitle,
  }
}

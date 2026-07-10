import type { CountryQcChecklistTemplate } from '@/shared/types/countryMaster'

function buildChecklistTemplate(
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

const CHINA_G_TYPE_MUMBAI_OPS_SECTIONS = [
  {
    id: 'cdc-verification',
    title: 'CDC Verification',
    items: [
      { id: 'cdc-number', label: 'CDC Number' },
      { id: 'cdc-validity', label: 'CDC Validity' },
    ],
  },
  {
    id: 'passport-verification',
    title: 'Passport Verification',
    items: [{ id: 'passport-details-verified', label: 'Passport Details Verified' }],
  },
  {
    id: 'photograph-verification',
    title: 'Photograph Verification',
    items: [{ id: 'photo-specifications', label: 'Photo Meets Required Specifications' }],
  },
  {
    id: 'loi-verification',
    title: 'Letter of Invitation (LOI) Verification',
    items: [
      { id: 'loi-consulate-address', label: 'Correct Consulate Address' },
      { id: 'loi-date', label: 'Proper Date' },
      { id: 'loi-subject', label: 'Appropriate Subject Line' },
      { id: 'loi-applicant-name', label: 'Applicant Name matches Passport' },
      { id: 'loi-cdc-details', label: 'CDC Details' },
      { id: 'loi-vessel-name', label: 'Vessel Name' },
      { id: 'loi-expenses-bearer', label: 'Expenses Bearer Mentioned' },
      { id: 'loi-issue-date', label: 'Issue Date Present' },
      { id: 'loi-signatory-signature', label: 'Authorized Signatory Name & Signature' },
      { id: 'loi-company-stamp', label: 'Inviting Company Stamp' },
    ],
  },
  {
    id: 'covering-letter-verification',
    title: 'Covering Letter Verification',
    items: [
      { id: 'covering-consulate-address', label: 'Correct Consulate Address' },
      { id: 'covering-date', label: 'Proper Date' },
      { id: 'covering-subject', label: 'Appropriate Subject Line' },
      { id: 'covering-applicant-name', label: 'Applicant Name matches Passport' },
      { id: 'covering-cdc-details', label: 'CDC Details' },
      { id: 'covering-vessel-name', label: 'Vessel Name' },
      { id: 'covering-expenses-bearer', label: 'Expenses Bearer Mentioned' },
      { id: 'covering-issue-date', label: 'Issue Date Present' },
      { id: 'covering-authorized-person', label: 'Company Authorized Person Name' },
      { id: 'covering-company-stamp', label: 'Company Stamp' },
    ],
  },
  {
    id: 'cross-document-validation',
    title: 'Cross Document Validation',
    items: [
      { id: 'company-name-match', label: 'Company Name matches in LOI & Covering Letter' },
      { id: 'company-address-match', label: 'Company Address matches in LOI & Covering Letter' },
      { id: 'rank-consistent', label: 'Rank is consistent across all documents' },
      { id: 'port-details-consistent', label: 'Port details are consistent across all documents' },
      { id: 'vessel-route-consistent', label: 'Vessel Route is consistent across all documents' },
    ],
  },
  {
    id: 'supporting-documents',
    title: 'Supporting Documents',
    items: [
      { id: 'personal-details-excel', label: 'Personal Details Excel Verified' },
      { id: 'one-way-flight-ticket', label: 'One-Way Flight Ticket Verified' },
    ],
  },
] as const

const CHINA_G_TYPE_MUMBAI_DOCS_SECTIONS = [
  {
    id: 'application-verification',
    title: 'Application Verification',
    items: [
      {
        id: 'application-form-accurate',
        label: 'Application Form completed with accurate details as per the checklist',
      },
      {
        id: 'vfs-payment-confirmation',
        label: 'VFS Payment completed and payment confirmation saved',
      },
    ],
  },
  {
    id: 'cdc-verification',
    title: 'CDC Verification',
    items: [
      { id: 'cdc-number', label: 'CDC Number' },
      { id: 'cdc-validity', label: 'CDC Validity' },
    ],
  },
  {
    id: 'passport-verification',
    title: 'Passport Verification',
    items: [{ id: 'passport-details', label: 'Passport Details' }],
  },
  {
    id: 'photograph-verification',
    title: 'Photograph Verification',
    items: [{ id: 'photo-specifications', label: 'Photograph meets the required specifications' }],
  },
  {
    id: 'loi-verification',
    title: 'Letter of Invitation (LOI)',
    items: [
      { id: 'loi-consulate-address', label: 'Consulate Address is correct' },
      { id: 'loi-date', label: 'Date is mentioned' },
      { id: 'loi-subject', label: 'Subject Line is correct' },
      { id: 'loi-applicant-name', label: 'Applicant Name matches Passport' },
      { id: 'loi-cdc-details', label: 'CDC Details are correct' },
      { id: 'loi-vessel-name', label: 'Vessel Name is correct' },
      { id: 'loi-expenses-bearer', label: 'Expense Bearer is mentioned' },
      { id: 'loi-issue-date', label: 'LOI Issue Date is mentioned' },
      { id: 'loi-signatory-signature', label: 'Authorized Signatory Name & Signature' },
      { id: 'loi-company-stamp', label: 'Inviting Company Stamp' },
    ],
  },
  {
    id: 'covering-letter-verification',
    title: 'Covering Letter',
    items: [
      { id: 'covering-consulate-address', label: 'Consulate Address is correct' },
      { id: 'covering-date', label: 'Date is mentioned' },
      { id: 'covering-subject', label: 'Subject Line is correct' },
      { id: 'covering-applicant-name', label: 'Applicant Name matches Passport' },
      { id: 'covering-cdc-details', label: 'CDC Details are correct' },
      { id: 'covering-vessel-name', label: 'Vessel Name is correct' },
      { id: 'covering-expenses-bearer', label: 'Expense Bearer is mentioned' },
      { id: 'covering-issue-date', label: 'Covering Letter Issue Date is mentioned' },
      { id: 'covering-authorized-person', label: 'Authorized Company Representative Name' },
      { id: 'covering-company-stamp', label: 'Company Stamp' },
    ],
  },
  {
    id: 'cross-document-validation',
    title: 'Cross-Document Validation',
    items: [
      {
        id: 'company-name-match',
        label: 'Company Name matches between Letter of Invitation & Covering Letter',
      },
      {
        id: 'company-address-match',
        label: 'Company Address matches between Letter of Invitation & Covering Letter',
      },
      { id: 'rank-consistent', label: 'Rank is consistent across all documents' },
      {
        id: 'port-vessel-route-consistent',
        label: 'Port & Vessel Route are consistent across all documents',
      },
    ],
  },
  {
    id: 'supporting-documents',
    title: 'Supporting Documents',
    items: [
      { id: 'personal-details-excel', label: 'Personal Details Excel verified' },
      { id: 'one-way-flight-ticket', label: 'One-Way Flight Ticket verified' },
    ],
  },
] as const

export function buildChinaGTypeMumbaiOpsQcChecklist(): CountryQcChecklistTemplate {
  return buildChecklistTemplate(
    'OPS Team – Document Verification Checklist',
    'Final validation before the file reaches the Submission Team.',
    CHINA_G_TYPE_MUMBAI_OPS_SECTIONS,
  )
}

export function buildChinaGTypeMumbaiDocsQcChecklist(): CountryQcChecklistTemplate {
  return buildChecklistTemplate(
    'Documentation Team – Internal QC Checklist',
    'Quality check before external portal submission.',
    CHINA_G_TYPE_MUMBAI_DOCS_SECTIONS,
  )
}

const CHINA_M_TYPE_DELHI_DOCS_SECTIONS = [
  {
    id: 'application-verification',
    title: 'Application Verification',
    items: [
      {
        id: 'application-form-accurate',
        label: 'Application Form completed with accurate details as per the checklist',
      },
      {
        id: 'vfs-payment-confirmation',
        label: 'VFS Payment completed and payment confirmation saved',
      },
    ],
  },
  {
    id: 'cdc-verification',
    title: 'CDC Verification',
    items: [
      { id: 'cdc-number', label: 'CDC Number' },
      { id: 'cdc-validity', label: 'CDC Validity' },
    ],
  },
  {
    id: 'passport-verification',
    title: 'Passport Verification',
    items: [{ id: 'passport-details', label: 'Passport Details' }],
  },
  {
    id: 'loi-verification',
    title: 'Letter of Invitation (LOI)',
    items: [
      { id: 'loi-consulate-address', label: 'Consulate Address is correct' },
      { id: 'loi-applicant-name', label: 'Applicant Name matches Passport' },
      { id: 'loi-vessel-name', label: 'Vessel Name is correct' },
      { id: 'loi-signatory-signature', label: 'Authorized Signatory Name & Signature' },
    ],
  },
  {
    id: 'covering-letter-verification',
    title: 'Covering Letter',
    items: [
      { id: 'covering-consulate-address', label: 'Consulate Address is correct' },
      { id: 'covering-applicant-name', label: 'Applicant Name matches Passport' },
      { id: 'covering-vessel-name', label: 'Vessel Name is correct' },
      { id: 'covering-company-stamp', label: 'Company Stamp' },
    ],
  },
  {
    id: 'supporting-documents',
    title: 'Supporting Documents',
    items: [
      { id: 'photo-specifications', label: 'Photograph meets the required specifications' },
      { id: 'seaman-contract', label: 'Seaman Contract verified (if applicable)' },
    ],
  },
] as const

const CHINA_M_TYPE_DELHI_OPS_SECTIONS = [
  {
    id: 'cdc-verification',
    title: 'CDC Verification',
    items: [
      { id: 'cdc-number', label: 'CDC Number' },
      { id: 'cdc-validity', label: 'CDC Validity' },
    ],
  },
  {
    id: 'passport-verification',
    title: 'Passport Verification',
    items: [{ id: 'passport-details-verified', label: 'Passport Details Verified' }],
  },
  {
    id: 'loi-verification',
    title: 'Letter of Invitation (LOI) Verification',
    items: [
      { id: 'loi-consulate-address', label: 'Correct Consulate Address' },
      { id: 'loi-applicant-name', label: 'Applicant Name matches Passport' },
      { id: 'loi-vessel-name', label: 'Vessel Name' },
    ],
  },
  {
    id: 'covering-letter-verification',
    title: 'Covering Letter Verification',
    items: [
      { id: 'covering-consulate-address', label: 'Correct Consulate Address' },
      { id: 'covering-applicant-name', label: 'Applicant Name matches Passport' },
      { id: 'covering-vessel-name', label: 'Vessel Name' },
    ],
  },
] as const

const CHINA_G_TYPE_DELHI_DOCS_SECTIONS = CHINA_G_TYPE_MUMBAI_DOCS_SECTIONS
const CHINA_G_TYPE_DELHI_OPS_SECTIONS = CHINA_G_TYPE_MUMBAI_OPS_SECTIONS

export function buildChinaMTypeDelhiDocsQcChecklist(): CountryQcChecklistTemplate {
  return buildChecklistTemplate(
    'Documentation Team – Internal QC Checklist',
    'Quality check before external portal submission.',
    CHINA_M_TYPE_DELHI_DOCS_SECTIONS,
  )
}

export function buildChinaMTypeDelhiOpsQcChecklist(): CountryQcChecklistTemplate {
  return buildChecklistTemplate(
    'OPS Team – Document Verification Checklist',
    'Final validation before the file reaches the Submission Team.',
    CHINA_M_TYPE_DELHI_OPS_SECTIONS,
  )
}

export function buildChinaGTypeDelhiDocsQcChecklist(): CountryQcChecklistTemplate {
  return buildChecklistTemplate(
    'Documentation Team – Internal QC Checklist',
    'Quality check before external portal submission.',
    CHINA_G_TYPE_DELHI_DOCS_SECTIONS,
  )
}

export function buildChinaGTypeDelhiOpsQcChecklist(): CountryQcChecklistTemplate {
  return buildChecklistTemplate(
    'OPS Team – Document Verification Checklist',
    'Final validation before the file reaches the Submission Team.',
    CHINA_G_TYPE_DELHI_OPS_SECTIONS,
  )
}

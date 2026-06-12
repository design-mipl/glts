import type { DocumentMaster } from '@/shared/types/documentMaster'

function daysAgo(days: number) {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString()
}

function seedDoc(
  id: string,
  documentType: string,
  description: string,
  ageDays: number,
): DocumentMaster {
  const timestamp = daysAgo(ageDays)
  return {
    id,
    documentType,
    description,
    status: 'active',
    createdAt: timestamp,
    updatedAt: daysAgo(Math.max(1, Math.floor(ageDays / 3))),
  }
}

/** Seafarer identity, financial, and compliance documents. */
const SEAFARER_DOCUMENTS: DocumentMaster[] = [
  seedDoc(
    'passport',
    'Passport',
    'Valid passport used for visa application processing. Original passport may be required for submission.',
    120,
  ),
  seedDoc(
    'old-passport',
    'Old Passport',
    'Previous or expired passport retained for visa history, renewal, or embassy verification when required.',
    118,
  ),
  seedDoc(
    'cdc',
    'CDC',
    'Continuous Discharge Certificate of the seafarer containing service and vessel records.',
    116,
  ),
  seedDoc(
    'old-cdc',
    'Old CDC',
    'Superseded or cancelled CDC retained when embassy or compliance review requires full service history.',
    114,
  ),
  seedDoc(
    'photo',
    'Passport Photograph',
    'Recent passport-size photograph meeting embassy specifications for visa application submission.',
    112,
  ),
  seedDoc(
    'digital-photograph',
    'Digital Photograph',
    'Digital passport-style photograph uploaded for online visa application or biometric processing.',
    110,
  ),
  seedDoc(
    'passport-scan-copy',
    'Passport Scan Copy',
    'Scan copy of passport bio pages for embassy portal upload.',
    109,
  ),
  seedDoc(
    'cdc-scan-copy',
    'CDC Scan Copy',
    'Scan copy of CDC for embassy portal upload.',
    108,
  ),
  seedDoc(
    'aadhaar-card',
    'Aadhaar Card',
    'Government-issued identity document used for applicant verification and supporting identification.',
    107,
  ),
  seedDoc(
    'personal-details-form',
    'Personal Details Form',
    'Applicant personal information form completed for visa filing and embassy submission.',
    106,
  ),
  seedDoc(
    'stcw-certificate',
    'STCW Certificate',
    'Standards of Training, Certification and Watchkeeping certificate for qualified seafarers.',
    104,
  ),
  seedDoc(
    'bank',
    'Bank Statement',
    'Personal bank statement showing financial capacity for visa processing, typically covering recent months.',
    102,
  ),
  seedDoc(
    'bank-balance-certificate',
    'Bank Balance Certificate',
    'Bank-issued certificate confirming account balance for embassy financial verification.',
    100,
  ),
  seedDoc(
    'income-tax-return',
    'Income Tax Return (ITR)',
    'Filed income tax return used to substantiate applicant income for visa assessment.',
    98,
  ),
  seedDoc(
    'itr-declaration',
    'ITR Declaration',
    'Signed declaration or acknowledgment related to income tax filing when full ITR is not yet available.',
    96,
  ),
  seedDoc(
    'salary-slip',
    'Salary Slip',
    'Recent salary slip or payslip confirming employment income for visa financial review.',
    94,
  ),
  seedDoc(
    'authority-letter',
    'Authority Letter',
    'Letter authorizing a representative to act, collect documents, or submit on behalf of the applicant.',
    92,
  ),
]

/** Shipping company and employer-issued documents. */
const SHIPPING_COMPANY_DOCUMENTS: DocumentMaster[] = [
  seedDoc(
    'vessel-letter',
    'Vessel Joining Letter',
    'Joining confirmation issued by the shipping company on company letterhead for crew deployment.',
    90,
  ),
  seedDoc(
    'company-covering-letter',
    'Company Covering Letter',
    'Official company letter confirming employment, travel purpose, visa requirement, and expense responsibility.',
    88,
  ),
  seedDoc(
    'employment-certificate',
    'Employment Certificate',
    'Employer certificate confirming current employment, role, and tenure for visa processing.',
    86,
  ),
  seedDoc(
    'employment-contract',
    'Employment Contract',
    'Signed employment contract or agreement supporting work-related or crew visa applications.',
    84,
  ),
  seedDoc(
    'certificate-of-incorporation',
    'Certificate of Incorporation',
    'Company registration certificate confirming legal incorporation of the employing organization.',
    82,
  ),
  seedDoc(
    'company-bank-statement',
    'Company Bank Statement',
    'Corporate bank statement used when embassy requires employer financial standing or sponsorship proof.',
    80,
  ),
  seedDoc(
    'company-balance-certificate',
    'Company Balance Certificate',
    'Bank-issued certificate confirming corporate account balance for sponsor or employer verification.',
    78,
  ),
  seedDoc(
    'company-income-tax-return',
    'Company Income Tax Return',
    'Corporate tax return filed by the sponsoring or employing company when required for business visas.',
    76,
  ),
  seedDoc(
    'company-explanation-letter',
    'Company Explanation Letter',
    'Employer letter clarifying travel purpose, itinerary, or supporting facts requested by the embassy.',
    74,
  ),
  seedDoc(
    'expense-undertaking-letter',
    'Expense Undertaking Letter',
    'Company undertaking to bear travel, stay, and related expenses for the applicant during the trip.',
    72,
  ),
]

/** Overseas host, agent, and inviter documents. */
const FOREIGN_AGENT_DOCUMENTS: DocumentMaster[] = [
  seedDoc(
    'invitation',
    'Invitation Letter',
    'Official invitation issued by the overseas company or agent inviting the applicant for travel.',
    70,
  ),
  seedDoc(
    'loi',
    'Letter of Invitation (LOI)',
    'Formal letter of invitation from the host company or foreign agent specifying visit purpose and arrangements.',
    68,
  ),
  seedDoc(
    'schedule-of-stay',
    'Schedule of Stay',
    'Planned itinerary or schedule of stay detailing dates, cities, and accommodation during the visit.',
    66,
  ),
  seedDoc(
    'letter-of-guarantee',
    'Letter of Guarantee',
    'Guarantee letter from host or sponsor accepting responsibility for applicant conduct and expenses.',
    64,
  ),
  seedDoc(
    'foreign-company-registration',
    'Foreign Company Registration',
    'Registration or incorporation proof of the overseas inviting or sponsoring company.',
    62,
  ),
  seedDoc(
    'foreign-business-license',
    'Foreign Business License',
    'Business license or operating permit of the foreign host company or agent.',
    60,
  ),
  seedDoc(
    'inviter-id-proof',
    'Inviter ID Proof',
    'Identity document of the overseas inviter or authorized company representative.',
    58,
  ),
]

/** GLTS operational and embassy submission documents. */
const GLTS_PROCESSING_DOCUMENTS: DocumentMaster[] = [
  seedDoc(
    'visa-application-form',
    'Visa Application Form',
    'Official embassy or consulate visa application form completed during processing.',
    56,
  ),
  seedDoc(
    'internal-compliance-checklist',
    'Internal Compliance Checklist',
    'Internal GLTS checklist confirming document completeness before embassy or VFS submission.',
    54,
  ),
  seedDoc(
    'appointment-confirmation',
    'Appointment Confirmation',
    'Confirmed embassy, consulate, or VFS appointment details for biometric or submission.',
    52,
  ),
  seedDoc(
    'submission-receipt',
    'Submission Receipt',
    'Receipt issued when the visa application is submitted to embassy, consulate, or VFS.',
    50,
  ),
  seedDoc(
    'payment-receipt',
    'Payment Receipt',
    'Proof of visa fee, service charge, or related payment made during application processing.',
    48,
  ),
  seedDoc(
    'travel-ticket',
    'Travel Ticket',
    'Confirmed travel itinerary or flight booking used for visa processing.',
    46,
  ),
  seedDoc(
    'insurance',
    'Insurance',
    'Travel insurance policy covering the applicant for the required travel duration.',
    44,
  ),
  seedDoc(
    'affidavit',
    'Affidavit',
    'Sworn affidavit or notarized declaration supporting the visa application when required.',
    42,
  ),
  seedDoc(
    'passport-collection-acknowledgement',
    'Passport Collection Acknowledgement',
    'Acknowledgement confirming passport handover or collection after visa processing.',
    40,
  ),
]

/**
 * Initial seed — reusable document library for country and visa checklists.
 * IDs align with country master documentMappings.documentId where noted in plan.
 */
export const SEED_DOCUMENT_MASTERS: DocumentMaster[] = [
  ...SEAFARER_DOCUMENTS,
  ...SHIPPING_COMPANY_DOCUMENTS,
  ...FOREIGN_AGENT_DOCUMENTS,
  ...GLTS_PROCESSING_DOCUMENTS,
]

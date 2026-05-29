import type { AgreementOnboardingDocument, CommercialAgreement } from '@/shared/types/commercialAgreement'
import { buildDefaultAgreementDocuments } from '@/shared/utils/commercialAgreementValidation'

function daysAgo(days: number) {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString()
}

function daysFromNow(days: number) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

function daysAgoDate(days: number) {
  return daysAgo(days).slice(0, 10)
}

const defaultDocs = (): AgreementOnboardingDocument[] =>
  buildDefaultAgreementDocuments('agreemented').map((d) => ({
    ...d,
    status: d.documentKey === 'billing_entity' ? 'verified' : 'uploaded',
    fileName: `${d.documentKey}.pdf`,
    uploadedAt: daysAgo(2),
  }))

export const SEED_COMMERCIAL_AGREEMENTS: CommercialAgreement[] = [
  {
    id: 'AGR-001',
    agreementId: 'AGR-2024-001',
    companyId: 'CMP-1001',
    companyName: 'Apex Marine Logistics',
    agreementType: 'agreemented',
    workflowType: 'marine',
    billingType: 'credit',
    status: 'approved',
    startDate: daysAgoDate(30),
    endDate: daysFromNow(335),
    pricingMatrix: [
      { id: 'pr-1', country: 'China', visaType: 'Marine', workflowType: 'Marine', serviceFee: 2250, gstApplicable: true, remarks: '' },
      { id: 'pr-2', country: 'Schengen', visaType: 'Marine', workflowType: 'Marine', serviceFee: 1500, gstApplicable: true, remarks: '' },
      { id: 'pr-3', country: 'USA', visaType: 'Marine', workflowType: 'Marine', serviceFee: 3500, gstApplicable: true, remarks: '' },
    ],
    miscellaneousCosts: [
      { id: 'mc-1', serviceName: 'Courier Charges', pricingType: 'fixed', amount: 500, gstApplicable: true, remarks: '' },
      { id: 'mc-2', serviceName: 'E-Ticket Charges', pricingType: 'fixed', amount: 350, gstApplicable: false, remarks: '' },
    ],
    billingConfig: {
      creditBillingEnabled: true,
      billingCycle: 'monthly',
      creditPeriodDays: 30,
      creditLimit: 500000,
      gstApplicable: true,
      gstPercentage: 18,
      tdsApplicable: false,
      tdsPercentage: 0,
    },
    financeContacts: {
      accountsSpocName: 'Meera Shah',
      accountsTeamEmail: 'accounts@apexmarine.com',
      accountsContactNumber: '+91 9988776600',
      invoiceSubmissionEmail: 'invoices@apexmarine.com',
      paymentFollowUpContact: 'finance@apexmarine.com',
    },
    documents: defaultDocs(),
    createdAt: daysAgo(45),
    updatedAt: daysAgo(5),
    submittedAt: daysAgo(40),
    approvedAt: daysAgo(35),
    activities: [],
  },
  {
    id: 'AGR-002',
    agreementId: 'AGR-2024-002',
    companyId: 'CMP-1002',
    companyName: 'Oceanic Crew Services',
    agreementType: 'non_agreemented',
    workflowType: 'marine',
    billingType: 'advance',
    status: 'approved',
    startDate: daysAgoDate(10),
    endDate: daysFromNow(355),
    pricingMatrix: [
      { id: 'pr-4', country: 'Singapore', visaType: 'Marine', workflowType: 'Marine', serviceFee: 1800, gstApplicable: true, remarks: '' },
    ],
    miscellaneousCosts: [
      { id: 'mc-3', serviceName: 'Travel Insurance', pricingType: 'fixed', amount: 1200, gstApplicable: true, remarks: '' },
    ],
    billingConfig: {
      creditBillingEnabled: false,
      billingCycle: 'monthly',
      creditPeriodDays: 0,
      creditLimit: 0,
      gstApplicable: true,
      gstPercentage: 18,
      tdsApplicable: true,
      tdsPercentage: 2,
    },
    financeContacts: {
      accountsSpocName: 'Rajesh Kumar',
      accountsTeamEmail: 'accounts@oceaniccrew.com',
      accountsContactNumber: '+91 9876543211',
      invoiceSubmissionEmail: 'billing@oceaniccrew.com',
      paymentFollowUpContact: 'finance@oceaniccrew.com',
    },
    documents: buildDefaultAgreementDocuments('non_agreemented').map((d) => ({
      ...d,
      status: d.documentKey === 'billing_entity' ? 'verified' : 'uploaded',
      fileName: `${d.documentKey}.pdf`,
      uploadedAt: daysAgo(2),
    })),
    createdAt: daysAgo(15),
    updatedAt: daysAgo(2),
    submittedAt: daysAgo(2),
    approvedAt: daysAgo(1),
    activities: [],
  },
  {
    id: 'AGR-003',
    agreementId: 'AGR-2024-003',
    companyId: 'CMP-1003',
    companyName: 'Global Corporate Travel Ltd',
    agreementType: 'agreemented',
    workflowType: 'corporate',
    billingType: 'mixed',
    status: 'draft',
    startDate: '',
    endDate: '',
    pricingMatrix: [],
    miscellaneousCosts: [],
    billingConfig: {
      creditBillingEnabled: true,
      billingCycle: 'quarterly',
      creditPeriodDays: 45,
      creditLimit: 1000000,
      gstApplicable: true,
      gstPercentage: 18,
      tdsApplicable: false,
      tdsPercentage: 0,
    },
    financeContacts: {
      accountsSpocName: '',
      accountsTeamEmail: '',
      accountsContactNumber: '',
      invoiceSubmissionEmail: '',
      paymentFollowUpContact: '',
    },
    documents: buildDefaultAgreementDocuments('agreemented'),
    createdAt: daysAgo(3),
    updatedAt: daysAgo(1),
    activities: [],
  },
]

const STORAGE_KEY = 'glts:commercial-agreements'

let memoryStore: CommercialAgreement[] | null = null

function loadStore(): CommercialAgreement[] {
  if (memoryStore) return memoryStore
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      memoryStore = JSON.parse(raw) as CommercialAgreement[]
      return memoryStore
    }
  } catch {
    /* ignore */
  }
  memoryStore = [...SEED_COMMERCIAL_AGREEMENTS]
  return memoryStore
}

export function getMockCommercialAgreements(): CommercialAgreement[] {
  return loadStore()
}

export function setMockCommercialAgreementsStore(rows: CommercialAgreement[]) {
  memoryStore = rows
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rows))
  } catch {
    /* ignore */
  }
}

export function resetMockCommercialAgreementsCache() {
  memoryStore = null
}

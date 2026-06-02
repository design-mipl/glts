import type { AgreementOnboardingDocument, CommercialAgreement } from '@/shared/types/commercialAgreement'
import {
  buildDefaultAgreementDocuments,
  createDefaultBillingConfig,
} from '@/shared/utils/commercialAgreementValidation'

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
    customerSourceMode: 'existing',
    parentCompanyId: '',
    agreementType: 'agreemented',
    workflowType: 'marine',
    billingType: 'credit',
    status: 'approved',
    startDate: daysAgoDate(30),
    endDate: daysFromNow(335),
    entities: [
      {
        id: 'ent-1',
        entityName: 'Apex Marine Mumbai',
        billingAddress: 'Dockyard Road, Mumbai 400010',
        gstNumber: '27AABCA1234A1Z1',
        contactPerson: 'Meera Shah',
        email: 'mumbai@apexmarine.com',
        phone: '+91 9988776600',
        status: 'active',
      },
      {
        id: 'ent-2',
        entityName: 'Apex Marine Kochi',
        billingAddress: 'Willingdon Island, Kochi 682003',
        gstNumber: '32AABCA1234A1Z2',
        contactPerson: 'Suresh Nair',
        email: 'kochi@apexmarine.com',
        phone: '+91 9988776601',
        status: 'active',
      },
    ],
    pricingMatrix: [
      {
        id: 'pr-1',
        country: 'China',
        countryId: 'CNT-101',
        visaType: 'Marine Visa',
        workflowType: 'Marine',
        servicePresetId: 'svc-marine-visa',
        servicePresetName: 'Marine crew visa processing',
        serviceFee: 2250,
        gstApplicable: true,
        remarks: '',
      },
      {
        id: 'pr-2',
        country: 'Schengen',
        countryId: 'CNT-104',
        visaType: 'Marine Visa',
        workflowType: 'Marine',
        servicePresetId: 'svc-marine-visa',
        servicePresetName: 'Marine crew visa processing',
        serviceFee: 1500,
        gstApplicable: true,
        remarks: '',
      },
      {
        id: 'pr-3',
        country: 'USA',
        countryId: 'CNT-103',
        visaType: 'Marine Visa',
        workflowType: 'Marine',
        servicePresetId: 'svc-marine-visa',
        servicePresetName: 'Marine crew visa processing',
        serviceFee: 3500,
        gstApplicable: true,
        remarks: '',
      },
    ],
    miscellaneousCosts: [
      { id: 'mc-1', serviceName: 'Courier Charges', pricingType: 'fixed', amount: 500, gstApplicable: true, remarks: '' },
    ],
    billingConfig: {
      ...createDefaultBillingConfig(),
      creditBillingEnabled: true,
      creditPeriodDays: 30,
      creditLimit: 500000,
      gracePeriodDays: 7,
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
    customerSourceMode: 'quotation',
    referenceQuotationId: 'QT-001',
    agreementType: 'non_agreemented',
    workflowType: 'marine',
    billingType: 'advance',
    status: 'submitted',
    startDate: daysAgoDate(10),
    endDate: daysFromNow(355),
    entities: [
      {
        id: 'ent-3',
        entityName: 'Oceanic Crew HQ',
        billingAddress: 'Marine Drive, Chennai 600001',
        gstNumber: '33AABCO5678B1Z3',
        contactPerson: 'Rajesh Kumar',
        email: 'accounts@oceaniccrew.com',
        phone: '+91 9876543211',
        status: 'active',
      },
    ],
    pricingMatrix: [
      {
        id: 'pr-4',
        country: 'Singapore',
        countryId: 'CNT-102',
        visaType: 'Marine Visa',
        workflowType: 'Marine',
        servicePresetId: 'svc-marine-visa',
        servicePresetName: 'Marine crew visa processing',
        serviceFee: 1800,
        gstApplicable: true,
        remarks: '',
      },
    ],
    miscellaneousCosts: [],
    billingConfig: {
      ...createDefaultBillingConfig(),
      creditBillingEnabled: false,
      advanceType: 'percentage',
      advancePercentage: 100,
      processingBlockRule: 'before_submission',
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
    activities: [],
  },
  {
    id: 'AGR-003',
    agreementId: 'AGR-2024-003',
    companyId: 'CMP-1003',
    companyName: 'Global Corporate Travel Ltd',
    customerSourceMode: 'new',
    agreementType: 'agreemented',
    workflowType: 'corporate',
    billingType: 'mixed',
    status: 'draft',
    startDate: '',
    endDate: '',
    entities: [],
    pricingMatrix: [],
    miscellaneousCosts: [],
    billingConfig: {
      ...createDefaultBillingConfig(),
      creditBillingEnabled: true,
      billingCycle: 'quarterly',
      creditPeriodDays: 45,
      creditLimit: 1000000,
      advancePercentage: 50,
      serviceWiseBillingRules: [
        { servicePresetId: 'svc-corp-visa', servicePresetName: 'Corporate business visa', billingRule: 'advance' },
        { servicePresetId: 'svc-apostille', servicePresetName: 'Apostille & attestation', billingRule: 'credit' },
      ],
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
  {
    id: 'AGR-004',
    agreementId: 'AGR-2024-004',
    companyId: 'CMP-1004',
    companyName: 'TravelDesk B2B Partners',
    customerSourceMode: 'quotation',
    referenceQuotationId: 'QT-003',
    agreementType: 'agreemented',
    workflowType: 'b2b_agent',
    billingType: 'advance',
    status: 'inactive',
    startDate: daysAgoDate(90),
    endDate: daysAgoDate(1),
    entities: [
      {
        id: 'ent-4',
        entityName: 'TravelDesk North',
        billingAddress: 'Connaught Place, New Delhi 110001',
        gstNumber: '07AABCT9012H1Z8',
        contactPerson: 'Rohit Malhotra',
        email: 'north@traveldeskb2b.com',
        phone: '+91 9876501234',
        status: 'inactive',
      },
    ],
    pricingMatrix: [
      {
        id: 'pr-5',
        country: 'Schengen',
        countryId: 'CNT-104',
        visaType: 'Agent Tourist Visa',
        workflowType: 'B2B Agent',
        servicePresetId: 'svc-corp-visa',
        servicePresetName: 'Corporate business visa',
        serviceFee: 2800,
        gstApplicable: true,
        remarks: '',
      },
    ],
    miscellaneousCosts: [],
    billingConfig: {
      ...createDefaultBillingConfig(),
      creditBillingEnabled: false,
      advanceType: 'full',
      advancePercentage: 100,
    },
    financeContacts: {
      accountsSpocName: 'Rohit Malhotra',
      accountsTeamEmail: 'finance@traveldeskb2b.com',
      accountsContactNumber: '+91 9876501234',
      invoiceSubmissionEmail: 'invoices@traveldeskb2b.com',
      paymentFollowUpContact: 'collections@traveldeskb2b.com',
    },
    documents: defaultDocs(),
    createdAt: daysAgo(100),
    updatedAt: daysAgo(10),
    approvedAt: daysAgo(95),
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

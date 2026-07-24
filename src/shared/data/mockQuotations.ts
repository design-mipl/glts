import type { QuotationRecord } from '@/shared/types/quotation'
import { computePricingTotals } from '@/shared/utils/quotationCalculations'
import { hydrateStructuredPricingFromMatrix } from '@/shared/utils/quotationPricingUtils'
import type { AgreementWorkflowType } from '@/shared/types/commercialAgreement'

function daysAgo(days: number) {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString()
}

function daysFromToday(days: number) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

function makeVersion(
  id: string,
  versionNumber: number,
  pricingMatrix: QuotationRecord['pricingVersions'][0]['pricingMatrix'],
  gstPercentage: number,
  createdBy: string,
  createdAt: string,
  workflowType: AgreementWorkflowType = 'corporate',
): QuotationRecord['pricingVersions'][0] {
  const structured = hydrateStructuredPricingFromMatrix(pricingMatrix, workflowType)
  return {
    id,
    versionLabel: `V${versionNumber}`,
    versionNumber,
    pricingMatrix,
    ...structured,
    totals: computePricingTotals(pricingMatrix, gstPercentage),
    createdBy,
    createdAt,
  }
}

const harborV1Matrix = [
  {
    id: 'qpr-1',
    country: 'China',
    countryId: 'CNT-101',
    visaType: 'Marine Visa',
    workflowType: 'Marine',
    servicePresetId: 'svc-marine-visa',
    servicePresetName: 'Marine crew visa processing',
    serviceFee: 5000,
    gstApplicable: true,
    remarks: 'From quotation',
  },
  {
    id: 'qpr-2',
    country: 'Singapore',
    countryId: 'CNT-102',
    visaType: 'Marine Visa',
    workflowType: 'Marine',
    servicePresetId: 'svc-marine-visa',
    servicePresetName: 'Marine crew visa processing',
    serviceFee: 1000,
    gstApplicable: true,
    remarks: 'Insurance',
  },
]

const harborV2Matrix = [{ ...harborV1Matrix[0]!, id: 'qpr-1b' }]

const harborV3Matrix = [{ ...harborV1Matrix[0]!, id: 'qpr-1c', serviceFee: 4500 }]

export const SEED_QUOTATIONS: QuotationRecord[] = [
  {
    id: 'QT-001',
    quotationNo: 'QUO-2024-101',
    sourceType: 'direct',
    workflowType: 'marine',
    customer: {
      companyName: 'Harbor Crew Management',
      contactPersonName: 'Vikram Desai',
      contactNumber: '+91 9123456780',
      emailAddress: 'vikram@harborcrew.com',
      companyAddress: '12 Dockyard Road, Mumbai',
    },
    quotationDate: daysAgo(12).slice(0, 10),
    validTill: daysFromToday(30),
    notes: 'Marine crew visa processing proposal.',
    gstRateId: 'gst-18',
    gstPercentage: 18,
    attachments: [],
    activities: [
      {
        id: 'qact-1',
        timestamp: daysAgo(12),
        actor: 'Neha Arora',
        action: 'Created',
        detail: 'Quotation created',
      },
      {
        id: 'qact-2',
        timestamp: daysAgo(3),
        actor: 'Rajan Mehta',
        action: 'Shared',
        detail: 'Quotation shared with customer',
      },
    ],
    sharedStatus: 'shared',
    status: 'quotation_sent',
    sharedAt: daysAgo(3),
    sharedBy: 'Rajan Mehta',
    currentVersionId: 'qver-1-3',
    pricingVersions: [
      makeVersion('qver-1-1', 1, harborV1Matrix, 18, 'Neha Arora', daysAgo(12), 'marine'),
      makeVersion('qver-1-2', 2, harborV2Matrix, 18, 'Neha Arora', daysAgo(8), 'marine'),
      makeVersion('qver-1-3', 3, harborV3Matrix, 18, 'Neha Arora', daysAgo(4), 'marine'),
    ],
    createdAt: daysAgo(12),
    createdBy: 'Neha Arora',
    updatedAt: daysAgo(2),
  },
  {
    id: 'QT-002',
    quotationNo: 'QUO-2024-102',
    sourceType: 'direct',
    workflowType: 'corporate',
    customer: {
      companyName: 'Skyline Corporate Services',
      contactPersonName: 'Anita Rao',
      contactNumber: '+91 9988001122',
      emailAddress: 'anita@skylinecorp.com',
      companyAddress: '88 MG Road, Bengaluru',
    },
    quotationDate: daysAgo(8).slice(0, 10),
    validTill: daysFromToday(22),
    notes: 'Corporate business visa services.',
    gstRateId: 'gst-18',
    gstPercentage: 18,
    attachments: [],
    activities: [
      { id: 'qact-3', timestamp: daysAgo(8), actor: 'Neha Arora', action: 'Created', detail: 'Quotation created' },
    ],
    sharedStatus: 'not_shared',
    status: 'new',
    currentVersionId: 'qver-2-1',
    pricingVersions: [
      makeVersion(
        'qver-2-1',
        1,
        [
          {
            id: 'qpr-3',
            country: 'USA',
            countryId: 'CNT-103',
            visaType: 'Business Visa',
            workflowType: 'Corporate',
            servicePresetId: 'svc-corp-visa',
            servicePresetName: 'Corporate business visa',
            serviceFee: 4200,
            gstApplicable: true,
            remarks: '',
          },
        ],
        18,
        'Neha Arora',
        daysAgo(8),
        'corporate',
      ),
    ],
    createdAt: daysAgo(8),
    createdBy: 'Neha Arora',
    updatedAt: daysAgo(7),
  },
  {
    id: 'QT-003',
    quotationNo: 'QUO-2024-103',
    sourceType: 'direct',
    workflowType: 'b2b_agent',
    customer: {
      companyName: 'TravelDesk B2B Partners',
      contactPersonName: 'Rohit Malhotra',
      contactNumber: '+91 9876501234',
      emailAddress: 'rohit@traveldeskb2b.com',
      companyAddress: '45 Connaught Place, New Delhi',
    },
    quotationDate: daysAgo(5).slice(0, 10),
    validTill: daysFromToday(25),
    notes: 'B2B agent pricing for Schengen.',
    gstRateId: 'gst-18',
    gstPercentage: 18,
    attachments: [],
    activities: [
      { id: 'qact-4', timestamp: daysAgo(5), actor: 'Neha Arora', action: 'Created', detail: 'Quotation created' },
    ],
    sharedStatus: 'not_shared',
    status: 'negotiation',
    currentVersionId: 'qver-3-1',
    pricingVersions: [
      makeVersion(
        'qver-3-1',
        1,
        [
          {
            id: 'qpr-4',
            country: 'France',
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
        18,
        'Neha Arora',
        daysAgo(5),
        'b2b_agent',
      ),
    ],
    createdAt: daysAgo(5),
    createdBy: 'Neha Arora',
    updatedAt: daysAgo(4),
  },
  {
    id: 'QT-004',
    quotationNo: 'QUO-2025-001',
    sourceType: 'enquiry',
    enquiryId: 'ENQ-24001',
    workflowType: 'marine',
    customer: {
      companyName: 'Apex Marine Logistics',
      contactPersonName: 'Rohit Menon',
      contactNumber: '+91 9988776655',
      emailAddress: 'rohit@apexmarine.com',
      companyAddress: 'Mumbai Port Road, Mumbai',
    },
    quotationDate: daysAgo(2).slice(0, 10),
    validTill: daysFromToday(14),
    notes: 'Generated from enquiry ENQ-24001.',
    gstRateId: 'gst-18',
    gstPercentage: 18,
    attachments: [],
    activities: [
      {
        id: 'qact-6',
        timestamp: daysAgo(2),
        actor: 'Neha Arora',
        action: 'Created from enquiry',
        detail: 'Converted from ENQ-24001',
      },
    ],
    sharedStatus: 'not_shared',
    status: 'qualified',
    currentVersionId: 'qver-4-1',
    pricingVersions: [makeVersion('qver-4-1', 1, [], 18, 'Neha Arora', daysAgo(2), 'marine')],
    createdAt: daysAgo(2),
    createdBy: 'Neha Arora',
    updatedAt: daysAgo(2),
  },
  {
    id: 'QT-005',
    quotationNo: 'QUO-2025-002',
    sourceType: 'direct',
    workflowType: 'corporate',
    customer: {
      companyName: 'Pinnacle Global HR',
      contactPersonName: 'Sneha Iyer',
      contactNumber: '+91 9000012345',
      emailAddress: 'sneha@pinnacleglobal.com',
      companyAddress: 'Electronic City, Bengaluru',
    },
    quotationDate: daysAgo(1).slice(0, 10),
    validTill: daysFromToday(20),
    notes: '',
    gstRateId: 'gst-18',
    gstPercentage: 18,
    attachments: [],
    activities: [
      { id: 'qact-7', timestamp: daysAgo(1), actor: 'Neha Arora', action: 'Created', detail: 'Draft quotation' },
    ],
    sharedStatus: 'not_shared',
    status: 'awaiting_confirmation',
    currentVersionId: 'qver-5-1',
    pricingVersions: [
      makeVersion(
        'qver-5-1',
        1,
        [
          {
            id: 'qpr-5',
            country: 'UK',
            countryId: 'CNT-105',
            visaType: 'Business Visa',
            workflowType: 'Corporate',
            servicePresetId: 'svc-corp-visa',
            servicePresetName: 'Corporate business visa',
            serviceFee: 3500,
            gstApplicable: true,
            remarks: '',
          },
        ],
        18,
        'Neha Arora',
        daysAgo(1),
        'corporate',
      ),
    ],
    createdAt: daysAgo(1),
    createdBy: 'Neha Arora',
    updatedAt: daysAgo(1),
  },
]

export function getMockQuotations(): QuotationRecord[] {
  return SEED_QUOTATIONS.map((q) => structuredClone(q))
}

export function setMockQuotationsStore(rows: QuotationRecord[]) {
  SEED_QUOTATIONS.length = 0
  SEED_QUOTATIONS.push(...rows)
}

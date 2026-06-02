import { GLTS_INVOICE_ID } from '@/pages/customer/data/portalIds'
import type { Invoice } from '@/shared/types/invoice'

function daysAgo(days: number) {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString()
}

function daysAgoDate(days: number) {
  return daysAgo(days).slice(0, 10)
}

function daysFromNowDate(days: number) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

export const SEED_INVOICES: Invoice[] = [
  {
    id: 'INV-001',
    invoiceId: GLTS_INVOICE_ID,
    invoiceType: 'single_application',
    billingMode: 'single',
    companyId: 'CMP-1001',
    companyName: 'Apex Marine Logistics',
    billingEntity: 'Apex Marine Logistics Pvt Ltd',
    vesselId: 'GLTS-VSL-001',
    vesselName: 'MV Ocean Star',
    agreementId: 'AGR-001',
    gltsReferences: ['GLTS-APP-2026-790'],
    batchIds: [],
    totalApplications: 1,
    country: 'Japan',
    visaType: 'eVisa · Tourist',
    lineItems: [
      {
        id: 'li-seed-1',
        applicationId: 'GLTS-APP-2026-790',
        serviceType: 'Visa Fees',
        description: 'Japan · eVisa · Tourist service fee',
        quantity: 1,
        unitPrice: 1500,
        gstApplicable: true,
        gstAmount: 270,
        amount: 1770,
      },
      {
        id: 'li-seed-2',
        applicationId: 'GLTS-APP-2026-790',
        serviceType: 'Courier Charges',
        description: 'Courier Charges',
        quantity: 1,
        unitPrice: 500,
        gstApplicable: true,
        gstAmount: 90,
        amount: 590,
      },
    ],
    taxConfig: { gstApplicable: true, gstPercentage: 18, tdsApplicable: false, tdsPercentage: 0 },
    totals: { subtotal: 2000, gstTotal: 360, tdsAmount: 0, additionalCharges: 0, finalAmount: 2360 },
    invoiceStatus: 'shared',
    paymentStatus: 'pending',
    invoiceDate: daysAgoDate(5),
    dueDate: daysFromNowDate(25),
    paymentTerms: 'Net 30',
    lastUpdated: daysAgo(2),
    createdAt: daysAgo(5),
    sharedAt: daysAgo(3),
    sharedToEmail: 'invoices@apexmarine.com',
    activities: [
      {
        id: 'act-1',
        timestamp: daysAgo(5),
        actor: 'Finance Admin',
        action: 'Invoice generated',
        detail: 'Invoice created from application GLTS-APP-2026-790',
      },
      {
        id: 'act-2',
        timestamp: daysAgo(3),
        actor: 'Finance Admin',
        action: 'Invoice shared',
        detail: 'Sent to invoices@apexmarine.com',
      },
    ],
    attachments: [{ id: 'att-1', name: 'GLTS-INV-8821.pdf', type: 'invoice_pdf', uploadedAt: daysAgo(5) }],
    payments: [],
  },
  {
    id: 'INV-002',
    invoiceId: 'GLTS-INV-8822',
    invoiceType: 'batch',
    billingMode: 'batch',
    companyId: 'CMP-1001',
    companyName: 'Apex Marine Logistics',
    billingEntity: 'Apex Marine Logistics Pvt Ltd',
    vesselId: 'GLTS-VSL-002',
    vesselName: 'MV Pacific Glory',
    agreementId: 'AGR-001',
    gltsReferences: ['GLTS-BAT-2026-041'],
    batchIds: ['GLTS-BAT-2026-041'],
    totalApplications: 24,
    country: 'Schengen',
    visaType: 'Crew · Type C',
    lineItems: [
      {
        id: 'li-seed-3',
        batchId: 'GLTS-BAT-2026-041',
        serviceType: 'Visa Fees',
        description: 'Schengen · Crew · Type C service fee',
        quantity: 24,
        unitPrice: 1500,
        gstApplicable: true,
        gstAmount: 6480,
        amount: 42480,
      },
    ],
    taxConfig: { gstApplicable: true, gstPercentage: 18, tdsApplicable: false, tdsPercentage: 0 },
    totals: { subtotal: 36000, gstTotal: 6480, tdsAmount: 0, additionalCharges: 0, finalAmount: 42480 },
    invoiceStatus: 'generated',
    paymentStatus: 'pending',
    invoiceDate: daysAgoDate(3),
    dueDate: daysFromNowDate(27),
    paymentTerms: 'Net 30',
    lastUpdated: daysAgo(1),
    createdAt: daysAgo(3),
    activities: [
      {
        id: 'act-3',
        timestamp: daysAgo(3),
        actor: 'Finance Admin',
        action: 'Invoice generated',
        detail: 'Batch invoice for GLTS-BAT-2026-041',
      },
    ],
    attachments: [],
    payments: [],
  },
  {
    id: 'INV-003',
    invoiceId: 'GLTS-INV-8823',
    invoiceType: 'cumulative',
    billingMode: 'cumulative',
    companyId: 'CMP-1001',
    companyName: 'Apex Marine Logistics',
    billingEntity: 'Apex Marine Logistics Pvt Ltd',
    vesselName: 'MV Ocean Star',
    agreementId: 'AGR-001',
    gltsReferences: ['GLTS-APP-2026-790', 'GLTS-APP-2026-778'],
    batchIds: [],
    totalApplications: 2,
    country: 'Mixed',
    visaType: 'Mixed',
    lineItems: [
      {
        id: 'li-seed-4',
        applicationId: 'GLTS-APP-2026-790',
        serviceType: 'Visa Fees',
        description: 'Japan visa service',
        quantity: 1,
        unitPrice: 1500,
        gstApplicable: true,
        gstAmount: 270,
        amount: 1770,
      },
      {
        id: 'li-seed-5',
        applicationId: 'GLTS-APP-2026-778',
        serviceType: 'Courier Charges',
        description: 'Courier for UAE application',
        quantity: 1,
        unitPrice: 500,
        gstApplicable: true,
        gstAmount: 90,
        amount: 590,
      },
    ],
    taxConfig: { gstApplicable: true, gstPercentage: 18, tdsApplicable: true, tdsPercentage: 2 },
    totals: { subtotal: 2000, gstTotal: 360, tdsAmount: 47.2, additionalCharges: 0, finalAmount: 2312.8 },
    invoiceStatus: 'partially_paid',
    paymentStatus: 'partial',
    invoiceDate: daysAgoDate(15),
    dueDate: daysFromNowDate(5),
    paymentTerms: 'Net 30',
    lastUpdated: daysAgo(4),
    createdAt: daysAgo(15),
    activities: [
      {
        id: 'act-4',
        timestamp: daysAgo(15),
        actor: 'Finance Admin',
        action: 'Invoice generated',
        detail: 'Cumulative invoice for 2 applications',
      },
    ],
    attachments: [],
    payments: [
      {
        id: 'pay-1',
        date: daysAgoDate(7),
        amount: 1000,
        method: 'NEFT',
        reference: 'UTR8829100',
        status: 'partial',
      },
    ],
  },
  {
    id: 'INV-004',
    invoiceId: 'GLTS-INV-8824',
    invoiceType: 'additional_expense',
    billingMode: 'single',
    companyId: 'CMP-1001',
    companyName: 'Apex Marine Logistics',
    billingEntity: 'Apex Marine Logistics Pvt Ltd',
    gltsReferences: ['GLTS-APP-2026-790'],
    batchIds: [],
    totalApplications: 1,
    lineItems: [
      {
        id: 'li-seed-6',
        applicationId: 'GLTS-APP-2026-790',
        serviceType: 'Airport Assistance',
        description: 'Urgent airport assistance',
        quantity: 1,
        unitPrice: 1200,
        gstApplicable: true,
        gstAmount: 216,
        amount: 1416,
      },
    ],
    taxConfig: { gstApplicable: true, gstPercentage: 18, tdsApplicable: false, tdsPercentage: 0 },
    totals: { subtotal: 1200, gstTotal: 216, tdsAmount: 0, additionalCharges: 0, finalAmount: 1416 },
    invoiceStatus: 'paid',
    paymentStatus: 'paid',
    invoiceDate: daysAgoDate(20),
    dueDate: daysAgoDate(5),
    lastUpdated: daysAgo(6),
    createdAt: daysAgo(20),
    activities: [],
    attachments: [],
    payments: [
      {
        id: 'pay-2',
        date: daysAgoDate(6),
        amount: 1416,
        method: 'RTGS',
        reference: 'UTR9910200',
        status: 'paid',
      },
    ],
  },
  {
    id: 'INV-005',
    invoiceId: 'GLTS-INV-8825',
    invoiceType: 'single_application',
    billingMode: 'single',
    companyId: 'CMP-1002',
    companyName: 'Oceanic Crew Services',
    billingEntity: 'Oceanic Crew Services Pvt Ltd',
    gltsReferences: [],
    batchIds: [],
    totalApplications: 0,
    lineItems: [],
    taxConfig: { gstApplicable: true, gstPercentage: 18, tdsApplicable: false, tdsPercentage: 0 },
    totals: { subtotal: 0, gstTotal: 0, tdsAmount: 0, additionalCharges: 0, finalAmount: 0 },
    invoiceStatus: 'draft',
    paymentStatus: 'pending',
    invoiceDate: daysAgoDate(1),
    dueDate: daysFromNowDate(29),
    lastUpdated: daysAgo(0),
    createdAt: daysAgo(1),
    activities: [],
    attachments: [],
    payments: [],
  },
  {
    id: 'INV-006',
    invoiceId: 'GLTS-INV-8826',
    invoiceType: 'single_application',
    billingMode: 'single',
    companyId: 'CMP-1001',
    companyName: 'Apex Marine Logistics',
    billingEntity: 'Apex Marine Logistics Pvt Ltd',
    gltsReferences: ['GLTS-APP-2026-751'],
    batchIds: [],
    totalApplications: 1,
    lineItems: [
      {
        id: 'li-seed-7',
        applicationId: 'GLTS-APP-2026-751',
        serviceType: 'Visa Fees',
        description: 'Japan visa fee',
        quantity: 1,
        unitPrice: 1500,
        gstApplicable: true,
        gstAmount: 270,
        amount: 1770,
      },
    ],
    taxConfig: { gstApplicable: true, gstPercentage: 18, tdsApplicable: false, tdsPercentage: 0 },
    totals: { subtotal: 1500, gstTotal: 270, tdsAmount: 0, additionalCharges: 0, finalAmount: 1770 },
    invoiceStatus: 'overdue',
    paymentStatus: 'pending',
    invoiceDate: daysAgoDate(45),
    dueDate: daysAgoDate(15),
    lastUpdated: daysAgo(10),
    createdAt: daysAgo(45),
    activities: [],
    attachments: [],
    payments: [],
  },
  {
    id: 'INV-007',
    invoiceId: 'GLTS-INV-8827',
    invoiceType: 'credit_note',
    billingMode: 'single',
    companyId: 'CMP-1001',
    companyName: 'Apex Marine Logistics',
    billingEntity: 'Apex Marine Logistics Pvt Ltd',
    gltsReferences: ['GLTS-APP-2026-790'],
    batchIds: [],
    totalApplications: 1,
    sourceInvoiceId: 'INV-001',
    lineItems: [
      {
        id: 'li-seed-8',
        applicationId: 'GLTS-APP-2026-790',
        serviceType: 'Courier Charges',
        description: 'Credit adjustment — duplicate courier charge',
        quantity: 1,
        unitPrice: -500,
        gstApplicable: true,
        gstAmount: -90,
        amount: -590,
      },
    ],
    taxConfig: { gstApplicable: true, gstPercentage: 18, tdsApplicable: false, tdsPercentage: 0 },
    totals: { subtotal: -500, gstTotal: -90, tdsAmount: 0, additionalCharges: 0, finalAmount: -590 },
    invoiceStatus: 'generated',
    paymentStatus: 'pending',
    invoiceDate: daysAgoDate(2),
    dueDate: daysFromNowDate(28),
    lastUpdated: daysAgo(2),
    createdAt: daysAgo(2),
    activities: [
      {
        id: 'act-5',
        timestamp: daysAgo(2),
        actor: 'Finance Admin',
        action: 'Credit note created',
        detail: 'Partial adjustment against GLTS-INV-8821',
      },
    ],
    attachments: [],
    payments: [],
  },
]

const STORAGE_KEY = 'glts:invoices'

let memoryStore: Invoice[] | null = null

function loadStore(): Invoice[] {
  if (memoryStore) return memoryStore
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      memoryStore = JSON.parse(raw) as Invoice[]
      return memoryStore
    }
  } catch {
    /* ignore */
  }
  memoryStore = [...SEED_INVOICES]
  return memoryStore
}

export function getMockInvoices(): Invoice[] {
  return loadStore()
}

export function setMockInvoicesStore(rows: Invoice[]) {
  memoryStore = rows
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rows))
  } catch {
    /* ignore */
  }
}

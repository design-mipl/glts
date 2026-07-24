import { GLTS_INVOICE_ID } from '@/pages/customer/data/portalIds'
import type {
  BillingMode,
  Invoice,
  InvoiceLineItem,
  InvoiceStatus,
  InvoiceType,
} from '@/shared/types/invoice'
import { computeInvoiceBillingAdjustment, mergeTotalsWithAdjustment } from '@/shared/utils/invoiceBillingAdjustment'
import { computeInvoiceTotals, getInvoiceApplicationCount } from '@/shared/utils/invoiceCalculations'

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

function lineItem(partial: Omit<InvoiceLineItem, 'included' | 'billingStatus' | 'isAdditionalExpense'> & {
  included?: boolean
  billingStatus?: InvoiceLineItem['billingStatus']
  isAdditionalExpense?: boolean
}): InvoiceLineItem {
  return {
    included: partial.included ?? true,
    billingStatus: partial.billingStatus ?? 'unbilled',
    isAdditionalExpense: partial.isAdditionalExpense ?? false,
    remarks: partial.remarks ?? '',
    ...partial,
  }
}

function withAdjustment(invoice: Omit<Invoice, 'totals' | 'billingAdjustment'> & { totals: Invoice['totals'] }): Invoice {
  const base = computeInvoiceTotals(invoice.lineItems, invoice.taxConfig, invoice.totals.additionalCharges)
  const adjustment = computeInvoiceBillingAdjustment(undefined, base.finalAmount)
  return {
    ...invoice,
    totals: mergeTotalsWithAdjustment(base, adjustment),
    billingAdjustment: adjustment.snapshot,
  }
}

export const SEED_INVOICES: Invoice[] = [
  withAdjustment({
    id: 'INV-001',
    invoiceId: GLTS_INVOICE_ID,
    invoiceType: 'single_invoice',
    billingMode: 'application_wise',
    companyId: 'CMP-1001',
    companyName: 'Apex Marine Logistics',
    billingEntity: 'Apex Marine Logistics Pvt Ltd',
    vesselId: 'GLTS-VSL-001',
    vesselName: 'MV Ocean Star',
    agreementId: 'AGR-001',
    poReference: 'PO-AMX-2026-014',
    gltsReferences: ['GLTS-APP-2026-790'],
    batchIds: [],
    totalApplications: 1,
    country: 'Japan',
    visaType: 'eVisa · Tourist',
    lineItems: [
      lineItem({
        id: 'li-seed-1',
        applicationId: 'GLTS-APP-2026-790',
        applicantName: 'Rajesh Kumar',
        serviceType: 'GLTS processing fees',
        description: 'Japan · eVisa · Tourist — GLTS processing fees',
        quantity: 1,
        unitPrice: 1500,
        gstApplicable: true,
        gstAmount: 270,
        amount: 1770,
        billingStatus: 'billed',
      }),
      lineItem({
        id: 'li-seed-2',
        applicationId: 'GLTS-APP-2026-790',
        applicantName: 'Rajesh Kumar',
        serviceType: 'Courier Charges',
        description: 'Courier & dispatch',
        quantity: 1,
        unitPrice: 500,
        gstApplicable: true,
        gstAmount: 90,
        amount: 590,
        billingStatus: 'billed',
      }),
    ],
    taxConfig: { gstApplicable: true, gstPercentage: 18, tdsApplicable: false, tdsPercentage: 0 },
    totals: { subtotal: 2000, gstTotal: 360, tdsAmount: 0, additionalCharges: 0, finalAmount: 2360, advanceAvailable: 0, advanceAdjusted: 0, creditApplied: 0, balancePayable: 2360 },
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
      { id: 'act-1', timestamp: daysAgo(5), actor: 'Finance Admin', action: 'Invoice submitted', detail: 'Invoice created from application GLTS-APP-2026-790' },
      { id: 'act-2', timestamp: daysAgo(3), actor: 'Finance Admin', action: 'Invoice shared', detail: 'Sent to invoices@apexmarine.com' },
    ],
    attachments: [{ id: 'att-1', name: 'GLTS-INV-8821.pdf', type: 'invoice_pdf', uploadedAt: daysAgo(5) }],
    payments: [],
  }),
  withAdjustment({
    id: 'INV-002',
    invoiceId: 'GLTS-INV-8822',
    invoiceType: 'cumulative',
    billingMode: 'application_wise',
    companyId: 'CMP-1001',
    companyName: 'Apex Marine Logistics',
    billingEntity: 'Apex Marine Logistics Pvt Ltd',
    vesselId: 'GLTS-VSL-002',
    vesselName: 'MV Pacific Glory',
    agreementId: 'AGR-001',
    gltsReferences: ['GLTS-BAT-2026-041'],
    batchIds: ['GLTS-BAT-2026-041'],
    totalApplications: 1,
    country: 'France',
    visaType: 'Crew · Type C',
    lineItems: [
      lineItem({
        id: 'li-seed-3',
        batchId: 'GLTS-BAT-2026-041',
        serviceType: 'GLTS processing fees',
        description: 'France · Crew · Type C — GLTS processing fees',
        quantity: 24,
        unitPrice: 1500,
        gstApplicable: true,
        gstAmount: 6480,
        amount: 42480,
        billingStatus: 'billed',
      }),
    ],
    taxConfig: { gstApplicable: true, gstPercentage: 18, tdsApplicable: false, tdsPercentage: 0 },
    totals: { subtotal: 36000, gstTotal: 6480, tdsAmount: 0, additionalCharges: 0, finalAmount: 42480, advanceAvailable: 0, advanceAdjusted: 0, creditApplied: 0, balancePayable: 42480 },
    invoiceStatus: 'submitted',
    paymentStatus: 'pending',
    invoiceDate: daysAgoDate(3),
    dueDate: daysFromNowDate(27),
    paymentTerms: 'Net 30',
    lastUpdated: daysAgo(1),
    createdAt: daysAgo(3),
    activities: [{ id: 'act-3', timestamp: daysAgo(3), actor: 'Finance Admin', action: 'Invoice submitted', detail: 'Batch invoice for GLTS-BAT-2026-041' }],
    attachments: [],
    payments: [],
  }),
  withAdjustment({
    id: 'INV-003',
    invoiceId: 'GLTS-INV-8823',
    invoiceType: 'cumulative',
    billingMode: 'application_wise',
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
      lineItem({ id: 'li-seed-4', applicationId: 'GLTS-APP-2026-790', serviceType: 'GLTS processing fees', description: 'Japan — GLTS processing fees', quantity: 1, unitPrice: 1500, gstApplicable: true, gstAmount: 270, amount: 1770, billingStatus: 'billed' }),
      lineItem({ id: 'li-seed-4b', applicationId: 'GLTS-APP-2026-778', serviceType: 'GLTS processing fees', description: 'UAE — GLTS processing fees', quantity: 1, unitPrice: 1500, gstApplicable: true, gstAmount: 270, amount: 1770, billingStatus: 'billed' }),
      lineItem({ id: 'li-seed-5', applicationId: 'GLTS-APP-2026-778', serviceType: 'Courier Charges', description: 'Courier & dispatch — UAE application', quantity: 1, unitPrice: 500, gstApplicable: true, gstAmount: 90, amount: 590, billingStatus: 'billed' }),
    ],
    taxConfig: { gstApplicable: true, gstPercentage: 18, tdsApplicable: true, tdsPercentage: 2 },
    totals: { subtotal: 3500, gstTotal: 630, tdsAmount: 82.6, additionalCharges: 0, finalAmount: 4047.4, advanceAvailable: 0, advanceAdjusted: 0, creditApplied: 0, balancePayable: 3047.4 },
    invoiceStatus: 'partially_paid',
    paymentStatus: 'partial',
    invoiceDate: daysAgoDate(15),
    dueDate: daysFromNowDate(5),
    paymentTerms: 'Net 30',
    lastUpdated: daysAgo(4),
    createdAt: daysAgo(15),
    activities: [{ id: 'act-4', timestamp: daysAgo(15), actor: 'Finance Admin', action: 'Invoice submitted', detail: 'Cumulative invoice for 2 applications' }],
    attachments: [],
    payments: [{
      id: 'pay-1',
      date: daysAgoDate(7),
      amount: 1000,
      method: 'NEFT',
      reference: 'UTR8829100',
      status: 'partial',
      receiptNumber: 'GLTS-RCP-2026-1042',
      verificationStatus: 'verified',
      accountsNotes: 'Partial payment received and matched against GLTS-INV-8823.',
    }],
  }),
  withAdjustment({
    id: 'INV-004',
    invoiceId: 'GLTS-INV-8824',
    invoiceType: 'additional_expense',
    billingMode: 'application_wise',
    companyId: 'CMP-1001',
    companyName: 'Apex Marine Logistics',
    billingEntity: 'Apex Marine Logistics Pvt Ltd',
    gltsReferences: ['GLTS-APP-2026-790'],
    batchIds: [],
    totalApplications: 1,
    lineItems: [
      lineItem({ id: 'li-seed-6', applicationId: 'GLTS-APP-2026-790', serviceType: 'Airport Assistance', description: 'Secondary invoice — urgent airport assistance', quantity: 1, unitPrice: 1200, gstApplicable: true, gstAmount: 216, amount: 1416, isAdditionalExpense: true, billingStatus: 'billed' }),
    ],
    taxConfig: { gstApplicable: true, gstPercentage: 18, tdsApplicable: false, tdsPercentage: 0 },
    totals: { subtotal: 1200, gstTotal: 216, tdsAmount: 0, additionalCharges: 0, finalAmount: 1416, advanceAvailable: 0, advanceAdjusted: 0, creditApplied: 0, balancePayable: 0 },
    invoiceStatus: 'paid',
    paymentStatus: 'paid',
    invoiceDate: daysAgoDate(20),
    gstFiledAt: daysAgoDate(10),
    dueDate: daysAgoDate(5),
    lastUpdated: daysAgo(6),
    createdAt: daysAgo(20),
    activities: [],
    attachments: [],
    payments: [{
      id: 'pay-2',
      date: daysAgoDate(6),
      amount: 1416,
      method: 'RTGS',
      reference: 'UTR9910200',
      status: 'paid',
      receiptNumber: 'GLTS-RCP-2026-1038',
      verificationStatus: 'verified',
      accountsNotes: 'Full settlement for additional expense invoice.',
    }],
  }),
  withAdjustment({
    id: 'INV-005',
    invoiceId: 'GLTS-INV-8825',
    invoiceType: 'single_invoice',
    billingMode: 'application_wise',
    companyId: 'CMP-1002',
    companyName: 'Oceanic Crew Services',
    billingEntity: 'Oceanic Crew Services Pvt Ltd',
    gltsReferences: [],
    batchIds: [],
    totalApplications: 0,
    lineItems: [],
    taxConfig: { gstApplicable: true, gstPercentage: 18, tdsApplicable: false, tdsPercentage: 0 },
    totals: { subtotal: 0, gstTotal: 0, tdsAmount: 0, additionalCharges: 0, finalAmount: 0, advanceAvailable: 0, advanceAdjusted: 0, creditApplied: 0, balancePayable: 0 },
    invoiceStatus: 'draft',
    paymentStatus: 'pending',
    invoiceDate: daysAgoDate(1),
    dueDate: daysFromNowDate(29),
    lastUpdated: daysAgo(0),
    createdAt: daysAgo(1),
    activities: [],
    attachments: [],
    payments: [],
  }),
  withAdjustment({
    id: 'INV-006',
    invoiceId: 'GLTS-INV-8826',
    invoiceType: 'single_invoice',
    billingMode: 'application_wise',
    companyId: 'CMP-1001',
    companyName: 'Apex Marine Logistics',
    billingEntity: 'Apex Marine Logistics Pvt Ltd',
    gltsReferences: ['GLTS-APP-2026-751'],
    batchIds: [],
    totalApplications: 1,
    lineItems: [
      lineItem({ id: 'li-seed-7', applicationId: 'GLTS-APP-2026-751', serviceType: 'GLTS processing fees', description: 'Japan — GLTS processing fees', quantity: 1, unitPrice: 1500, gstApplicable: true, gstAmount: 270, amount: 1770, billingStatus: 'billed' }),
    ],
    taxConfig: { gstApplicable: true, gstPercentage: 18, tdsApplicable: false, tdsPercentage: 0 },
    totals: { subtotal: 1500, gstTotal: 270, tdsAmount: 0, additionalCharges: 0, finalAmount: 1770, advanceAvailable: 0, advanceAdjusted: 0, creditApplied: 0, balancePayable: 1770 },
    invoiceStatus: 'overdue',
    paymentStatus: 'pending',
    invoiceDate: daysAgoDate(45),
    dueDate: daysAgoDate(15),
    lastUpdated: daysAgo(10),
    createdAt: daysAgo(45),
    activities: [],
    attachments: [],
    payments: [],
  }),
  withAdjustment({
    id: 'INV-007',
    invoiceId: 'GLTS-INV-8827',
    invoiceType: 'credit_note',
    billingMode: 'application_wise',
    companyId: 'CMP-1001',
    companyName: 'Apex Marine Logistics',
    billingEntity: 'Apex Marine Logistics Pvt Ltd',
    gltsReferences: ['GLTS-APP-2026-790'],
    batchIds: [],
    totalApplications: 1,
    sourceInvoiceId: 'INV-001',
    lineItems: [
      lineItem({ id: 'li-seed-8', applicationId: 'GLTS-APP-2026-790', serviceType: 'Courier Charges', description: 'Credit adjustment — duplicate courier charge', quantity: 1, unitPrice: -500, gstApplicable: true, gstAmount: -90, amount: -590 }),
    ],
    taxConfig: { gstApplicable: true, gstPercentage: 18, tdsApplicable: false, tdsPercentage: 0 },
    totals: { subtotal: -500, gstTotal: -90, tdsAmount: 0, additionalCharges: 0, finalAmount: -590, advanceAvailable: 0, advanceAdjusted: 0, creditApplied: 0, balancePayable: 0 },
    invoiceStatus: 'submitted',
    paymentStatus: 'adjusted',
    invoiceDate: daysAgoDate(2),
    dueDate: daysFromNowDate(28),
    lastUpdated: daysAgo(2),
    createdAt: daysAgo(2),
    activities: [{ id: 'act-5', timestamp: daysAgo(2), actor: 'Finance Admin', action: 'Credit note created', detail: 'Partial adjustment against GLTS-INV-8821' }],
    attachments: [],
    payments: [],
  }),
  withAdjustment({
    id: 'INV-008',
    invoiceId: 'GLTS-INV-8828',
    invoiceType: 'bulk_invoice',
    billingMode: 'application_wise',
    companyId: 'CMP-1001',
    companyName: 'Apex Marine Logistics',
    billingEntity: 'Apex Marine Logistics Pvt Ltd',
    vesselId: 'GLTS-VSL-001',
    vesselName: 'MV Pacific Horizon',
    gltsReferences: [],
    batchIds: ['GLTS-BAT-2026-027'],
    totalApplications: 1,
    country: 'Australia',
    visaType: 'Crew · Maritime',
    lineItems: [
      lineItem({
        id: 'li-seed-9a',
        batchId: 'GLTS-BAT-2026-027',
        applicantName: 'Crew Member 1',
        serviceType: 'GLTS processing fees',
        description: 'UAE · Crew · Transit — GLTS processing fees',
        quantity: 1,
        unitPrice: 1200,
        gstApplicable: true,
        gstAmount: 216,
        amount: 1416,
        billingStatus: 'billed',
      }),
      lineItem({
        id: 'li-seed-9b',
        batchId: 'GLTS-BAT-2026-027',
        applicantName: 'Crew Member 2',
        serviceType: 'GLTS processing fees',
        description: 'UAE · Crew · Transit — GLTS processing fees',
        quantity: 1,
        unitPrice: 1200,
        gstApplicable: true,
        gstAmount: 216,
        amount: 1416,
        billingStatus: 'billed',
      }),
      lineItem({
        id: 'li-seed-9c',
        batchId: 'GLTS-BAT-2026-027',
        applicantName: 'Crew Member 3',
        serviceType: 'GLTS processing fees',
        description: 'UAE · Crew · Transit — GLTS processing fees',
        quantity: 1,
        unitPrice: 1200,
        gstApplicable: true,
        gstAmount: 216,
        amount: 1416,
        billingStatus: 'billed',
      }),
      lineItem({
        id: 'li-seed-9d',
        batchId: 'GLTS-BAT-2026-027',
        serviceType: 'Courier Charges',
        description: 'Batch dispatch — shared courier',
        quantity: 1,
        unitPrice: 500,
        gstApplicable: true,
        gstAmount: 90,
        amount: 590,
        billingStatus: 'billed',
      }),
    ],
    taxConfig: { gstApplicable: true, gstPercentage: 18, tdsApplicable: false, tdsPercentage: 0 },
    totals: {
      subtotal: 4100,
      gstTotal: 738,
      tdsAmount: 0,
      additionalCharges: 0,
      finalAmount: 4838,
      advanceAvailable: 5000,
      advanceAdjusted: 0,
      creditApplied: 0,
      balancePayable: 4838,
    },
    invoiceStatus: 'submitted',
    paymentStatus: 'pending',
    invoiceDate: daysAgoDate(7),
    dueDate: daysFromNowDate(23),
    paymentTerms: 'Net 30',
    lastUpdated: daysAgo(2),
    createdAt: daysAgo(7),
    activities: [
      {
        id: 'act-6',
        timestamp: daysAgo(7),
        actor: 'Finance Admin',
        action: 'Invoice submitted',
        detail: 'Bulk invoice GLTS-BAT-2026-027',
      },
    ],
    attachments: [{ id: 'att-2', name: 'GLTS-INV-8828.pdf', type: 'invoice_pdf', uploadedAt: daysAgo(7) }],
    payments: [],
  }),
  withAdjustment({
    id: 'INV-010',
    invoiceId: 'GLTS-INV-8830',
    invoiceType: 'final_settlement',
    billingMode: 'company_wise',
    companyId: 'CMP-1003',
    companyName: 'Global Corporate Travel Ltd',
    billingEntity: 'Global Corporate Travel Ltd',
    gltsReferences: ['GLTS-APP-2026-801'],
    batchIds: [],
    totalApplications: 1,
    country: 'UK',
    visaType: 'Business',
    lineItems: [
      lineItem({
        id: 'li-seed-11',
        applicationId: 'GLTS-APP-2026-801',
        serviceType: 'GLTS processing fees',
        description: 'Final settlement — UK Business GLTS processing fees',
        quantity: 1,
        unitPrice: 2200,
        gstApplicable: true,
        gstAmount: 396,
        amount: 2596,
        billingStatus: 'billed',
      }),
    ],
    taxConfig: { gstApplicable: true, gstPercentage: 18, tdsApplicable: false, tdsPercentage: 0 },
    totals: { subtotal: 2200, gstTotal: 396, tdsAmount: 0, additionalCharges: 0, finalAmount: 2596, advanceAvailable: 0, advanceAdjusted: 500, creditApplied: 0, balancePayable: 2096 },
    invoiceStatus: 'draft',
    paymentStatus: 'pending',
    invoiceDate: daysAgoDate(0),
    dueDate: daysFromNowDate(30),
    lastUpdated: daysAgo(0),
    createdAt: daysAgo(0),
    activities: [],
    attachments: [],
    payments: [],
  }),
]

/** Bump when seed line-item labels / categories change so browsers reload mocks. */
const STORAGE_KEY = 'glts:invoices:v6'

let memoryStore: Invoice[] | null = null

function mapLegacyBillingMode(value: string): BillingMode {
  if (value === 'company_wise' || value === 'application_wise') return value
  return 'application_wise'
}

function mapLegacyInvoiceType(value: string): InvoiceType {
  const map: Record<string, InvoiceType> = {
    single_application: 'single_invoice',
    batch: 'cumulative',
    service_wise: 'single_invoice',
    single_invoice: 'single_invoice',
    cumulative: 'cumulative',
    additional_expense: 'additional_expense',
    final_settlement: 'final_settlement',
    credit_note: 'credit_note',
    bulk_invoice: 'bulk_invoice',
    bulk: 'bulk_invoice',
  }
  return map[value] ?? 'single_invoice'
}

function mapLegacyStatus(value: string): InvoiceStatus {
  if (value === 'generated') return 'submitted'
  return value as InvoiceStatus
}

function normalizeInvoice(raw: Invoice): Invoice {
  const lineItems = (raw.lineItems ?? []).map(li =>
    lineItem({
      ...li,
      included: li.included ?? true,
      billingStatus: li.billingStatus ?? 'unbilled',
      isAdditionalExpense: li.isAdditionalExpense ?? false,
    }),
  )
  const taxConfig = raw.taxConfig ?? { gstApplicable: true, gstPercentage: 18, tdsApplicable: false, tdsPercentage: 0 }
  const baseTotals = computeInvoiceTotals(lineItems, taxConfig, raw.totals?.additionalCharges ?? 0)
  const adjustment = computeInvoiceBillingAdjustment(undefined, baseTotals.finalAmount)

  const gltsReferences = raw.gltsReferences ?? []
  const batchIds = raw.batchIds ?? []

  return {
    ...raw,
    billingMode: mapLegacyBillingMode(String(raw.billingMode)),
    invoiceType: mapLegacyInvoiceType(String(raw.invoiceType)),
    invoiceStatus: mapLegacyStatus(String(raw.invoiceStatus)),
    lineItems,
    taxConfig,
    totals: raw.totals?.balancePayable != null ? raw.totals : mergeTotalsWithAdjustment(baseTotals, adjustment),
    billingAdjustment: raw.billingAdjustment ?? adjustment.snapshot,
    activities: raw.activities ?? [],
    attachments: raw.attachments ?? [],
    payments: raw.payments ?? [],
    gltsReferences,
    batchIds,
    totalApplications: getInvoiceApplicationCount({ gltsReferences, batchIds }),
  }
}

function loadStore(): Invoice[] {
  if (memoryStore) return memoryStore
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      memoryStore = (JSON.parse(raw) as Invoice[]).map(normalizeInvoice)
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
  memoryStore = rows.map(normalizeInvoice)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memoryStore))
  } catch {
    /* ignore */
  }
}

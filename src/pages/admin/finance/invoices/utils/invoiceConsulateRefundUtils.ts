import { getMockInvoices } from '@/shared/data/mockInvoices'
import { operationalCaseHandlingService } from '@/shared/services/operationalCaseHandlingService'
import type {
  Invoice,
  InvoiceAppliedRefund,
  InvoiceRefundAppliedVia,
  InvoiceRefundBillingStatus,
} from '@/shared/types/invoice'
import type { LogisticsRefundDetails } from '@/shared/types/logisticsDispatch'
import type { OperationalCase } from '@/shared/types/operationalCaseHandling'
import { caseIdFromGoRefundPreset } from '@/shared/utils/invoiceConsulateRefundUtils'
import { roundMoney } from '@/shared/utils/invoiceCalculations'
import type { InvoiceConsulateRefundLine } from '../types/invoiceFeeComposition.types'

export {
  caseIdFromGoRefundPreset,
  goRefundLinePresetId,
  isGoRefundExpenseId,
  GO_REFUND_LINE_PREFIX,
} from '@/shared/utils/invoiceConsulateRefundUtils'

export interface InvoiceDetailRefundRow {
  id: string
  applicationId: string
  passengerName: string
  passportNumber: string
  vendorName: string
  amount: number
  remarks: string
  recordedAt?: string
  recordedBy?: string
  caseId: string
  operationalId: string
  status: InvoiceRefundBillingStatus
  appliedVia?: InvoiceRefundAppliedVia
  appliedDocumentId?: string
  appliedDocumentNumber?: string
  appliedAt?: string
}

function normalizeKey(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ')
}

/** Index of applied refunds across all invoices (latest apply wins). */
export function buildAppliedRefundIndex(
  invoices: Invoice[] = getMockInvoices(),
): Map<string, InvoiceAppliedRefund & { documentNumber?: string }> {
  const map = new Map<string, InvoiceAppliedRefund & { documentNumber?: string }>()
  for (const invoice of invoices) {
    for (const applied of invoice.appliedRefunds ?? []) {
      map.set(applied.caseId, {
        ...applied,
        documentNumber: applied.appliedDocumentNumber ?? invoice.invoiceId,
      })
    }
    // Fallback: line items tagged as GO refunds on submitted docs
    if (invoice.invoiceStatus === 'draft' || invoice.invoiceStatus === 'cancelled') continue
    for (const li of invoice.lineItems) {
      const caseId = caseIdFromGoRefundPreset(li.servicePresetId)
      if (!caseId || map.has(caseId)) continue
      map.set(caseId, {
        caseId,
        operationalId: '',
        applicationId: li.applicationId || li.batchId || '',
        passengerName: li.applicantName || '',
        vendorName: (li.description || li.serviceType).replace(/^Credit:\s*/i, ''),
        amount: Math.abs(li.unitPrice),
        appliedAt: invoice.lastUpdated,
        appliedVia: invoice.invoiceType === 'credit_note' ? 'credit_note' : 'modify',
        appliedDocumentId: invoice.id,
        appliedDocumentNumber: invoice.invoiceId,
        documentNumber: invoice.invoiceId,
      })
    }
  }
  return map
}

function toRefundRow(
  record: OperationalCase,
  refund: LogisticsRefundDetails,
  applied?: InvoiceAppliedRefund & { documentNumber?: string },
): InvoiceDetailRefundRow {
  return {
    id: `refund-${record.id}`,
    applicationId: record.applicationId,
    passengerName: record.passengerName,
    passportNumber: record.passportNumber,
    vendorName: refund.vendorName,
    amount: refund.amount,
    remarks: refund.remarks?.trim() || '',
    recordedAt: refund.recordedAt,
    recordedBy: refund.recordedBy,
    caseId: record.id,
    operationalId: record.operationalId,
    status: applied ? 'applied' : 'pending',
    appliedVia: applied?.appliedVia,
    appliedDocumentId: applied?.appliedDocumentId,
    appliedDocumentNumber: applied?.documentNumber ?? applied?.appliedDocumentNumber,
    appliedAt: applied?.appliedAt,
  }
}

function invoiceApplicationIds(invoice: Invoice): string[] {
  return [...new Set([...invoice.gltsReferences, ...invoice.batchIds].filter(Boolean))]
}

/** Consulate refunds from Tracking & Logistics for applications on this invoice. */
export function listInvoiceRefunds(invoice: Invoice): InvoiceDetailRefundRow[] {
  const appIds = invoiceApplicationIds(invoice)
  const appliedIndex = buildAppliedRefundIndex()
  const rows: InvoiceDetailRefundRow[] = []

  for (const applicationId of appIds) {
    const cases = operationalCaseHandlingService.listByApplicationId(applicationId)
    for (const record of cases) {
      const refund = record.refundDetails
      if (!refund || !Number.isFinite(refund.amount) || refund.amount <= 0) continue
      if (!refund.vendorId?.trim() && !refund.vendorName?.trim()) continue
      rows.push(toRefundRow(record, refund, appliedIndex.get(record.id)))
    }
  }

  return rows.sort((a, b) => {
    const aTs = a.recordedAt ? new Date(a.recordedAt).getTime() : 0
    const bTs = b.recordedAt ? new Date(b.recordedAt).getTime() : 0
    return bTs - aTs
  })
}

export function sumInvoiceRefunds(rows: InvoiceDetailRefundRow[]): number {
  return roundMoney(rows.reduce((sum, row) => sum + row.amount, 0))
}

export function sumPendingInvoiceRefunds(rows: InvoiceDetailRefundRow[]): number {
  return roundMoney(rows.filter(r => r.status === 'pending').reduce((sum, row) => sum + row.amount, 0))
}

export function listConsulateRefundsForApplication(
  applicationId: string,
  options?: {
    passengerName?: string
    passportNumber?: string
    /** Default include all pending; applied shown read-only. */
    includeApplied?: boolean
  },
): InvoiceConsulateRefundLine[] {
  const appliedIndex = buildAppliedRefundIndex()
  const includeApplied = options?.includeApplied !== false
  const passportKey = options?.passportNumber ? normalizeKey(options.passportNumber) : ''
  const nameKey = options?.passengerName ? normalizeKey(options.passengerName) : ''

  const cases = operationalCaseHandlingService.listByApplicationId(applicationId)
  const lines: InvoiceConsulateRefundLine[] = []

  for (const record of cases) {
    const refund = record.refundDetails
    if (!refund || !Number.isFinite(refund.amount) || refund.amount <= 0) continue
    if (!refund.vendorId?.trim() && !refund.vendorName?.trim()) continue

    if (passportKey || nameKey) {
      const casePassport = normalizeKey(record.passportNumber)
      const caseName = normalizeKey(record.passengerName)
      const passportMatch = passportKey && casePassport && casePassport === passportKey
      const nameMatch = nameKey && caseName && caseName === nameKey
      if (!passportMatch && !nameMatch) continue
    }

    const applied = appliedIndex.get(record.id)
    if (applied && !includeApplied) continue

    lines.push({
      id: `refund-${record.id}`,
      caseId: record.id,
      operationalId: record.operationalId,
      applicationId: record.applicationId,
      passengerName: record.passengerName,
      passportNumber: record.passportNumber,
      vendorName: refund.vendorName,
      amount: refund.amount,
      remarks: refund.remarks?.trim() || '',
      recordedAt: refund.recordedAt,
      recordedBy: refund.recordedBy,
      status: applied ? 'applied' : 'pending',
      included: !applied,
      appliedVia: applied?.appliedVia,
      appliedDocumentId: applied?.appliedDocumentId,
      appliedDocumentNumber: applied?.documentNumber ?? applied?.appliedDocumentNumber,
    })
  }

  return lines
}

export function collectIncludedRefundsFromComposition(
  lines: InvoiceConsulateRefundLine[],
): InvoiceConsulateRefundLine[] {
  return lines.filter(line => line.status === 'pending' && line.included && line.amount > 0)
}

export function sumIncludedConsulateRefunds(lines: InvoiceConsulateRefundLine[]): number {
  return roundMoney(
    collectIncludedRefundsFromComposition(lines).reduce((sum, line) => sum + line.amount, 0),
  )
}

export function appliedRefundsFromLines(
  lines: InvoiceConsulateRefundLine[],
  documentId: string,
  documentNumber: string,
  appliedVia: InvoiceRefundAppliedVia,
): InvoiceAppliedRefund[] {
  return collectIncludedRefundsFromComposition(lines).map(line => ({
    caseId: line.caseId,
    operationalId: line.operationalId,
    applicationId: line.applicationId,
    passengerName: line.passengerName,
    passportNumber: line.passportNumber,
    vendorName: line.vendorName,
    amount: line.amount,
    remarks: line.remarks,
    appliedAt: new Date().toISOString(),
    appliedVia,
    appliedDocumentId: documentId,
    appliedDocumentNumber: documentNumber,
  }))
}

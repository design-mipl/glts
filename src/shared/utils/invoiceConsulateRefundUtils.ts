import { operationalCaseHandlingService } from '@/shared/services/operationalCaseHandlingService'
import type {
  InvoiceAppliedRefund,
  InvoiceLineItem,
  InvoiceRefundAppliedVia,
} from '@/shared/types/invoice'

export const GO_REFUND_LINE_PREFIX = 'go-refund-'

export function goRefundLinePresetId(caseId: string): string {
  return `${GO_REFUND_LINE_PREFIX}${caseId}`
}

export function caseIdFromGoRefundPreset(servicePresetId?: string): string | undefined {
  if (!servicePresetId?.startsWith(GO_REFUND_LINE_PREFIX)) return undefined
  return servicePresetId.slice(GO_REFUND_LINE_PREFIX.length)
}

export function isGoRefundExpenseId(expenseRecordId?: string): boolean {
  if (!expenseRecordId) return false
  return (
    expenseRecordId.startsWith('aem-go-refund-') ||
    expenseRecordId.startsWith(GO_REFUND_LINE_PREFIX)
  )
}

/** Build applied-refund snapshots from composition line items tagged as GO refunds. */
export function extractAppliedRefundsFromLineItems(
  lineItems: InvoiceLineItem[],
  documentId: string,
  documentNumber: string,
  appliedVia: InvoiceRefundAppliedVia,
): InvoiceAppliedRefund[] {
  const appliedAt = new Date().toISOString()
  const byCase = new Map<string, InvoiceAppliedRefund>()

  for (const li of lineItems) {
    if (li.included === false) continue
    const caseId = caseIdFromGoRefundPreset(li.servicePresetId)
    if (!caseId || byCase.has(caseId)) continue
    const record = operationalCaseHandlingService.getById(caseId)
    const refund = record?.refundDetails
    byCase.set(caseId, {
      caseId,
      operationalId: record?.operationalId ?? '',
      applicationId: li.applicationId || li.batchId || record?.applicationId || '',
      passengerName: li.applicantName || record?.passengerName || '',
      passportNumber: record?.passportNumber,
      vendorName: refund?.vendorName || (li.description || li.serviceType).replace(/^Credit:\s*/i, ''),
      amount: Math.abs(li.unitPrice),
      remarks: li.remarks ?? refund?.remarks,
      appliedAt,
      appliedVia,
      appliedDocumentId: documentId,
      appliedDocumentNumber: documentNumber,
    })
  }

  return [...byCase.values()]
}

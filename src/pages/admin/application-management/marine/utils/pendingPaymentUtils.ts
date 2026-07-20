import type {
  FormAssistPaymentEntry,
  FormAssistSubmissionDraft,
  FormAssistVfsServiceChargeLine,
} from '@/shared/services/applicationFormAssistService'

export function getPaidServiceIds(entries: FormAssistPaymentEntry[]): Set<string> {
  const ids = new Set<string>()
  for (const entry of entries) {
    for (const id of entry.serviceIds) {
      if (id) ids.add(id)
    }
  }
  return ids
}

export function getRemainingVfsServices(
  catalog: FormAssistVfsServiceChargeLine[],
  entries: FormAssistPaymentEntry[],
): FormAssistVfsServiceChargeLine[] {
  const paid = getPaidServiceIds(entries)
  return catalog.filter(line => !paid.has(line.id))
}

/** Unpaid catalog lines plus services already on the entry being edited. */
export function getAvailableServicesForPaymentDraft(
  catalog: FormAssistVfsServiceChargeLine[],
  entries: FormAssistPaymentEntry[],
  editingEntryId?: string,
): FormAssistVfsServiceChargeLine[] {
  const paid = getPaidServiceIds(entries)
  if (editingEntryId) {
    const editingEntry = entries.find(entry => entry.id === editingEntryId)
    for (const id of editingEntry?.serviceIds ?? []) {
      paid.delete(id)
    }
  }
  return catalog.filter(line => !paid.has(line.id))
}

export function sumServiceAmounts(
  catalog: FormAssistVfsServiceChargeLine[],
  serviceIds: string[],
): number {
  const selected = new Set(serviceIds)
  return catalog
    .filter(line => selected.has(line.id))
    .reduce((sum, line) => sum + (Number(line.amount) || 0), 0)
}

export function resolvePaymentEntryServices(
  catalog: FormAssistVfsServiceChargeLine[],
  entry: FormAssistPaymentEntry,
): FormAssistVfsServiceChargeLine[] {
  const selected = new Set(entry.serviceIds)
  return catalog.filter(line => selected.has(line.id))
}

export function validatePaymentEntryDraft(input: {
  paidByUserId: string
  serviceIds: string[]
  paymentDate: string
  paymentMode: string
  paymentCardId: string
  paymentReferenceNumber: string
  amountPaid: string
  paymentReceiptFileName: string
  allowedServiceIds: Set<string>
}): string[] {
  const errors: string[] = []
  if (!input.paidByUserId.trim()) errors.push('Payment done by is required')
  if (input.serviceIds.length === 0) errors.push('Select at least one service')
  for (const id of input.serviceIds) {
    if (!input.allowedServiceIds.has(id)) {
      errors.push('One or more selected services are already paid')
      break
    }
  }
  if (!input.paymentDate.trim()) errors.push('Payment date is required')
  if (!input.paymentReferenceNumber.trim()) {
    errors.push('Payment Reference / CC Avenue Ref. No. is required')
  }
  if (!input.amountPaid.trim()) errors.push('Amount paid is required')
  if (input.paymentMode === 'card' && !input.paymentCardId.trim()) {
    errors.push('Payment card is required for card payments')
  }
  return errors
}

export function createEmptyPaymentEntryDraft(): Omit<
  FormAssistPaymentEntry,
  'id' | 'createdAt' | 'createdByUserId' | 'paidByUserName'
> & { paidByUserName: string } {
  return {
    paidByUserId: '',
    paidByUserName: '',
    serviceIds: [],
    paymentDate: '',
    paymentMode: 'card',
    paymentCardId: '',
    paymentReferenceNumber: '',
    amountPaid: '',
    receiptStatus: 'awaited',
    paymentRemarks: '',
    paymentReceiptFileName: '',
  }
}

export function paymentEntryToDraft(
  entry: FormAssistPaymentEntry,
): Omit<FormAssistPaymentEntry, 'id' | 'createdAt' | 'createdByUserId'> {
  return {
    paidByUserId: entry.paidByUserId,
    paidByUserName: entry.paidByUserName,
    serviceIds: [...entry.serviceIds],
    paymentDate: entry.paymentDate,
    paymentMode: entry.paymentMode,
    paymentCardId: entry.paymentCardId,
    paymentReferenceNumber: entry.paymentReferenceNumber,
    amountPaid: entry.amountPaid,
    receiptStatus: entry.receiptStatus,
    paymentRemarks: entry.paymentRemarks,
    paymentReceiptFileName: entry.paymentReceiptFileName,
  }
}

export function formatPaymentAmountInr(amount: number | string): string {
  const value = typeof amount === 'string' ? Number(amount) : amount
  if (!Number.isFinite(value)) return '—'
  return `₹${value.toLocaleString('en-IN')}`
}

export function syncLegacyPaymentFieldsFromEntries(
  submission: FormAssistSubmissionDraft,
): Pick<
  FormAssistSubmissionDraft,
  | 'paymentDate'
  | 'paymentMode'
  | 'paymentCardId'
  | 'paymentReferenceNumber'
  | 'amountPaid'
  | 'receiptStatus'
  | 'paymentRemarks'
  | 'paymentReceiptFileName'
> {
  const latest = submission.paymentEntries[submission.paymentEntries.length - 1]
  if (!latest) {
    return {
      paymentDate: '',
      paymentMode: 'card',
      paymentCardId: '',
      paymentReferenceNumber: '',
      amountPaid: '',
      receiptStatus: 'awaited',
      paymentRemarks: '',
      paymentReceiptFileName: '',
    }
  }
  return {
    paymentDate: latest.paymentDate,
    paymentMode: latest.paymentMode,
    paymentCardId: latest.paymentCardId,
    paymentReferenceNumber: latest.paymentReferenceNumber,
    amountPaid: latest.amountPaid,
    receiptStatus: latest.receiptStatus,
    paymentRemarks: latest.paymentRemarks,
    paymentReceiptFileName: latest.paymentReceiptFileName,
  }
}

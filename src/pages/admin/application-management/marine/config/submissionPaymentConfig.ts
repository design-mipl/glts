import type {
  FormAssistPaymentMode,
  FormAssistReceiptStatus,
} from '@/shared/services/applicationFormAssistService'

export const PAYMENT_MODE_OPTIONS: Array<{ value: FormAssistPaymentMode; label: string }> = [
  { value: 'card', label: 'Card' },
  { value: 'cash', label: 'Cash' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'upi', label: 'UPI' },
]

export const RECEIPT_STATUS_OPTIONS: Array<{ value: FormAssistReceiptStatus; label: string }> = [
  { value: 'awaited', label: 'Awaited' },
  { value: 'received', label: 'Received' },
  { value: 'not_applicable', label: 'Not Applicable' },
]

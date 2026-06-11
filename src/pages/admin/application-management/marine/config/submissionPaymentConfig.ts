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

export const CARD_NAME_OPTIONS = [
  { value: 'Visa', label: 'Visa' },
  { value: 'Mastercard', label: 'Mastercard' },
  { value: 'American Express', label: 'American Express' },
  { value: 'RuPay', label: 'RuPay' },
  { value: 'HDFC Bank', label: 'HDFC Bank' },
  { value: 'ICICI Bank', label: 'ICICI Bank' },
  { value: 'SBI Card', label: 'SBI Card' },
  { value: 'Axis Bank', label: 'Axis Bank' },
  { value: 'Other', label: 'Other' },
]

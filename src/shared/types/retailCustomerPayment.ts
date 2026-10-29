/** Snapshot of what the customer paid on the website retail journey (or admin-recorded later). */

export type RetailCustomerPaymentStatus = 'paid' | 'pending' | 'failed' | 'refunded'

export type RetailCustomerPaymentMethod = 'upi' | 'card' | 'netbanking' | 'wallet' | 'other'

export interface RetailCustomerPaymentLineItem {
  id: string
  label: string
  amount: number
  currency?: string
}

export interface RetailCustomerPaymentSnapshot {
  status: RetailCustomerPaymentStatus
  method?: RetailCustomerPaymentMethod
  methodLabel?: string
  /** ISO date or datetime when payment completed */
  paidAt?: string
  currency: string
  lineItems: RetailCustomerPaymentLineItem[]
  totalAmount: number
  referenceNumber?: string
  processingTierLabel?: string
  travellerCount?: number
  /** Optional notes for finance-only adjustments later */
  remarks?: string
}

export function formatRetailPaymentAmount(amount: number, currency = 'INR'): string {
  if (currency === 'INR') {
    return `₹${amount.toLocaleString('en-IN')}`
  }
  return `${currency} ${amount.toLocaleString('en-IN')}`
}

export function retailPaymentMethodLabel(method?: RetailCustomerPaymentMethod): string {
  switch (method) {
    case 'upi':
      return 'UPI'
    case 'card':
      return 'Card'
    case 'netbanking':
      return 'Net banking'
    case 'wallet':
      return 'Wallet'
    case 'other':
      return 'Other'
    default:
      return '—'
  }
}

export function retailPaymentStatusLabel(status: RetailCustomerPaymentStatus): string {
  switch (status) {
    case 'paid':
      return 'Paid'
    case 'pending':
      return 'Pending'
    case 'failed':
      return 'Failed'
    case 'refunded':
      return 'Refunded'
    default:
      return status
  }
}

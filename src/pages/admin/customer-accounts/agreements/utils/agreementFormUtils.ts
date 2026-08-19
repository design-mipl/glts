import { formatDisplayDate } from '@/shared/utils/formatDisplayDate'

export function formatAgreementDate(value?: string): string {
  return formatDisplayDate(value)
}

export const BILLING_DAY_OPTIONS = Array.from({ length: 31 }, (_, index) => {
  const day = index + 1
  return { value: String(day), label: String(day) }
})

export function formatBillingDay(day?: number): string {
  if (!day) return '—'
  return String(day)
}

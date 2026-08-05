import type { PaymentTerms, SettlementType } from '@/shared/types/vendor'

export const paymentTermsLabel: Record<PaymentTerms, string> = {
  immediate: 'Immediate',
  advance_payment: 'Advance Payment',
  '7_days': '7 Days',
  '15_days': '15 Days',
  '30_days': '30 Days',
  '45_days': '45 Days',
  '60_days': '60 Days',
  custom: 'Custom',
}

export const settlementTypeLabel: Record<SettlementType, string> = {
  per_application: 'Per Application',
  per_passenger: 'Per Passenger',
  per_service: 'Per Service',
  monthly_consolidated: 'Monthly Consolidated',
  on_invoice_basis: 'On Invoice Basis',
}

export const PAYMENT_TERMS_OPTIONS = (Object.keys(paymentTermsLabel) as PaymentTerms[]).map((value) => ({
  value,
  label: paymentTermsLabel[value],
}))

export const SETTLEMENT_TYPE_OPTIONS = (Object.keys(settlementTypeLabel) as SettlementType[]).map((value) => ({
  value,
  label: settlementTypeLabel[value],
}))

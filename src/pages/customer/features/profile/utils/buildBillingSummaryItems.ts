import type { BillingAgreementData, BillingSummary, BillingType } from '../types/accountWorkspace'

export interface BillingSummaryGridItem {
  label: string
  value: string
}

export function buildBillingSummaryItems(
  billingType: BillingType,
  summary: BillingSummary,
  billingConfig: BillingAgreementData['billingConfig'],
): BillingSummaryGridItem[] {
  if (billingType === 'credit' && billingConfig.billingType === 'credit') {
    return [
      { label: 'Credit period (days)', value: summary.creditPeriodDays },
      { label: 'Credit limit', value: summary.creditLimit },
      { label: 'Grace period (days)', value: summary.gracePeriodDays },
      { label: 'Credit used', value: billingConfig.credit.creditUsed },
      { label: 'Available credit', value: billingConfig.credit.availableCredit },
    ]
  }

  if (billingType === 'advance' && billingConfig.billingType === 'advance') {
    return [
      { label: 'Advance balance', value: billingConfig.advance.advanceBalance },
      { label: 'Advance utilized', value: billingConfig.advance.advanceUtilized },
      { label: 'Advance remaining', value: billingConfig.advance.advanceRemaining },
      { label: 'Advance rule', value: billingConfig.advance.advanceRule },
    ]
  }

  return [
    { label: 'Credit period (days)', value: summary.creditPeriodDays },
    { label: 'Credit limit', value: summary.creditLimit },
    { label: 'Grace period (days)', value: summary.gracePeriodDays },
  ]
}

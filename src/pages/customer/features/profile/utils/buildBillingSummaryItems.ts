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

  if (billingType === 'mixed' && billingConfig.billingType === 'mixed') {
    const { mixed } = billingConfig
    return [
      ...(summary.advancePercentage
        ? [{ label: 'Advance percentage', value: summary.advancePercentage }]
        : []),
      { label: 'Credit period (days)', value: summary.creditPeriodDays },
      { label: 'Credit limit', value: summary.creditLimit },
      { label: 'Grace period (days)', value: summary.gracePeriodDays },
      { label: 'Advance balance', value: mixed.advanceBalance },
      { label: 'Outstanding', value: mixed.outstanding },
      { label: 'Remaining credit', value: mixed.remainingCredit },
    ]
  }

  return [
    { label: 'Credit period (days)', value: summary.creditPeriodDays },
    { label: 'Credit limit', value: summary.creditLimit },
    { label: 'Grace period (days)', value: summary.gracePeriodDays },
  ]
}

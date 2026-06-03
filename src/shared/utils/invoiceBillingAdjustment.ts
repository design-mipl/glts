import type { CommercialAgreement } from '@/shared/types/commercialAgreement'
import type { InvoiceBillingAdjustmentSnapshot, InvoiceTotals } from '@/shared/types/invoice'
import { roundMoney } from '@/shared/utils/invoiceCalculations'

export interface BillingAdjustmentResult {
  totals: Pick<
    InvoiceTotals,
    'advanceAvailable' | 'advanceAdjusted' | 'creditApplied' | 'balancePayable'
  >
  snapshot: InvoiceBillingAdjustmentSnapshot
}

const MOCK_ADVANCE_BALANCE = 50000
const MOCK_CREDIT_USED = 120000

export function computeInvoiceBillingAdjustment(
  agreement: CommercialAgreement | undefined,
  invoiceTotal: number,
): BillingAdjustmentResult {
  const billingType = agreement?.billingType ?? 'credit'
  const config = agreement?.billingConfig
  const creditLimit = config?.creditLimit ?? 0
  const creditUsed = MOCK_CREDIT_USED
  const creditAvailable = Math.max(0, creditLimit - creditUsed)
  const advanceBalance = MOCK_ADVANCE_BALANCE

  if (billingType === 'advance') {
    const advanceAdjusted = roundMoney(Math.min(invoiceTotal, advanceBalance))
    const balancePayable = roundMoney(Math.max(0, invoiceTotal - advanceAdjusted))
    return {
      totals: {
        advanceAvailable: advanceBalance,
        advanceAdjusted,
        creditApplied: 0,
        balancePayable,
      },
      snapshot: {
        billingType: 'advance',
        advanceBalance,
        advanceUtilized: advanceAdjusted,
        remainingAdvance: roundMoney(advanceBalance - advanceAdjusted),
      },
    }
  }

  if (billingType === 'mixed') {
    const advanceAdjusted = roundMoney(Math.min(invoiceTotal, advanceBalance))
    const remainder = roundMoney(Math.max(0, invoiceTotal - advanceAdjusted))
    const creditApplied = remainder
    return {
      totals: {
        advanceAvailable: advanceBalance,
        advanceAdjusted,
        creditApplied,
        balancePayable: creditApplied,
      },
      snapshot: {
        billingType: 'mixed',
        advanceBalance,
        advanceUtilized: advanceAdjusted,
        remainingAdvance: roundMoney(advanceBalance - advanceAdjusted),
        creditPeriodDays: config?.creditPeriodDays,
        outstandingAmount: creditApplied,
      },
    }
  }

  const creditApplied = invoiceTotal
  return {
    totals: {
      advanceAvailable: 0,
      advanceAdjusted: 0,
      creditApplied,
      balancePayable: creditApplied,
    },
    snapshot: {
      billingType: 'credit',
      creditLimit,
      creditUsed,
      creditAvailable,
      creditPeriodDays: config?.creditPeriodDays ?? 30,
      outstandingAmount: creditApplied,
    },
  }
}

export function mergeTotalsWithAdjustment(
  baseTotals: Omit<
    InvoiceTotals,
    'advanceAvailable' | 'advanceAdjusted' | 'creditApplied' | 'balancePayable'
  >,
  adjustment: BillingAdjustmentResult,
): InvoiceTotals {
  return { ...baseTotals, ...adjustment.totals }
}

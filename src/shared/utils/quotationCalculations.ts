import type { AgreementPricingRow } from '@/shared/types/commercialAgreement'
import type { QuotationFormData, QuotationPricingTotals } from '@/shared/types/quotation'
import {
  collectQuotationFeeLines,
  computeFeeLineTotals,
} from '@/shared/utils/quotationPricingUtils'
import { roundMoney } from '@/shared/utils/invoiceCalculations'

/** Legacy matrix-only totals (compat for agreement conversion flatten). */
export function computePricingTotals(
  pricingMatrix: AgreementPricingRow[],
  gstPercentage: number,
): QuotationPricingTotals {
  const subtotal = roundMoney(pricingMatrix.reduce((sum, row) => sum + row.serviceFee, 0))
  const gstAmount = roundMoney(
    pricingMatrix.reduce((sum, row) => {
      if (!row.gstApplicable) return sum
      return sum + (row.serviceFee * gstPercentage) / 100
    }, 0),
  )
  return { subtotal, gstAmount, grandTotal: roundMoney(subtotal + gstAmount) }
}

export function computeQuotationFormTotals(
  data: Pick<
    QuotationFormData,
    'workflowType' | 'retailVisaPricing' | 'commercialVisaPricing' | 'miscellaneousServices' | 'gstPercentage'
  >,
): QuotationPricingTotals {
  const lines = collectQuotationFeeLines(data)
  return computeFeeLineTotals(lines, data.gstPercentage)
}

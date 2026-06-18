import type { AgreementPricingRow } from '@/shared/types/commercialAgreement'
import type { QuotationPricingTotals } from '@/shared/types/quotation'
import { roundMoney } from '@/shared/utils/invoiceCalculations'

export function computePricingTotals(
  pricingMatrix: AgreementPricingRow[],
  gstPercentage: number,
): QuotationPricingTotals {
  const subtotal = roundMoney(
    pricingMatrix.reduce((sum, row) => sum + row.serviceFee, 0),
  )
  const gstAmount = roundMoney(
    pricingMatrix.reduce((sum, row) => {
      if (!row.gstApplicable) return sum
      return sum + (row.serviceFee * gstPercentage) / 100
    }, 0),
  )
  const grandTotal = roundMoney(subtotal + gstAmount)
  return { subtotal, gstAmount, grandTotal }
}

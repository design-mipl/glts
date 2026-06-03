import type { InvoiceLineItem, InvoiceTaxConfig, InvoiceTotals } from '@/shared/types/invoice'

export function calculateLineItemAmount(
  quantity: number,
  unitPrice: number,
  gstApplicable: boolean,
  gstPercentage: number,
): { gstAmount: number; amount: number } {
  const base = quantity * unitPrice
  const gstAmount = gstApplicable ? (base * gstPercentage) / 100 : 0
  return { gstAmount: roundMoney(gstAmount), amount: roundMoney(base + gstAmount) }
}

export function recalculateLineItem(
  item: InvoiceLineItem,
  gstPercentage: number,
): InvoiceLineItem {
  const { gstAmount, amount } = calculateLineItemAmount(
    item.quantity,
    item.unitPrice,
    item.gstApplicable,
    gstPercentage,
  )
  return { ...item, gstAmount, amount }
}

export function recalculateLineItems(
  items: InvoiceLineItem[],
  taxConfig: InvoiceTaxConfig,
): InvoiceLineItem[] {
  return items.map(item => recalculateLineItem(item, taxConfig.gstPercentage))
}

export function includedLineItems(items: InvoiceLineItem[]): InvoiceLineItem[] {
  return items.filter(item => item.included !== false)
}

export function computeInvoiceTotals(
  lineItems: InvoiceLineItem[],
  taxConfig: InvoiceTaxConfig,
  additionalCharges = 0,
): Omit<InvoiceTotals, 'advanceAvailable' | 'advanceAdjusted' | 'creditApplied' | 'balancePayable'> {
  const active = includedLineItems(lineItems)
  const subtotal = roundMoney(active.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0))
  const gstTotal = roundMoney(active.reduce((sum, item) => sum + item.gstAmount, 0))
  const beforeTds = subtotal + gstTotal + additionalCharges
  const tdsAmount = taxConfig.tdsApplicable
    ? roundMoney((beforeTds * taxConfig.tdsPercentage) / 100)
    : 0
  const finalAmount = roundMoney(beforeTds - tdsAmount)
  return { subtotal, gstTotal, tdsAmount, additionalCharges, finalAmount }
}

export function roundMoney(value: number): number {
  return Math.round(value * 100) / 100
}

export function formatInr(amount: number): string {
  return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
}

export function defaultLineItemFields(): Pick<
  InvoiceLineItem,
  'included' | 'billingStatus' | 'isAdditionalExpense' | 'remarks'
> {
  return {
    included: true,
    billingStatus: 'unbilled',
    isAdditionalExpense: false,
    remarks: '',
  }
}

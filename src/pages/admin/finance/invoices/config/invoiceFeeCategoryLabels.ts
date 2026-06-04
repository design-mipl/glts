/** Single source of truth — fee editor sections, invoice summary, and line items. */
export const INVOICE_COMPOSITION_FEE_LABELS = {
  processingCharges: {
    section: 'Processing Charges',
    summaryTotal: 'Processing Charges Total',
    serviceType: 'Processing Charges',
  },
  visaFees: {
    section: 'Visa Fees',
    summaryTotal: 'Visa Fees Total',
    serviceType: 'Visa Fees',
  },
  courierFees: {
    section: 'Courier fees',
    addRow: 'Add courier fee',
    tableTypeColumn: 'Courier fee type',
    summaryTotal: 'Courier fees total',
    serviceType: 'Courier fees',
    customOption: 'Custom courier fee',
  },
  miscellaneousFees: {
    section: 'Miscellaneous Fees',
    addRow: 'Add miscellaneous expense',
    summaryTotal: 'Miscellaneous Fees Total',
    serviceType: 'Miscellaneous Fees',
    customOption: 'Custom expense',
  },
} as const

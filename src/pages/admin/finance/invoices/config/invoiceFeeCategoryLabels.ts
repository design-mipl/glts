/** Labels for invoice composition billable-services UI and summary. */
export const INVOICE_COMPOSITION_FEE_LABELS = {
  billableServices: {
    section: 'Billable services',
    summaryTotal: 'Services total',
    empty: 'No client-billable services for this passenger.',
    serviceColumn: 'Service',
    amountColumn: 'Amount',
    creditAmountColumn: 'Credit amount',
    updatedAmountColumn: 'Updated amount',
    selectColumn: '',
    gstColumn: 'GST',
    remarkColumn: 'Remark',
    actionsColumn: 'Actions',
    addService: 'Add miscellaneous',
    addVfsService: 'Add VFS',
    noAgreementServices: 'No more miscellaneous agreement services available to add.',
    noVfsServices: 'No more VFS services available for this country.',
    deleteService: 'Remove service',
    selectMiscPlaceholder: 'Select miscellaneous service',
    selectVfsPlaceholder: 'Select VFS service',
    /** Always billed from agreement by country / customer. */
    categoryGlts: 'Processing visa fees — GLTS processing fees',
    /** Only when selected on the case / expenses. */
    categoryMisc: 'Miscellaneous services & dispatch fees',
    /** Only when selected (country master VFS rates / expenses). */
    categoryVfs: 'VFS services',
  },
} as const

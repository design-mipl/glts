export const invoiceCompositionAccordionSx = {
  border: '1px solid',
  borderColor: 'divider',
  borderRadius: '10px !important',
  '&:before': { display: 'none' },
  bgcolor: 'background.paper',
  overflow: 'hidden',
} as const

/** Chevron aligned to top of summary (with content), not vertically centered. */
export const invoiceCompositionAccordionSummarySx = {
  minHeight: 52,
  px: { xs: 1.5, sm: 2 },
  alignItems: 'flex-start',
  '& .MuiAccordionSummary-content': {
    alignItems: 'flex-start',
    my: 1.25,
    marginRight: 1,
  },
  '& .MuiAccordionSummary-expandIconWrapper': {
    alignSelf: 'flex-start',
    pt: 1.5,
    mr: 0.5,
  },
} as const

export const invoiceCompositionAccordionDetailsSx = {
  px: { xs: 1.5, sm: 2 },
  pt: 0,
  pb: 2,
  borderTop: '1px solid',
  borderColor: 'divider',
} as const

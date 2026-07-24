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
    mr: 1,
    flex: '1 1 auto',
    minWidth: 0,
    // Prevent content from covering the expand icon hit target.
    maxWidth: 'calc(100% - 40px)',
  },
  '& .MuiAccordionSummary-expandIconWrapper': {
    alignSelf: 'flex-start',
    flexShrink: 0,
    position: 'relative',
    zIndex: 1,
    mt: 0.75,
    ml: 0.5,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
  },
} as const

export const invoiceCompositionAccordionDetailsSx = {
  px: { xs: 1.25, sm: 1.5 },
  pt: 1,
  pb: 1.25,
  borderTop: '1px solid',
  borderColor: 'divider',
} as const

/** Nested passenger rows inside a bulk application accordion. */
export const invoiceCompositionNestedAccordionSx = {
  border: '1px solid',
  borderColor: 'divider',
  borderRadius: '8px !important',
  '&:before': { display: 'none' },
  bgcolor: 'background.default',
  overflow: 'hidden',
  boxShadow: 'none',
} as const

export const invoiceCompositionNestedAccordionSummarySx = {
  minHeight: 44,
  px: { xs: 1.25, sm: 1.5 },
  alignItems: 'center',
  '& .MuiAccordionSummary-content': {
    alignItems: 'center',
    my: 0.75,
    mr: 1,
    flex: '1 1 auto',
    minWidth: 0,
    maxWidth: 'calc(100% - 36px)',
  },
  '& .MuiAccordionSummary-expandIconWrapper': {
    alignSelf: 'center',
    flexShrink: 0,
    position: 'relative',
    zIndex: 1,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
  },
} as const

export const invoiceCompositionNestedAccordionDetailsSx = {
  px: { xs: 1.25, sm: 1.5 },
  pt: 1.25,
  pb: 1.5,
  borderTop: '1px solid',
  borderColor: 'divider',
  bgcolor: 'background.paper',
} as const

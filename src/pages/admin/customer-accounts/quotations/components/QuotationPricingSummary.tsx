import { Box, Stack, Typography } from '@mui/material'
import type { QuotationPricingTotals } from '@/shared/types/quotation'
import { formatInr } from '@/shared/utils/invoiceCalculations'

interface QuotationPricingSummaryProps {
  totals: QuotationPricingTotals
  gstPercentage: number
}

export function QuotationPricingSummary({ totals, gstPercentage }: QuotationPricingSummaryProps) {
  return (
    <Box
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
        p: 2,
        bgcolor: 'background.paper',
        maxWidth: 360,
        ml: 'auto',
      }}
    >
      <Stack spacing={1}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" color="text.secondary">
            Subtotal
          </Typography>
          <Typography variant="body2">{formatInr(totals.subtotal)}</Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" color="text.secondary">
            GST ({gstPercentage}%)
          </Typography>
          <Typography variant="body2">{formatInr(totals.gstAmount)}</Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between" sx={{ pt: 0.5, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="subtitle2" fontWeight={700}>
            Grand Total
          </Typography>
          <Typography variant="subtitle2" fontWeight={700}>
            {formatInr(totals.grandTotal)}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  )
}

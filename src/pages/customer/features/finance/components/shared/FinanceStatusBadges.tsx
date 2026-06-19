import { Stack } from '@mui/material'
import { Badge } from '@/design-system/UIComponents'
import type { Invoice } from '@/shared/types/invoice'
import {
  invoiceStatusBadgeColor,
  invoiceStatusLabel,
  paymentStatusBadgeColor,
  paymentStatusLabel,
} from '@/pages/admin/finance/invoices/config/invoiceStatusConfig'

interface FinanceStatusBadgesProps {
  invoice: Invoice
}

export function FinanceStatusBadges({ invoice }: FinanceStatusBadgesProps) {
  return (
    <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
      <Badge
        label={invoiceStatusLabel[invoice.invoiceStatus]}
        color={invoiceStatusBadgeColor(invoice.invoiceStatus)}
        size="sm"
      />
      <Badge
        label={paymentStatusLabel[invoice.paymentStatus]}
        color={paymentStatusBadgeColor(invoice.paymentStatus)}
        size="sm"
      />
    </Stack>
  )
}

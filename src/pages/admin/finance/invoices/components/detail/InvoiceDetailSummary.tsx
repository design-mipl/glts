import { Grid, Stack, Typography } from '@mui/material'
import { Badge, BaseCard, Button } from '@/design-system/UIComponents'
import type { Invoice } from '@/shared/types/invoice'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import {
  billingModeLabel,
  invoiceStatusBadgeColor,
  invoiceStatusLabel,
  invoiceTypeColor,
  invoiceTypeLabel,
  paymentStatusBadgeColor,
  paymentStatusLabel,
} from '../../config/invoiceStatusConfig'

interface InvoiceDetailSummaryProps {
  invoice: Invoice
  onShare: () => void
  onDownload: () => void
  onCreditNote: () => void
  onCancel: () => void
}

export function InvoiceDetailSummary({
  invoice,
  onShare,
  onDownload,
  onCreditNote,
  onCancel,
}: InvoiceDetailSummaryProps) {
  return (
    <BaseCard>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', md: 'flex-start' }}
        spacing={2}
        sx={{ p: 2.5 }}
      >
        <Stack spacing={1.25} sx={{ minWidth: 0 }}>
          <Typography variant="h6" fontWeight={700}>
            {invoice.invoiceId}
          </Typography>
          <Grid container spacing={1.5}>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Typography variant="caption" color="text.secondary">
                Company
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {invoice.companyName}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Typography variant="caption" color="text.secondary">
                Billing entity
              </Typography>
              <Typography variant="body2">{invoice.billingEntity}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Typography variant="caption" color="text.secondary">
                Billing mode
              </Typography>
              <Typography variant="body2">{billingModeLabel[invoice.billingMode]}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Typography variant="caption" color="text.secondary">
                Invoice date
              </Typography>
              <Typography variant="body2">{invoice.invoiceDate}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Typography variant="caption" color="text.secondary">
                Due date
              </Typography>
              <Typography variant="body2">{invoice.dueDate}</Typography>
            </Grid>
          </Grid>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Badge label={invoiceTypeLabel[invoice.invoiceType]} color={invoiceTypeColor[invoice.invoiceType]} size="sm" />
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
          <Typography variant="caption" color="text.secondary">
            Invoice amount {formatInr(invoice.totals.finalAmount)} · Balance payable{' '}
            {formatInr(invoice.totals.balancePayable)}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {invoice.invoiceStatus !== 'cancelled' && invoice.invoiceStatus !== 'draft' ? (
            <>
              <Button label="Share" variant="outlined" onClick={onShare} />
              <Button label="Download PDF" variant="outlined" onClick={onDownload} />
            </>
          ) : null}
          {invoice.invoiceType !== 'credit_note' && invoice.invoiceStatus !== 'cancelled' ? (
            <Button label="Credit note" variant="outlined" onClick={onCreditNote} />
          ) : null}
          {invoice.invoiceStatus !== 'cancelled' && invoice.invoiceStatus !== 'paid' ? (
            <Button label="Cancel" variant="outlined" color="error" onClick={onCancel} />
          ) : null}
        </Stack>
      </Stack>
    </BaseCard>
  )
}

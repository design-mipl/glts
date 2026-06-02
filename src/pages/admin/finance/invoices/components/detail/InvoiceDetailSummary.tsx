import { Stack, Typography } from '@mui/material'
import { Download, FileMinus2, Send, XCircle } from 'lucide-react'
import { Badge, Button } from '@/design-system/UIComponents'
import type { Invoice } from '@/shared/types/invoice'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import {
  invoiceStatusBadgeColor,
  invoiceStatusLabel,
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
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      justifyContent="space-between"
      alignItems={{ xs: 'stretch', md: 'flex-start' }}
      spacing={2}
      sx={{
        p: 2.5,
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
        bgcolor: 'background.paper',
      }}
    >
      <Stack spacing={1} sx={{ minWidth: 0 }}>
        <Typography variant="h6" fontWeight={700}>
          {invoice.invoiceId}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {invoice.companyName} · {invoice.billingEntity}
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Badge label={invoiceTypeLabel[invoice.invoiceType]} color="info" size="sm" />
          <Badge label={invoiceStatusLabel[invoice.invoiceStatus]} color={invoiceStatusBadgeColor(invoice.invoiceStatus)} size="sm" />
          <Badge label={paymentStatusLabel[invoice.paymentStatus]} color={paymentStatusBadgeColor(invoice.paymentStatus)} size="sm" />
        </Stack>
        <Typography variant="caption" color="text.secondary">
          Invoice date {invoice.invoiceDate} · Due {invoice.dueDate} · {formatInr(invoice.totals.finalAmount)}
        </Typography>
      </Stack>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        {invoice.invoiceStatus !== 'cancelled' && invoice.invoiceStatus !== 'draft' ? (
          <>
            <Button label="Share" variant="outlined" startIcon={<Send size={14} />} onClick={onShare} />
            <Button label="Download PDF" variant="outlined" startIcon={<Download size={14} />} onClick={onDownload} />
          </>
        ) : null}
        {invoice.invoiceType !== 'credit_note' && invoice.invoiceStatus !== 'cancelled' ? (
          <Button label="Credit note" variant="outlined" startIcon={<FileMinus2 size={14} />} onClick={onCreditNote} />
        ) : null}
        {invoice.invoiceStatus !== 'cancelled' && invoice.invoiceStatus !== 'paid' ? (
          <Button label="Cancel" variant="outlined" color="error" startIcon={<XCircle size={14} />} onClick={onCancel} />
        ) : null}
      </Stack>
    </Stack>
  )
}

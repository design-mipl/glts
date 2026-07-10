import { Box, Divider, Grid, Stack, Typography } from '@mui/material'
import { Ban, Download, FileMinus2, Share2 } from 'lucide-react'
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
      <Box sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            justifyContent="space-between"
            spacing={2}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {invoice.invoiceId}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {invoice.companyName} · {invoice.billingEntity} ·{' '}
                {billingModeLabel[invoice.billingMode]}
              </Typography>
            </Box>
            <Stack
              direction="row"
              spacing={0.75}
              useFlexGap
              sx={{ flexWrap: 'wrap', alignItems: 'center', alignSelf: { xs: 'stretch', md: 'flex-start' } }}
            >
              {invoice.invoiceStatus !== 'cancelled' && invoice.invoiceStatus !== 'draft' ? (
                <>
                  <Button
                    label="Share"
                    size="sm"
                    variant="neutral"
                    startIcon={<Share2 size={14} />}
                    onClick={onShare}
                  />
                  <Button
                    label="Download PDF"
                    size="sm"
                    variant="neutral"
                    startIcon={<Download size={14} />}
                    onClick={onDownload}
                  />
                </>
              ) : null}
              {invoice.invoiceType !== 'credit_note' && invoice.invoiceStatus !== 'cancelled' ? (
                <Button
                  label="Credit note"
                  size="sm"
                  variant="neutral"
                  startIcon={<FileMinus2 size={14} />}
                  onClick={onCreditNote}
                />
              ) : null}
              {invoice.invoiceStatus !== 'cancelled' && invoice.invoiceStatus !== 'paid' ? (
                <Button
                  label="Cancel"
                  size="sm"
                  variant="outlined"
                  color="error"
                  startIcon={<Ban size={14} />}
                  onClick={onCancel}
                />
              ) : null}
            </Stack>
          </Stack>

          <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap', alignItems: 'center' }}>
            <Badge
              label={invoiceTypeLabel[invoice.invoiceType]}
              color={invoiceTypeColor[invoice.invoiceType]}
              size="sm"
            />
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

          <Divider />

          <Grid container spacing={2}>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Typography variant="caption" color="text.secondary" display="block">
                Invoice amount
              </Typography>
              <Typography variant="body1" fontWeight={700}>
                {formatInr(invoice.totals.finalAmount)}
              </Typography>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Typography variant="caption" color="text.secondary" display="block">
                Balance payable
              </Typography>
              <Typography variant="body1" fontWeight={700}>
                {formatInr(invoice.totals.balancePayable)}
              </Typography>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Typography variant="caption" color="text.secondary" display="block">
                Invoice date
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {invoice.invoiceDate}
              </Typography>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Typography variant="caption" color="text.secondary" display="block">
                Due date
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {invoice.dueDate}
              </Typography>
            </Grid>
          </Grid>
        </Stack>
      </Box>
    </BaseCard>
  )
}

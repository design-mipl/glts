import { Download, Eye, FileText } from 'lucide-react'
import { Box, Grid, Stack, Typography, alpha, useTheme } from '@mui/material'
import type { ReactNode } from 'react'
import { Badge, IconButton, Modal, useToast } from '@/design-system/UIComponents'
import type { VendorBillingBill } from '@/shared/types/vendorBilling'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import { getVendorBillDisplayStatus } from '../../config/vendorBillingStatusConfig'

interface VendorBillDetailModalProps {
  open: boolean
  bill?: VendorBillingBill
  onClose: () => void
}

function Field({
  label,
  value,
  fullWidth = false,
}: {
  label: string
  value: ReactNode
  fullWidth?: boolean
}) {
  return (
    <Grid size={{ xs: 12, sm: fullWidth ? 12 : 6 }}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      {typeof value === 'string' ? (
        <Typography variant="body2" fontWeight={600}>
          {value}
        </Typography>
      ) : (
        <Box sx={{ mt: 0.25 }}>{value}</Box>
      )}
    </Grid>
  )
}

function InvoiceFileTag({
  fileName,
  onView,
  onDownload,
}: {
  fileName: string
  onView: () => void
  onDownload: () => void
}) {
  const theme = useTheme()

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.75,
        maxWidth: '100%',
        height: 30,
        pl: 1,
        pr: 0.25,
        borderRadius: '8px',
        border: '1px solid',
        borderColor: alpha(theme.palette.text.primary, 0.12),
        bgcolor: alpha(theme.palette.text.primary, 0.04),
        color: 'text.primary',
      }}
    >
      <FileText size={14} strokeWidth={2} />
      <Typography variant="caption" fontWeight={600} noWrap sx={{ minWidth: 0, maxWidth: 220 }}>
        {fileName}
      </Typography>
      <Stack direction="row" spacing={0} alignItems="center" sx={{ flexShrink: 0 }}>
        <IconButton size="sm" icon={<Eye size={14} />} tooltip="View invoice" onClick={onView} />
        <IconButton size="sm" icon={<Download size={14} />} tooltip="Download invoice" onClick={onDownload} />
      </Stack>
    </Box>
  )
}

export function VendorBillDetailModal({ open, bill, onClose }: VendorBillDetailModalProps) {
  const { showToast } = useToast()
  if (!bill) return null

  const display = getVendorBillDisplayStatus(bill)
  const balance = Math.max(0, bill.invoiceAmount - bill.paidAmount)

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Vendor bill · ${bill.vendorInvoiceNumber}`}
      subtitle="Review vendor bill details and payment status."
      headerExtra={<Badge label={display.label} color={display.color} size="sm" />}
      headerExtraInline
      size="md"
    >
      <Stack spacing={2}>
        <Grid container spacing={2}>
          <Field label="Vendor invoice number" value={bill.vendorInvoiceNumber} />
          <Field label="Invoice date" value={new Date(bill.invoiceDate).toLocaleDateString()} />
          <Field label="Due date" value={new Date(bill.dueDate).toLocaleDateString()} />
          <Field label="Invoice amount" value={formatInr(bill.invoiceAmount)} />
          <Field label="Paid amount" value={formatInr(bill.paidAmount)} />
          <Field label="Balance due" value={formatInr(balance)} />
          {bill.invoiceFileName ? (
            <Field
              label="Invoice file"
              fullWidth
              value={
                <InvoiceFileTag
                  fileName={bill.invoiceFileName}
                  onView={() =>
                    showToast({
                      title: 'View invoice',
                      description: bill.invoiceFileName,
                      variant: 'info',
                    })
                  }
                  onDownload={() =>
                    showToast({
                      title: 'Download started',
                      description: bill.invoiceFileName,
                      variant: 'success',
                    })
                  }
                />
              }
            />
          ) : null}
        </Grid>
        {bill.remarks ? (
          <Stack spacing={0.5}>
            <Typography variant="caption" color="text.secondary">
              Remarks
            </Typography>
            <Typography variant="body2">{bill.remarks}</Typography>
          </Stack>
        ) : null}
      </Stack>
    </Modal>
  )
}

import {
  Box,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { ActivityFeed, FileUpload } from '@/design-system/UIComponents'
import type { Invoice } from '@/shared/types/invoice'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import { agreementEmbeddedTableHeadCellSx, agreementEmbeddedTableSx } from '@/pages/admin/customer-accounts/agreements/components/agreementFormLayout'
import { paymentStatusLabel } from '../../config/invoiceStatusConfig'

interface InvoiceDetailTabsProps {
  invoice: Invoice
  activeTab: string
}

function OverviewTab({ invoice }: { invoice: Invoice }) {
  return (
    <Stack spacing={2}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="caption" color="text.secondary">
            Company
          </Typography>
          <Typography variant="body2" fontWeight={600}>
            {invoice.companyName}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="caption" color="text.secondary">
            Billing entity
          </Typography>
          <Typography variant="body2">{invoice.billingEntity}</Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="caption" color="text.secondary">
            Vessel
          </Typography>
          <Typography variant="body2">{invoice.vesselName ?? '—'}</Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="caption" color="text.secondary">
            GLTS references
          </Typography>
          <Typography variant="body2">{invoice.gltsReferences.join(', ') || '—'}</Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="caption" color="text.secondary">
            Batch IDs
          </Typography>
          <Typography variant="body2">{invoice.batchIds.join(', ') || '—'}</Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="caption" color="text.secondary">
            Payment terms
          </Typography>
          <Typography variant="body2">{invoice.paymentTerms ?? '—'}</Typography>
        </Grid>
      </Grid>
    </Stack>
  )
}

function LineItemsTab({ invoice }: { invoice: Invoice }) {
  return (
    <Box sx={agreementEmbeddedTableSx}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={agreementEmbeddedTableHeadCellSx}>Application</TableCell>
            <TableCell sx={agreementEmbeddedTableHeadCellSx}>Batch</TableCell>
            <TableCell sx={agreementEmbeddedTableHeadCellSx}>Service</TableCell>
            <TableCell sx={agreementEmbeddedTableHeadCellSx}>Description</TableCell>
            <TableCell sx={agreementEmbeddedTableHeadCellSx}>Qty</TableCell>
            <TableCell sx={agreementEmbeddedTableHeadCellSx}>Unit</TableCell>
            <TableCell sx={agreementEmbeddedTableHeadCellSx}>Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {invoice.lineItems.map(li => (
            <TableRow key={li.id}>
              <TableCell sx={{ fontSize: 13 }}>{li.applicationId ?? '—'}</TableCell>
              <TableCell sx={{ fontSize: 13 }}>{li.batchId ?? '—'}</TableCell>
              <TableCell sx={{ fontSize: 13 }}>{li.serviceType}</TableCell>
              <TableCell sx={{ fontSize: 13 }}>{li.description}</TableCell>
              <TableCell sx={{ fontSize: 13 }}>{li.quantity}</TableCell>
              <TableCell sx={{ fontSize: 13 }}>{formatInr(li.unitPrice)}</TableCell>
              <TableCell sx={{ fontSize: 13 }}>{formatInr(li.amount)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  )
}

function AdvanceCreditTab({ invoice }: { invoice: Invoice }) {
  const { totals, billingAdjustment } = invoice
  if (!billingAdjustment) {
    return (
      <Typography variant="body2" color="text.secondary">
        No advance or credit adjustment snapshot recorded for this invoice.
      </Typography>
    )
  }

  return (
    <Stack spacing={1.5}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="body2">Billing type</Typography>
        <Typography variant="body2" fontWeight={600} sx={{ textTransform: 'capitalize' }}>
          {billingAdjustment.billingType}
        </Typography>
      </Stack>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="body2">Invoice total</Typography>
        <Typography variant="body2">{formatInr(totals.finalAmount)}</Typography>
      </Stack>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="body2">Advance available</Typography>
        <Typography variant="body2">{formatInr(totals.advanceAvailable)}</Typography>
      </Stack>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="body2">Advance adjusted</Typography>
        <Typography variant="body2">{formatInr(totals.advanceAdjusted)}</Typography>
      </Stack>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="body2">Credit applied</Typography>
        <Typography variant="body2">{formatInr(totals.creditApplied)}</Typography>
      </Stack>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="body2" fontWeight={700}>
          Balance payable
        </Typography>
        <Typography variant="body2" fontWeight={700}>
          {formatInr(totals.balancePayable)}
        </Typography>
      </Stack>
      {billingAdjustment.billingType === 'credit' || billingAdjustment.billingType === 'mixed' ? (
        <>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2">Credit limit</Typography>
            <Typography variant="body2">{formatInr(billingAdjustment.creditLimit ?? 0)}</Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2">Credit used</Typography>
            <Typography variant="body2">{formatInr(billingAdjustment.creditUsed ?? 0)}</Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2">Available credit</Typography>
            <Typography variant="body2">{formatInr(billingAdjustment.creditAvailable ?? 0)}</Typography>
          </Stack>
        </>
      ) : null}
    </Stack>
  )
}

function TaxBreakdownTab({ invoice }: { invoice: Invoice }) {
  const { totals, taxConfig } = invoice
  return (
    <Stack spacing={1.5}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="body2">Subtotal</Typography>
        <Typography variant="body2">{formatInr(totals.subtotal)}</Typography>
      </Stack>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="body2">GST ({taxConfig.gstPercentage}%)</Typography>
        <Typography variant="body2">{formatInr(totals.gstTotal)}</Typography>
      </Stack>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="body2">TDS ({taxConfig.tdsPercentage}%)</Typography>
        <Typography variant="body2">{formatInr(-totals.tdsAmount)}</Typography>
      </Stack>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="body2">Additional charges</Typography>
        <Typography variant="body2">{formatInr(totals.additionalCharges)}</Typography>
      </Stack>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="body2" fontWeight={700}>
          Final amount
        </Typography>
        <Typography variant="body2" fontWeight={700}>
          {formatInr(totals.finalAmount)}
        </Typography>
      </Stack>
    </Stack>
  )
}

function AttachmentsTab({ invoice }: { invoice: Invoice }) {
  return (
    <Stack spacing={2}>
      {invoice.attachments.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No attachments yet.
        </Typography>
      ) : (
        invoice.attachments.map(att => (
          <Typography key={att.id} variant="body2">
            {att.name} · {new Date(att.uploadedAt).toLocaleDateString()}
          </Typography>
        ))
      )}
      <FileUpload label="Upload signed copy" accept=".pdf,.png,.jpg" onUpload={() => {}} />
    </Stack>
  )
}

function PaymentHistoryTab({ invoice }: { invoice: Invoice }) {
  if (invoice.payments.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No payments recorded yet.
      </Typography>
    )
  }
  return (
    <Box sx={agreementEmbeddedTableSx}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={agreementEmbeddedTableHeadCellSx}>Date</TableCell>
            <TableCell sx={agreementEmbeddedTableHeadCellSx}>Amount</TableCell>
            <TableCell sx={agreementEmbeddedTableHeadCellSx}>TDS %</TableCell>
            <TableCell sx={agreementEmbeddedTableHeadCellSx}>TDS value</TableCell>
            <TableCell sx={agreementEmbeddedTableHeadCellSx}>Method</TableCell>
            <TableCell sx={agreementEmbeddedTableHeadCellSx}>Reference</TableCell>
            <TableCell sx={agreementEmbeddedTableHeadCellSx}>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {invoice.payments.map(p => (
            <TableRow key={p.id}>
              <TableCell sx={{ fontSize: 13 }}>{p.date}</TableCell>
              <TableCell sx={{ fontSize: 13 }}>{formatInr(p.amount)}</TableCell>
              <TableCell sx={{ fontSize: 13 }}>
                {p.tdsPercentage != null && p.tdsPercentage > 0 ? `${p.tdsPercentage}%` : '—'}
              </TableCell>
              <TableCell sx={{ fontSize: 13 }}>
                {p.tdsAmount != null && p.tdsAmount > 0 ? formatInr(p.tdsAmount) : '—'}
              </TableCell>
              <TableCell sx={{ fontSize: 13 }}>{p.method}</TableCell>
              <TableCell sx={{ fontSize: 13 }}>{p.reference}</TableCell>
              <TableCell sx={{ fontSize: 13 }}>{paymentStatusLabel[p.status]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  )
}

function ActivityTab({ invoice }: { invoice: Invoice }) {
  return (
    <ActivityFeed
      items={invoice.activities.map(a => ({
        id: a.id,
        user: { name: a.actor },
        action: a.action,
        target: a.detail,
        timestamp: a.timestamp,
      }))}
    />
  )
}

export function InvoiceDetailTabContent({ invoice, activeTab }: InvoiceDetailTabsProps) {
  switch (activeTab) {
    case 'line_items':
      return <LineItemsTab invoice={invoice} />
    case 'tax':
      return <TaxBreakdownTab invoice={invoice} />
    case 'adjustment':
      return <AdvanceCreditTab invoice={invoice} />
    case 'attachments':
      return <AttachmentsTab invoice={invoice} />
    case 'payments':
      return <PaymentHistoryTab invoice={invoice} />
    case 'activity':
      return <ActivityTab invoice={invoice} />
    default:
      return <OverviewTab invoice={invoice} />
  }
}

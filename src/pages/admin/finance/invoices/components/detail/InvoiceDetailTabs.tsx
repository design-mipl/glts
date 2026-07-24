import {
  Box,
  Divider,
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
import {
  agreementEmbeddedTableHeadCellSx,
  agreementEmbeddedTableSx,
} from '@/pages/admin/customer-accounts/agreements/components/agreementFormLayout'
import { paymentStatusLabel } from '../../config/invoiceStatusConfig'
import { canCreateSecondaryInvoice } from '../../utils/invoiceCorrectionPolicy'
import { InvoiceDetailLineGroups } from './InvoiceDetailLineGroups'
import { InvoiceDetailRefundTab } from './InvoiceDetailRefundTab'
import { InvoiceDetailUnbilledExpensesTab } from './InvoiceDetailUnbilledExpensesTab'
import { invoiceService } from '@/shared/services/invoiceService'

interface InvoiceDetailTabsProps {
  invoice: Invoice
  activeTab: string
  onCreateSecondaryInvoice?: () => void
  onModifyInvoice?: () => void
  onCreateCreditNote?: () => void
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
      <Typography variant="caption" color="text.secondary" display="block">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
        {value}
      </Typography>
    </Grid>
  )
}

function TotalsRow({
  label,
  value,
  emphasis,
}: {
  label: string
  value: string
  emphasis?: boolean
}) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="baseline" spacing={2}>
      <Typography
        variant="body2"
        color={emphasis ? 'text.primary' : 'text.secondary'}
        fontWeight={emphasis ? 700 : 400}
        sx={{ fontSize: 13 }}
      >
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={emphasis ? 700 : 600} sx={{ fontSize: 13 }}>
        {value}
      </Typography>
    </Stack>
  )
}

/** Invoice document: slim context + application/passenger line groups + totals. */
function InvoiceDocumentTab({ invoice }: { invoice: Invoice }) {
  const { totals, taxConfig } = invoice
  const isCreditNote = invoice.invoiceType === 'credit_note'
  const sourceInvoice = invoice.sourceInvoiceId
    ? invoiceService.getById(invoice.sourceInvoiceId)
    : undefined

  const slimMeta: Array<{ label: string; value: string }> = [
    { label: 'Vessel', value: invoice.vesselName ?? '—' },
    { label: 'Payment terms', value: invoice.paymentTerms ?? '—' },
  ]
  if (invoice.poReference?.trim()) {
    slimMeta.push({ label: 'PO reference', value: invoice.poReference.trim() })
  }
  if (sourceInvoice) {
    slimMeta.push({ label: 'Source invoice', value: sourceInvoice.invoiceId })
  } else if (invoice.sourceInvoiceId) {
    slimMeta.push({ label: 'Source invoice', value: invoice.sourceInvoiceId })
  }

  return (
    <Stack spacing={2.5}>
      <Grid container spacing={1.5}>
        {slimMeta.map(item => (
          <MetaItem key={item.label} label={item.label} value={item.value} />
        ))}
      </Grid>

      <Divider />

      <Box>
        <InvoiceDetailLineGroups
          invoice={invoice}
          title={isCreditNote ? 'Services credited' : 'Billable services'}
        />
      </Box>

      <Box
        sx={{
          alignSelf: { xs: 'stretch', sm: 'flex-end' },
          width: { xs: '100%', sm: 320 },
          p: 2,
          borderRadius: 1.5,
          border: 1,
          borderColor: 'divider',
          bgcolor: 'action.hover',
        }}
      >
        <Stack spacing={1}>
          <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13, mb: 0.5 }}>
            {isCreditNote ? 'Credit note totals' : 'Tax & totals'}
          </Typography>
          <TotalsRow label="Subtotal" value={formatInr(totals.subtotal)} />
          <TotalsRow
            label={`GST (${taxConfig.gstPercentage}%)`}
            value={formatInr(totals.gstTotal)}
          />
          {taxConfig.tdsApplicable || totals.tdsAmount > 0 ? (
            <TotalsRow
              label={`TDS (${taxConfig.tdsPercentage}%)`}
              value={formatInr(-Math.abs(totals.tdsAmount))}
            />
          ) : null}
          {totals.additionalCharges !== 0 ? (
            <TotalsRow label="Additional charges" value={formatInr(totals.additionalCharges)} />
          ) : null}
          {!isCreditNote && totals.advanceAdjusted > 0 ? (
            <TotalsRow
              label="Advance adjusted"
              value={formatInr(-Math.abs(totals.advanceAdjusted))}
            />
          ) : null}
          <Divider sx={{ my: 0.5 }} />
          <TotalsRow
            label={isCreditNote ? 'Credit note amount' : 'Final amount'}
            value={formatInr(totals.finalAmount)}
            emphasis
          />
          {!isCreditNote ? (
            <TotalsRow
              label="Balance payable"
              value={formatInr(totals.balancePayable)}
              emphasis
            />
          ) : null}
        </Stack>
      </Box>
    </Stack>
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
    <Stack spacing={1.5} sx={{ maxWidth: 480 }}>
      <TotalsRow label="Billing type" value={billingAdjustment.billingType} />
      <TotalsRow label="Invoice total" value={formatInr(totals.finalAmount)} />
      <TotalsRow label="Advance available" value={formatInr(totals.advanceAvailable)} />
      <TotalsRow label="Advance adjusted" value={formatInr(totals.advanceAdjusted)} />
      <TotalsRow label="Credit applied" value={formatInr(totals.creditApplied)} />
      <Divider />
      <TotalsRow label="Balance payable" value={formatInr(totals.balancePayable)} emphasis />
      {billingAdjustment.billingType === 'credit' || billingAdjustment.billingType === 'mixed' ? (
        <>
          <TotalsRow label="Credit limit" value={formatInr(billingAdjustment.creditLimit ?? 0)} />
          <TotalsRow label="Credit used" value={formatInr(billingAdjustment.creditUsed ?? 0)} />
          <TotalsRow
            label="Available credit"
            value={formatInr(billingAdjustment.creditAvailable ?? 0)}
          />
        </>
      ) : null}
    </Stack>
  )
}

function AttachmentsTab({ invoice }: { invoice: Invoice }) {
  return (
    <Stack spacing={2}>
      <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
        Invoice PDF and signed copies for this document.
      </Typography>
      {invoice.attachments.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No attachments yet. Submit or share the invoice to generate a PDF entry, or upload a
          signed copy.
        </Typography>
      ) : (
        <Stack spacing={1}>
          {invoice.attachments.map(att => (
            <Stack
              key={att.id}
              direction="row"
              justifyContent="space-between"
              spacing={2}
              sx={{
                py: 1,
                px: 1.5,
                borderRadius: 1,
                border: 1,
                borderColor: 'divider',
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2" fontWeight={600} noWrap sx={{ fontSize: 13 }}>
                  {att.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {att.type === 'invoice_pdf'
                    ? 'Invoice PDF'
                    : att.type === 'signed_copy'
                      ? 'Signed copy'
                      : 'Other'}{' '}
                  · {new Date(att.uploadedAt).toLocaleDateString()}
                </Typography>
              </Box>
            </Stack>
          ))}
        </Stack>
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

export function InvoiceDetailTabContent({
  invoice,
  activeTab,
  onCreateSecondaryInvoice,
  onModifyInvoice,
  onCreateCreditNote,
}: InvoiceDetailTabsProps) {
  switch (activeTab) {
    case 'refund':
      return (
        <InvoiceDetailRefundTab
          invoice={invoice}
          onModifyInvoice={onModifyInvoice}
          onCreateCreditNote={onCreateCreditNote}
        />
      )
    case 'unbilled':
      return (
        <InvoiceDetailUnbilledExpensesTab
          invoice={invoice}
          canCreateSecondaryInvoice={canCreateSecondaryInvoice(invoice)}
          onCreateSecondaryInvoice={onCreateSecondaryInvoice}
        />
      )
    case 'adjustment':
      return <AdvanceCreditTab invoice={invoice} />
    case 'attachments':
      return <AttachmentsTab invoice={invoice} />
    case 'payments':
      return <PaymentHistoryTab invoice={invoice} />
    case 'activity':
      return <ActivityTab invoice={invoice} />
    case 'invoice':
    default:
      return <InvoiceDocumentTab invoice={invoice} />
  }
}

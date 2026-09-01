import { useMemo } from 'react'
import {
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { Badge, Button } from '@/design-system/UIComponents'
import type { Invoice } from '@/shared/types/invoice'
import { formatDisplayDateTime } from '@/shared/utils/formatDisplayDate'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import {
  agreementEmbeddedTableHeadCellSx,
} from '@/pages/admin/customer-accounts/agreements/components/agreementFormLayout'
import {
  canCreateCreditNote,
  canModifyInvoice,
} from '../../utils/invoiceCorrectionPolicy'
import {
  listInvoiceRefunds,
  sumInvoiceRefunds,
  sumPendingInvoiceRefunds,
} from '../../utils/invoiceDetailSideTabs'
import type { InvoiceDetailRefundRow } from '../../utils/invoiceConsulateRefundUtils'

interface InvoiceDetailRefundTabProps {
  invoice: Invoice
  onModifyInvoice?: () => void
  onCreateCreditNote?: () => void
}

function refundRowBadge(row: InvoiceDetailRefundRow): {
  label: string
  color: 'success' | 'warning' | 'info'
} {
  if (row.status === 'managed' || row.appliedVia === 'managed') {
    return { label: 'Managed', color: 'info' }
  }
  if (row.status === 'applied') {
    return { label: 'Applied', color: 'success' }
  }
  return { label: 'Pending', color: 'warning' }
}

function refundAppliedCaption(row: InvoiceDetailRefundRow): string | null {
  if (row.status === 'pending' || !row.appliedDocumentNumber) return null
  if (row.appliedVia === 'managed') return `${row.appliedDocumentNumber} · Managed in services`
  if (row.appliedVia === 'credit_note') return `${row.appliedDocumentNumber} · Credit note`
  return row.appliedDocumentNumber
}

export function InvoiceDetailRefundTab({
  invoice,
  onModifyInvoice,
  onCreateCreditNote,
}: InvoiceDetailRefundTabProps) {
  const rows = useMemo(() => listInvoiceRefunds(invoice), [invoice])
  const total = sumInvoiceRefunds(rows)
  const pendingTotal = sumPendingInvoiceRefunds(rows)
  const hasPending = pendingTotal > 0
  const showModify = hasPending && canModifyInvoice(invoice) && Boolean(onModifyInvoice)
  const showCreditNote = hasPending && canCreateCreditNote(invoice) && Boolean(onCreateCreditNote)

  if (rows.length === 0) {
    return (
      <Stack spacing={1}>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
          No consulate refunds recorded for applications on this invoice.
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
          Refunds saved in Ground Operations → Tracking & Logistics appear here automatically.
        </Typography>
      </Stack>
    )
  }

  return (
    <Stack spacing={2}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', sm: 'center' }}
        spacing={1}
        useFlexGap
      >
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
            Consulate refunds from Tracking & Logistics for passengers on this invoice.
          </Typography>
          {hasPending ? (
            <Typography variant="caption" color="warning.main" sx={{ fontSize: 12, display: 'block', mt: 0.5 }}>
              {formatInr(pendingTotal)} pending — apply via{' '}
              {showModify ? 'Modify invoice' : showCreditNote ? 'Create credit note' : 'billing correction'}
              .
            </Typography>
          ) : null}
        </Box>
        <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
          {showModify ? (
            <Button
              label="Modify invoice"
              size="sm"
              variant="outlined"
              onClick={onModifyInvoice}
            />
          ) : null}
          {showCreditNote ? (
            <Button
              label="Create credit note"
              size="sm"
              variant="outlined"
              onClick={onCreateCreditNote}
            />
          ) : null}
        </Stack>
      </Stack>

      <Box sx={{ overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={agreementEmbeddedTableHeadCellSx}>Passenger</TableCell>
              <TableCell sx={agreementEmbeddedTableHeadCellSx}>Application</TableCell>
              <TableCell sx={agreementEmbeddedTableHeadCellSx}>Vendor</TableCell>
              <TableCell sx={agreementEmbeddedTableHeadCellSx}>Status</TableCell>
              <TableCell sx={agreementEmbeddedTableHeadCellSx}>Recorded</TableCell>
              <TableCell sx={agreementEmbeddedTableHeadCellSx}>Remarks</TableCell>
              <TableCell sx={{ ...agreementEmbeddedTableHeadCellSx, width: 120 }} align="right">
                Amount
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => {
              const badge = refundRowBadge(row)
              const caption = refundAppliedCaption(row)
              return (
              <TableRow key={row.id}>
                <TableCell sx={{ fontSize: 13, verticalAlign: 'top' }}>
                  <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
                    {row.passengerName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {row.passportNumber || row.operationalId}
                  </Typography>
                </TableCell>
                <TableCell sx={{ fontSize: 13, verticalAlign: 'top' }}>{row.applicationId}</TableCell>
                <TableCell sx={{ fontSize: 13, verticalAlign: 'top' }}>{row.vendorName}</TableCell>
                <TableCell sx={{ verticalAlign: 'top' }}>
                  <Badge
                    label={badge.label}
                    color={badge.color}
                    size="sm"
                  />
                  {caption ? (
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.35 }}>
                      {caption}
                    </Typography>
                  ) : null}
                </TableCell>
                <TableCell sx={{ fontSize: 13, verticalAlign: 'top' }}>
                  {row.recordedAt ? formatDisplayDateTime(row.recordedAt) : '—'}
                  {row.recordedBy ? (
                    <Typography variant="caption" color="text.secondary" display="block">
                      {row.recordedBy}
                    </Typography>
                  ) : null}
                </TableCell>
                <TableCell sx={{ fontSize: 13, verticalAlign: 'top', color: 'text.secondary' }}>
                  {row.remarks || '—'}
                </TableCell>
                <TableCell sx={{ fontSize: 13, fontWeight: 600, verticalAlign: 'top' }} align="right">
                  {formatInr(row.amount)}
                </TableCell>
              </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Box>

      <Stack direction="row" justifyContent="flex-end" spacing={2}>
        {hasPending ? (
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
            Pending · {formatInr(pendingTotal)}
          </Typography>
        ) : null}
        <Typography variant="body2" fontWeight={700} sx={{ fontSize: 13 }}>
          Refund total · {formatInr(total)}
        </Typography>
      </Stack>
    </Stack>
  )
}

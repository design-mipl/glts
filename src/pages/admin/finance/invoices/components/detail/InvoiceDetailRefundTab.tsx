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

interface InvoiceDetailRefundTabProps {
  invoice: Invoice
  onModifyInvoice?: () => void
  onCreateCreditNote?: () => void
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
            {rows.map(row => (
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
                    label={row.status === 'applied' ? 'Applied' : 'Pending'}
                    color={row.status === 'applied' ? 'success' : 'warning'}
                    size="sm"
                  />
                  {row.status === 'applied' && row.appliedDocumentNumber ? (
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.35 }}>
                      {row.appliedDocumentNumber}
                      {row.appliedVia === 'credit_note' ? ' · Credit note' : ''}
                    </Typography>
                  ) : null}
                </TableCell>
                <TableCell sx={{ fontSize: 13, verticalAlign: 'top' }}>
                  {row.recordedAt ? new Date(row.recordedAt).toLocaleString() : '—'}
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
            ))}
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

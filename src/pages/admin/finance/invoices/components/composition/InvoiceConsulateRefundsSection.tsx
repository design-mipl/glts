import {
  Box,
  Checkbox,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { Badge } from '@/design-system/UIComponents'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import {
  agreementEmbeddedTableHeadCellSx,
} from '@/pages/admin/customer-accounts/agreements/components/agreementFormLayout'
import type { InvoiceConsulateRefundLine } from '../../types/invoiceFeeComposition.types'
import { sumIncludedConsulateRefunds } from '../../utils/invoiceConsulateRefundUtils'

interface InvoiceConsulateRefundsSectionProps {
  refunds: InvoiceConsulateRefundLine[]
  onChange: (next: InvoiceConsulateRefundLine[]) => void
  /** When true, include checkboxes are disabled (e.g. read-only applied view). */
  readOnly?: boolean
}

export function InvoiceConsulateRefundsSection({
  refunds,
  onChange,
  readOnly = false,
}: InvoiceConsulateRefundsSectionProps) {
  if (refunds.length === 0) return null

  const includedTotal = sumIncludedConsulateRefunds(refunds)

  const toggleIncluded = (id: string, included: boolean) => {
    onChange(
      refunds.map(row =>
        row.id === id && row.status === 'pending' ? { ...row, included } : row,
      ),
    )
  }

  return (
    <Stack spacing={1.25} sx={{ mt: 2 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', sm: 'center' }}
        spacing={0.75}
      >
        <Box>
          <Typography variant="body2" fontWeight={700} sx={{ fontSize: 13 }}>
            Consulate refunds
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
            From Ground Operations · Tracking & Logistics (passenger level)
          </Typography>
        </Box>
        {includedTotal > 0 ? (
          <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
            To apply · {formatInr(includedTotal)}
          </Typography>
        ) : null}
      </Stack>

      <Box sx={{ overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {!readOnly ? (
                <TableCell sx={{ ...agreementEmbeddedTableHeadCellSx, width: 48 }}>Include</TableCell>
              ) : null}
              <TableCell sx={agreementEmbeddedTableHeadCellSx}>Passenger</TableCell>
              <TableCell sx={agreementEmbeddedTableHeadCellSx}>Vendor</TableCell>
              <TableCell sx={agreementEmbeddedTableHeadCellSx}>Status</TableCell>
              <TableCell sx={agreementEmbeddedTableHeadCellSx}>Remarks</TableCell>
              <TableCell sx={{ ...agreementEmbeddedTableHeadCellSx, width: 110 }} align="right">
                Amount
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {refunds.map(row => {
              const isPending = row.status === 'pending'
              return (
                <TableRow key={row.id} sx={{ opacity: isPending || row.included ? 1 : 0.7 }}>
                  {!readOnly ? (
                    <TableCell sx={{ verticalAlign: 'top', py: 1 }}>
                      <Checkbox
                        size="small"
                        checked={isPending ? row.included : false}
                        disabled={!isPending}
                        onChange={(_, checked) => toggleIncluded(row.id, checked)}
                        inputProps={{ 'aria-label': `Include refund for ${row.passengerName}` }}
                      />
                    </TableCell>
                  ) : null}
                  <TableCell sx={{ fontSize: 13, verticalAlign: 'top' }}>
                    <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
                      {row.passengerName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {row.passportNumber || row.operationalId}
                    </Typography>
                  </TableCell>
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
    </Stack>
  )
}

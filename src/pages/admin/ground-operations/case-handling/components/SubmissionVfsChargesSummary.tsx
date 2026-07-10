import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import { Badge } from '@/design-system/UIComponents'
import {
  agreementEmbeddedTableHeadCellSx,
  agreementEmbeddedTableSx,
} from '@/pages/admin/customer-accounts/agreements/components/agreementFormLayout'
import type { OperationalCaseSubmissionSnapshot } from '@/shared/utils/operationalCaseSubmissionUtils'
import {
  getPaymentModeLabel,
  getReceiptStatusLabel,
} from '@/shared/utils/operationalCaseSubmissionUtils'
import { formatVfsGstLabel } from '@/shared/utils/countryVfsServiceRateUtils'

const tableTotalRowCellSx = {
  fontSize: 13,
  fontWeight: 600,
  borderBottom: 0,
  borderTop: 1,
  borderColor: 'divider',
  bgcolor: 'action.hover',
  pt: 1.25,
  pb: 1.25,
} as const

function formatInr(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`
}

function formatDisplayDate(value: string | undefined): string {
  if (!value?.trim()) return '—'
  const parsed = dayjs(value.trim(), ['YYYY-MM-DD', 'DD/MM/YYYY'], true)
  return parsed.isValid() ? parsed.format('DD MMM YYYY') : value
}

function SummaryField({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ fontSize: 11 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontSize: 12, mt: 0.25 }}>
        {value || '—'}
      </Typography>
    </Box>
  )
}

interface SubmissionVfsChargesSummaryProps {
  snapshot: OperationalCaseSubmissionSnapshot | null
}

export function SubmissionVfsChargesSummary({ snapshot }: SubmissionVfsChargesSummaryProps) {
  const receiptBadgeColor = useMemo(() => {
    if (!snapshot?.receiptStatus) return 'neutral' as const
    if (snapshot.receiptStatus === 'received') return 'success' as const
    if (snapshot.receiptStatus === 'awaited') return 'warning' as const
    return 'neutral' as const
  }, [snapshot?.receiptStatus])

  return (
    <Box
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 1.5,
        overflow: 'hidden',
        bgcolor: 'background.paper',
      }}
    >
      <Box
        sx={{
          px: 1.5,
          py: 1,
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'action.hover',
        }}
      >
        <Typography variant="body2" fontWeight={600} sx={{ fontSize: 12 }}>
          Already paid at submission
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
          Services recorded during application form filling
        </Typography>
      </Box>

      {!snapshot || snapshot.vfsServiceCharges.length === 0 ? (
        <Box sx={{ py: 2.5, px: 1.5, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12 }}>
            No VFS services recorded at submission for this passenger yet.
          </Typography>
        </Box>
      ) : (
        <>
          <Box sx={{ ...agreementEmbeddedTableSx, border: 0, borderRadius: 0 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={agreementEmbeddedTableHeadCellSx}>Service</TableCell>
                  <TableCell align="right" sx={agreementEmbeddedTableHeadCellSx}>
                    Amount
                  </TableCell>
                  <TableCell sx={agreementEmbeddedTableHeadCellSx}>GST</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {snapshot.vfsServiceCharges.map(line => (
                  <TableRow key={line.id} hover>
                    <TableCell sx={{ fontSize: 12 }}>{line.serviceName}</TableCell>
                    <TableCell align="right" sx={{ fontSize: 12, fontVariantNumeric: 'tabular-nums' }}>
                      {formatInr(line.amount)}
                    </TableCell>
                    <TableCell sx={{ fontSize: 12 }}>
                      <Badge
                        label={formatVfsGstLabel(line.gstIncluded ?? false)}
                        color={line.gstIncluded ? 'success' : 'neutral'}
                        size="sm"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell sx={tableTotalRowCellSx}>Total paid services</TableCell>
                  <TableCell
                    align="right"
                    sx={{ ...tableTotalRowCellSx, fontVariantNumeric: 'tabular-nums' }}
                  >
                    {formatInr(snapshot.totalServiceCharges)}
                  </TableCell>
                  <TableCell sx={tableTotalRowCellSx} />
                </TableRow>
              </TableFooter>
            </Table>
          </Box>

          <Box
            sx={{
              px: 1.5,
              py: 1.25,
              borderTop: 1,
              borderColor: 'divider',
              display: 'grid',
              gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(3, 1fr)' },
              gap: 1.25,
            }}
          >
            <SummaryField
              label="Submission ref."
              value={snapshot.submissionReferenceNumber ?? ''}
            />
            <SummaryField
              label="Submission date"
              value={formatDisplayDate(snapshot.submissionDate)}
            />
            <SummaryField label="Payment date" value={formatDisplayDate(snapshot.paymentDate)} />
            <SummaryField
              label="Payment mode"
              value={getPaymentModeLabel(snapshot.paymentMode)}
            />
            <SummaryField
              label="Payment ref."
              value={snapshot.paymentReferenceNumber ?? ''}
            />
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={600}
                sx={{ fontSize: 11 }}
              >
                Amount paid
              </Typography>
              <Typography variant="body2" sx={{ fontSize: 12, mt: 0.25, fontWeight: 600 }}>
                {snapshot.amountPaid?.trim()
                  ? formatInr(Number(snapshot.amountPaid) || 0)
                  : formatInr(snapshot.totalServiceCharges)}
              </Typography>
            </Box>
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={600}
                sx={{ fontSize: 11 }}
              >
                Receipt status
              </Typography>
              <Box sx={{ mt: 0.5 }}>
                <Badge
                  label={getReceiptStatusLabel(snapshot.receiptStatus)}
                  color={receiptBadgeColor}
                  size="sm"
                />
              </Box>
            </Box>
          </Box>
        </>
      )}
    </Box>
  )
}

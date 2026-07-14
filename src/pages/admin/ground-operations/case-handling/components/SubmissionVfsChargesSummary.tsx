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
import {
  agreementEmbeddedTableHeadCellSx,
  agreementEmbeddedTableSx,
} from '@/pages/admin/customer-accounts/agreements/components/agreementFormLayout'
import type { OperationalCaseSubmissionSnapshot } from '@/shared/utils/operationalCaseSubmissionUtils'

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

interface SubmissionVfsChargesSummaryProps {
  snapshot: OperationalCaseSubmissionSnapshot | null
}

export function SubmissionVfsChargesSummary({ snapshot }: SubmissionVfsChargesSummaryProps) {
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
        <Box sx={{ ...agreementEmbeddedTableSx, border: 0, borderRadius: 0 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={agreementEmbeddedTableHeadCellSx}>Service</TableCell>
                <TableCell align="right" sx={agreementEmbeddedTableHeadCellSx}>
                  Amount
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {snapshot.vfsServiceCharges.map(line => (
                <TableRow key={line.id} hover>
                  <TableCell sx={{ fontSize: 12 }}>{line.serviceName}</TableCell>
                  <TableCell align="right" sx={{ fontSize: 12, fontVariantNumeric: 'tabular-nums' }}>
                    {formatInr(line.amount)}
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
              </TableRow>
            </TableFooter>
          </Table>
        </Box>
      )}
    </Box>
  )
}

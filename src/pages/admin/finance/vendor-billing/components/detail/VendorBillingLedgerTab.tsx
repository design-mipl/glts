import { useMemo } from 'react'
import { Box, Grid, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { BaseCard } from '@/design-system/UIComponents'
import { vendorBillingService } from '@/shared/services/vendorBillingService'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import {
  agreementEmbeddedTableHeadCellSx,
  agreementEmbeddedTableSx,
} from '@/pages/admin/customer-accounts/agreements/components/agreementFormLayout'

interface VendorBillingLedgerTabProps {
  vendorId: string
}

export function VendorBillingLedgerTab({ vendorId }: VendorBillingLedgerTabProps) {
  const ledger = useMemo(() => vendorBillingService.getLedger(vendorId), [vendorId])

  return (
    <Stack spacing={2}>
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <BaseCard sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.45 }}>
              Opening balance
            </Typography>
            <Typography variant="h6" fontWeight={700} sx={{ mt: 0.5 }}>
              {formatInr(ledger.openingBalance)}
            </Typography>
          </BaseCard>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <BaseCard sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.45 }}>
              Closing balance
            </Typography>
            <Typography variant="h6" fontWeight={700} sx={{ mt: 0.5 }}>
              {formatInr(ledger.closingBalance)}
            </Typography>
          </BaseCard>
        </Grid>
      </Grid>

      <Box sx={agreementEmbeddedTableSx}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={agreementEmbeddedTableHeadCellSx}>Date</TableCell>
              <TableCell sx={agreementEmbeddedTableHeadCellSx}>Type</TableCell>
              <TableCell sx={agreementEmbeddedTableHeadCellSx}>Reference</TableCell>
              <TableCell sx={agreementEmbeddedTableHeadCellSx}>Description</TableCell>
              <TableCell sx={agreementEmbeddedTableHeadCellSx} align="right">
                Debit
              </TableCell>
              <TableCell sx={agreementEmbeddedTableHeadCellSx} align="right">
                Credit
              </TableCell>
              <TableCell sx={agreementEmbeddedTableHeadCellSx} align="right">
                Running balance
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ledger.entries.map(entry => (
              <TableRow key={entry.id}>
                <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                <TableCell sx={{ textTransform: 'capitalize' }}>{entry.type}</TableCell>
                <TableCell>{entry.reference}</TableCell>
                <TableCell>{entry.description}</TableCell>
                <TableCell align="right">{entry.debit > 0 ? formatInr(entry.debit) : '—'}</TableCell>
                <TableCell align="right">{entry.credit > 0 ? formatInr(entry.credit) : '—'}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  {formatInr(entry.runningBalance)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Stack>
  )
}

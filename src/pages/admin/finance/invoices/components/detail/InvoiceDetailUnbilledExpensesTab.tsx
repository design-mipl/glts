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
import { Button } from '@/design-system/UIComponents'
import type { Invoice } from '@/shared/types/invoice'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import {
  agreementEmbeddedTableHeadCellSx,
} from '@/pages/admin/customer-accounts/agreements/components/agreementFormLayout'
import {
  listInvoiceUnbilledExpenses,
  sumUnbilledExpenses,
} from '../../utils/invoiceDetailSideTabs'

interface InvoiceDetailUnbilledExpensesTabProps {
  invoice: Invoice
  onCreateSecondaryInvoice?: () => void
  canCreateSecondaryInvoice?: boolean
}

export function InvoiceDetailUnbilledExpensesTab({
  invoice,
  onCreateSecondaryInvoice,
  canCreateSecondaryInvoice = false,
}: InvoiceDetailUnbilledExpensesTabProps) {
  const expenses = useMemo(() => listInvoiceUnbilledExpenses(invoice), [invoice])
  const total = sumUnbilledExpenses(expenses)

  if (expenses.length === 0) {
    return (
      <Stack spacing={1.5}>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
          No unbilled client expenses for applications on this invoice.
        </Typography>
        {canCreateSecondaryInvoice && onCreateSecondaryInvoice ? (
          <Box>
            <Button
              label="Create secondary invoice"
              size="sm"
              variant="outlined"
              onClick={onCreateSecondaryInvoice}
            />
          </Box>
        ) : null}
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
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
          Client-billable expenses not yet included on this or another submitted invoice.
        </Typography>
        {canCreateSecondaryInvoice && onCreateSecondaryInvoice ? (
          <Button
            label="Create secondary invoice"
            size="sm"
            variant="outlined"
            onClick={onCreateSecondaryInvoice}
          />
        ) : null}
      </Stack>

      <Box sx={{ overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={agreementEmbeddedTableHeadCellSx}>Expense</TableCell>
              <TableCell sx={agreementEmbeddedTableHeadCellSx}>Application</TableCell>
              <TableCell sx={agreementEmbeddedTableHeadCellSx}>Passenger</TableCell>
              <TableCell sx={agreementEmbeddedTableHeadCellSx}>Source</TableCell>
              <TableCell sx={agreementEmbeddedTableHeadCellSx}>Vendor</TableCell>
              <TableCell sx={{ ...agreementEmbeddedTableHeadCellSx, width: 120 }} align="right">
                Amount
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses.map(expense => (
              <TableRow key={expense.id}>
                <TableCell sx={{ fontSize: 13, verticalAlign: 'top' }}>
                  <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
                    {expense.expenseTypeLabel || expense.expenseName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {expense.expenseId}
                  </Typography>
                </TableCell>
                <TableCell sx={{ fontSize: 13, verticalAlign: 'top' }}>
                  {expense.applicationId}
                </TableCell>
                <TableCell sx={{ fontSize: 13, verticalAlign: 'top' }}>
                  {expense.passengerMapping?.displayLabel || '—'}
                </TableCell>
                <TableCell sx={{ fontSize: 13, verticalAlign: 'top' }}>
                  {expense.serviceSourceLabel || expense.expenseSource || '—'}
                </TableCell>
                <TableCell sx={{ fontSize: 13, verticalAlign: 'top' }}>
                  {expense.vendorStaffPartner || '—'}
                </TableCell>
                <TableCell sx={{ fontSize: 13, fontWeight: 600, verticalAlign: 'top' }} align="right">
                  {formatInr(expense.netPayableAmount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      <Stack direction="row" justifyContent="flex-end">
        <Typography variant="body2" fontWeight={700} sx={{ fontSize: 13 }}>
          Unbilled total · {formatInr(total)}
        </Typography>
      </Stack>
    </Stack>
  )
}

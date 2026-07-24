import type { ReactNode } from 'react'
import {
  Box,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { Plus } from 'lucide-react'
import { Badge, Button, EmptyState, RowActions } from '@/design-system/UIComponents'
import type {
  ApplicationExpenseFinanceKpis,
  ApplicationExpenseRecord,
} from '@/shared/types/applicationExpenseManagement'
import { paymentStatusLabel } from '@/shared/utils/applicationExpenseManagementUtils'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { getPaidByLabel } from '../../config/expenseDetailFormConfig'
import { expenseRollupPaymentColor } from '../../config/expenseStatusConfig'

export type ExpenseItemAction = 'view' | 'edit' | 'upload_proof' | 'delete'

interface ExpenseItemsTableProps {
  expenses: ApplicationExpenseRecord[]
  financeKpis: ApplicationExpenseFinanceKpis
  onAddExpense: () => void
  onAction: (action: ExpenseItemAction, expense: ApplicationExpenseRecord) => void
  title?: string
  emptyDescription?: string
  /** Passenger workspace — mapping column is redundant when a single traveler is selected. */
  hideMappingColumn?: boolean
  /** Renders without outer border/chrome when nested inside a tab panel. */
  embedded?: boolean
}

function paymentStatusColor(
  status: ApplicationExpenseRecord['paymentStatus'],
): 'success' | 'warning' | 'error' | 'info' | 'neutral' {
  switch (status) {
    case 'paid':
      return expenseRollupPaymentColor.paid
    case 'partially_paid':
      return expenseRollupPaymentColor.partially_paid
    case 'pending_reimbursement':
      return expenseRollupPaymentColor.pending_reimbursement
    case 'not_paid':
    default:
      return expenseRollupPaymentColor.not_paid
  }
}

function buildHeaders(hideMappingColumn: boolean) {
  return [
    { key: 'service', label: 'Service', align: 'left' as const, width: hideMappingColumn ? '42%' : '34%' },
    ...(!hideMappingColumn
      ? [{ key: 'mapping', label: 'Mapping', align: 'left' as const, width: '16%' }]
      : []),
    { key: 'amount', label: 'Amount', align: 'right' as const, width: '18%' },
    { key: 'paidBy', label: 'Paid by', align: 'left' as const, width: hideMappingColumn ? '20%' : '16%' },
    { key: 'payment', label: 'Payment', align: 'left' as const, width: hideMappingColumn ? '14%' : '12%' },
    { key: 'actions', label: '', align: 'center' as const, width: 56 },
  ]
}

function SecondaryLine({ children }: { children: ReactNode }) {
  return (
    <Typography
      variant="caption"
      color="text.secondary"
      sx={{ fontSize: 11, display: 'block', lineHeight: 1.4, mt: 0.25 }}
    >
      {children}
    </Typography>
  )
}

export function ExpenseItemsTable({
  expenses,
  financeKpis,
  onAddExpense,
  onAction,
  title = 'Added expenses',
  emptyDescription = 'Add service, vendor, passenger mapping, amount, and proof details for this application.',
  hideMappingColumn = false,
  embedded = false,
}: ExpenseItemsTableProps) {
  const colors = usePublicBrandColors()
  const headers = buildHeaders(hideMappingColumn)

  return (
    <Box
      sx={{
        borderRadius: embedded ? 0 : '12px',
        border: embedded ? 'none' : `1px solid ${colors.border}`,
        overflow: 'hidden',
        bgcolor: embedded ? 'transparent' : 'background.paper',
        width: '100%',
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        justifyContent="space-between"
        spacing={1.25}
        sx={{
          px: embedded ? 0 : 2,
          py: embedded ? 0 : 1.5,
          mb: embedded ? 1.5 : 0,
          borderBottom: embedded ? 0 : `1px solid ${colors.border}`,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" useFlexGap>
          <Typography sx={{ fontWeight: 700, fontSize: 14, color: 'text.primary' }}>
            {title}
          </Typography>
          <Chip
            label={`${expenses.length}`}
            size="small"
            sx={{
              height: 22,
              fontSize: 11,
              fontWeight: 700,
              bgcolor: colors.surface,
              '& .MuiChip-label': { px: 1 },
            }}
          />
          {financeKpis.totalExpense > 0 ? (
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12, fontWeight: 600 }}>
              Total {formatInr(financeKpis.totalExpense)}
            </Typography>
          ) : null}
        </Stack>
        <Button label="Add expense" size="sm" startIcon={<Plus size={14} />} onClick={onAddExpense} />
      </Stack>

      {expenses.length === 0 ? (
        <Box sx={{ px: embedded ? 0 : 1, py: 1 }}>
          <EmptyState
            variant="no-data"
            title="No expenses added yet"
            description={emptyDescription}
            action={{ label: 'Add expense', onClick: onAddExpense }}
          />
        </Box>
      ) : (
        <Box sx={{ overflowX: 'auto', width: '100%' }}>
          <Table
            size="small"
            sx={{
              width: '100%',
              tableLayout: 'fixed',
              borderCollapse: 'separate',
              borderSpacing: 0,
            }}
          >
            <colgroup>
              {headers.map(header => (
                <col
                  key={header.key}
                  style={{
                    width: typeof header.width === 'number' ? `${header.width}px` : header.width,
                  }}
                />
              ))}
            </colgroup>
            <TableHead>
              <TableRow>
                {headers.map(header => (
                  <TableCell
                    key={header.key}
                    align={header.align}
                    sx={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: 'text.secondary',
                      letterSpacing: 0.2,
                      py: 1,
                      px: 1.5,
                      borderBottom: `1px solid ${colors.border}`,
                      bgcolor: embedded ? 'transparent' : colors.surface,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {header.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {expenses.map(row => (
                <TableRow
                  key={row.id}
                  hover
                  sx={{
                    cursor: 'pointer',
                    '&:last-of-type td': { borderBottom: 0 },
                    '& td': {
                      borderBottom: `1px solid ${colors.border}`,
                      py: 1.25,
                      px: 1.5,
                      verticalAlign: 'middle',
                    },
                  }}
                  onClick={() => onAction('view', row)}
                >
                  <TableCell>
                    <Typography
                      variant="body2"
                      noWrap
                      title={row.expenseTypeLabel || row.expenseName}
                      sx={{ fontSize: 13, fontWeight: 600, color: 'text.primary' }}
                    >
                      {row.expenseTypeLabel || row.expenseName}
                    </Typography>
                    <SecondaryLine>
                      {[row.vendorStaffPartner?.trim(), row.serviceSourceLabel]
                        .filter(Boolean)
                        .join(' · ') || row.serviceSourceLabel}
                    </SecondaryLine>
                  </TableCell>
                  {!hideMappingColumn ? (
                    <TableCell>
                      <Typography variant="body2" noWrap sx={{ fontSize: 13 }}>
                        {row.passengerMapping.displayLabel}
                      </Typography>
                    </TableCell>
                  ) : null}
                  <TableCell align="right">
                    <Typography
                      variant="body2"
                      fontWeight={700}
                      sx={{ fontSize: 13, fontVariantNumeric: 'tabular-nums' }}
                    >
                      {formatInr(row.netPayableAmount)}
                    </Typography>
                    {row.gstAmount > 0 ? (
                      <SecondaryLine>incl. GST {formatInr(row.gstAmount)}</SecondaryLine>
                    ) : null}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontSize: 13 }}>
                      {getPaidByLabel(row.paidBy)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Badge
                      label={paymentStatusLabel(row.paymentStatus)}
                      color={paymentStatusColor(row.paymentStatus)}
                      size="sm"
                    />
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ width: 56 }}
                    onClick={event => event.stopPropagation()}
                  >
                    <RowActions
                      row={row}
                      actions={[
                        { label: 'View', onClick: () => onAction('view', row) },
                        { label: 'Edit', onClick: () => onAction('edit', row) },
                        {
                          label: row.proofFileName ? 'Replace proof' : 'Upload proof',
                          onClick: () => onAction('upload_proof', row),
                        },
                        ...(!row.isAutoGenerated
                          ? [
                              {
                                label: 'Delete',
                                onClick: () => onAction('delete', row),
                                variant: 'destructive' as const,
                              },
                            ]
                          : []),
                      ]}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}
    </Box>
  )
}

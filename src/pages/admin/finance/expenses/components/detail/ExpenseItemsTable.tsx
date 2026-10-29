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
import { formatInr } from '@/shared/utils/invoiceCalculations'
import { deriveExpenseLineFinanceStatus, financeStatusLabel } from '@/shared/utils/applicationExpenseManagementUtils'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import {
  computeExpenseIwAmount,
  formatExpensePaidByDisplay,
  getExpenseInvoiceStatusLabel,
  getExpensePaymentModeLabel,
  resolveExpenseCostAmount,
  resolveExpenseInvoiceStatus,
} from '../../config/expenseDetailFormConfig'
import { expenseFinanceStatusColor, expenseInvoiceStatusColor } from '../../config/expenseStatusConfig'

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
  /** Hide the header Add expense control when the parent tab bar owns the action. */
  hideHeaderAddButton?: boolean
}

function buildHeaders(hideMappingColumn: boolean) {
  return [
    { key: 'service', label: 'Service', align: 'left' as const, width: hideMappingColumn ? '22%' : '18%' },
    ...(!hideMappingColumn
      ? [{ key: 'mapping', label: 'Mapping', align: 'left' as const, width: '10%' }]
      : []),
    { key: 'cost', label: 'Cost', align: 'right' as const, width: '10%' },
    { key: 'iw', label: 'IW', align: 'right' as const, width: '9%' },
    { key: 'total', label: 'Total', align: 'right' as const, width: '11%' },
    { key: 'paidBy', label: 'Paid by', align: 'left' as const, width: hideMappingColumn ? '16%' : '12%' },
    { key: 'status', label: 'Status', align: 'left' as const, width: '12%' },
    { key: 'mode', label: 'Mode', align: 'left' as const, width: '8%' },
    { key: 'invoice', label: 'Invoice', align: 'left' as const, width: '11%' },
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

function MoneyCell({ value, muted }: { value: number; muted?: boolean }) {
  return (
    <Typography
      variant="body2"
      fontWeight={muted ? 500 : 700}
      sx={{
        fontSize: 13,
        fontVariantNumeric: 'tabular-nums',
        color: muted ? 'text.secondary' : 'text.primary',
      }}
    >
      {formatInr(value)}
    </Typography>
  )
}

function PaidByCell({ expense }: { expense: ApplicationExpenseRecord }) {
  const user = expense.paidByUser?.trim()
  const department = expense.paidByDepartment?.trim()
  const team = expense.paidByTeam?.trim()
  const hasIdentity = Boolean(user || department || team)

  if (!hasIdentity) {
    return (
      <Typography variant="body2" noWrap sx={{ fontSize: 13 }}>
        {formatExpensePaidByDisplay(expense)}
      </Typography>
    )
  }

  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography
        variant="body2"
        noWrap
        title={user || undefined}
        sx={{ fontSize: 13, fontWeight: 600 }}
      >
        {user || '—'}
      </Typography>
      {department || team ? (
        <SecondaryLine>{[department, team].filter(Boolean).join(' · ')}</SecondaryLine>
      ) : null}
    </Box>
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
  hideHeaderAddButton = false,
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
        {!hideHeaderAddButton ? (
          <Button label="Add expense" size="sm" startIcon={<Plus size={14} />} onClick={onAddExpense} />
        ) : null}
      </Stack>

      {expenses.length === 0 ? (
        <Box sx={{ px: embedded ? 0 : 1, py: 1 }}>
          <EmptyState
            variant="no-data"
            title={title === 'Refunds' ? 'No refunds recorded yet' : 'No expenses added yet'}
            description={emptyDescription}
            action={
              hideHeaderAddButton
                ? undefined
                : { label: 'Add expense', onClick: onAddExpense }
            }
          />
        </Box>
      ) : (
        <Box sx={{ overflowX: 'auto', width: '100%' }}>
          <Table
            size="small"
            sx={{
              width: '100%',
              minWidth: 1080,
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
              {expenses.map(row => {
                const cost = resolveExpenseCostAmount(row)
                const total = row.amount
                const iw = computeExpenseIwAmount(cost, total)
                const invoiceStatus = resolveExpenseInvoiceStatus(row)
                const financeStatus = deriveExpenseLineFinanceStatus(row)

                return (
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
                      {row.serviceSourceLabel?.trim() ? (
                        <SecondaryLine>{row.serviceSourceLabel}</SecondaryLine>
                      ) : null}
                    </TableCell>
                    {!hideMappingColumn ? (
                      <TableCell>
                        <Typography variant="body2" noWrap sx={{ fontSize: 13 }}>
                          {row.passengerMapping.displayLabel}
                        </Typography>
                      </TableCell>
                    ) : null}
                    <TableCell align="right">
                      <MoneyCell value={cost} />
                    </TableCell>
                    <TableCell align="right">
                      <MoneyCell value={iw} muted />
                    </TableCell>
                    <TableCell align="right">
                      <MoneyCell value={total} />
                      {row.gstAmount > 0 ? (
                        <SecondaryLine>GST {formatInr(row.gstAmount)}</SecondaryLine>
                      ) : null}
                    </TableCell>
                    <TableCell>
                      <PaidByCell expense={row} />
                    </TableCell>
                    <TableCell>
                      <Badge
                        label={financeStatusLabel(financeStatus)}
                        color={expenseFinanceStatusColor[financeStatus]}
                        size="sm"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap sx={{ fontSize: 13 }}>
                        {getExpensePaymentModeLabel(row.paymentMode)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Badge
                        label={getExpenseInvoiceStatusLabel(invoiceStatus)}
                        color={expenseInvoiceStatusColor[invoiceStatus]}
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
                )
              })}
            </TableBody>
          </Table>
        </Box>
      )}
    </Box>
  )
}

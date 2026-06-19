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
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import {
  getBillToLabel,
  getPaidByLabel,
  getProofDocumentTypeLabel,
} from '../../config/expenseDetailFormConfig'
import { expenseProofStatusColor, expenseProofStatusLabel } from '../../config/expenseStatusConfig'

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

function buildHeaders(hideMappingColumn: boolean) {
  const headers = [
    { label: 'Service', align: 'left' as const, width: hideMappingColumn ? '34%' : '28%' },
    ...(!hideMappingColumn
      ? [{ label: 'Mapping', align: 'left' as const, width: '16%' }]
      : []),
    { label: 'Amount', align: 'right' as const, width: '14%' },
    { label: 'Billing', align: 'left' as const, width: hideMappingColumn ? '18%' : '14%' },
    { label: 'Proof', align: 'left' as const, width: hideMappingColumn ? '24%' : '20%' },
    { label: 'Actions', align: 'center' as const, width: 56 },
  ]
  return headers
}

function SecondaryLine({ children }: { children: ReactNode }) {
  return (
    <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11, display: 'block', lineHeight: 1.45 }}>
      {children}
    </Typography>
  )
}

function headerCellSx(colors: ReturnType<typeof usePublicBrandColors>, align: 'left' | 'right' | 'center') {
  return {
    fontSize: '11px',
    fontWeight: 700,
    color: colors.textMuted,
    py: 1.25,
    whiteSpace: 'nowrap' as const,
    textAlign: align,
  }
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
        borderRadius: embedded ? 0 : '14px',
        border: embedded ? 'none' : `1px solid ${colors.border}`,
        overflow: 'hidden',
        bgcolor: embedded ? 'transparent' : '#fff',
        width: '100%',
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        justifyContent="space-between"
        spacing={1.5}
        sx={{ px: embedded ? 0 : 2.5, py: embedded ? 0 : 1.75, borderBottom: embedded ? 0 : `1px solid ${colors.border}`, mb: embedded ? 1.5 : 0 }}
      >
        <Stack direction="row" alignItems="center" spacing={1.25} flexWrap="wrap" useFlexGap>
          <Typography sx={{ fontWeight: 700, fontSize: '15px', color: colors.navy }}>
            {title}
          </Typography>
          <Chip
            label={`${expenses.length} item${expenses.length === 1 ? '' : 's'}`}
            size="small"
            sx={{ fontSize: '11px', fontWeight: 700, bgcolor: colors.surface }}
          />
          {financeKpis.totalExpense > 0 ? (
            <Chip
              label={`Total ${formatInr(financeKpis.totalExpense)}`}
              size="small"
              sx={{ fontSize: '11px', fontWeight: 700, bgcolor: colors.surface }}
            />
          ) : null}
        </Stack>
        <Button label="Add expense" size="sm" startIcon={<Plus size={14} />} onClick={onAddExpense} />
      </Stack>

      {expenses.length === 0 ? (
        <Box sx={{ px: 2, py: 1 }}>
          <EmptyState
            variant="no-data"
            title="No expenses added yet"
            description={emptyDescription}
            action={{ label: 'Add expense', onClick: onAddExpense }}
          />
        </Box>
      ) : (
        <Box sx={{ overflowX: 'auto', width: '100%' }}>
          <Table size="small" sx={{ width: '100%', tableLayout: 'fixed' }}>
            <colgroup>
              {headers.map(header => (
                <col
                  key={header.label}
                  style={{
                    width: typeof header.width === 'number' ? `${header.width}px` : header.width,
                  }}
                />
              ))}
            </colgroup>
            <TableHead>
              <TableRow sx={{ bgcolor: colors.surface }}>
                {headers.map(header => (
                  <TableCell key={header.label} align={header.align} sx={headerCellSx(colors, header.align)}>
                    {header.label === 'Actions' ? '' : header.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {expenses.map(row => (
                <TableRow key={row.id} hover sx={{ '& td': { borderBottom: `1px solid ${colors.border}` } }}>
                  <TableCell sx={{ verticalAlign: 'top' }}>
                    <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 600, color: colors.navy }}>
                      {row.expenseTypeLabel || row.expenseName}
                    </Typography>
                    <SecondaryLine>
                      {row.vendorStaffPartner?.trim() || '—'}
                    </SecondaryLine>
                  </TableCell>
                  {!hideMappingColumn ? (
                    <TableCell sx={{ fontSize: 13, verticalAlign: 'top' }}>
                      {row.passengerMapping.displayLabel}
                    </TableCell>
                  ) : null}
                  <TableCell align="right" sx={{ verticalAlign: 'top' }}>
                    <Typography variant="body2" fontWeight={700} sx={{ fontSize: 13, color: colors.navy }}>
                      {formatInr(row.netPayableAmount)}
                    </Typography>
                    <SecondaryLine>
                      Base {formatInr(row.amount)}
                      {row.gstAmount > 0 ? ` · GST ${formatInr(row.gstAmount)}` : ''}
                    </SecondaryLine>
                  </TableCell>
                  <TableCell sx={{ verticalAlign: 'top' }}>
                    <Typography variant="body2" sx={{ fontSize: 13 }}>
                      {getPaidByLabel(row.paidBy)}
                    </Typography>
                    <SecondaryLine>Bill to {getBillToLabel(row.billTo)}</SecondaryLine>
                  </TableCell>
                  <TableCell sx={{ verticalAlign: 'top' }}>
                    <Stack spacing={0.5} alignItems="flex-start">
                      <Badge
                        label={expenseProofStatusLabel[row.proofStatus]}
                        color={expenseProofStatusColor[row.proofStatus]}
                        size="sm"
                      />
                      {row.proofFileName ? (
                        <SecondaryLine>
                          {row.proofDocumentType
                            ? `${getProofDocumentTypeLabel(row.proofDocumentType)} · ${row.proofFileName}`
                            : row.proofFileName}
                        </SecondaryLine>
                      ) : null}
                    </Stack>
                  </TableCell>
                  <TableCell align="center" sx={{ width: 56, verticalAlign: 'top' }}>
                    <RowActions
                      row={row}
                      actions={[
                        { label: 'View', onClick: () => onAction('view', row) },
                        { label: 'Edit', onClick: () => onAction('edit', row) },
                        {
                          label: row.proofFileName ? 'Replace Proof' : 'Upload Proof',
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

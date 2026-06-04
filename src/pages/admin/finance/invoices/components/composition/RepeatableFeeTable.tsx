import { Box, IconButton, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { PencilLine, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Button, Input, Select } from '@/design-system/UIComponents'
import { agreementEmbeddedTableHeadCellSx, agreementEmbeddedTableSx } from '@/pages/admin/customer-accounts/agreements/components/agreementFormLayout'
import { INVOICE_COMPOSITION_FEE_LABELS } from '../../config/invoiceFeeCategoryLabels'
import type { RepeatableFeeRow } from '../../types/invoiceFeeComposition.types'
import {
  CUSTOM_FEE_TYPE_VALUE,
  emptyRepeatableRow,
  getHandlingFeeTypeOptions,
  getMiscellaneousFeeTypeOptions,
} from '../../utils/invoiceFeeCompositionUtils'

const FEE = INVOICE_COMPOSITION_FEE_LABELS

interface RepeatableFeeTableProps {
  title: string
  addLabel: string
  variant: 'handling' | 'miscellaneous'
  rows: RepeatableFeeRow[]
  onChange: (rows: RepeatableFeeRow[]) => void
}

export function RepeatableFeeTable({ title, addLabel, variant, rows, onChange }: RepeatableFeeTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const options = variant === 'handling' ? getHandlingFeeTypeOptions() : getMiscellaneousFeeTypeOptions()

  const updateRow = (id: string, patch: Partial<RepeatableFeeRow>) => {
    onChange(rows.map(row => (row.id === id ? { ...row, ...patch } : row)))
  }

  const removeRow = (id: string) => {
    onChange(rows.filter(row => row.id !== id))
    if (editingId === id) setEditingId(null)
  }

  const addRow = () => {
    const row = emptyRepeatableRow()
    onChange([...rows, row])
    setEditingId(row.id)
  }

  const handleTypeChange = (id: string, feeType: string) => {
    const opt = options.find(o => o.value === feeType)
    if (feeType === CUSTOM_FEE_TYPE_VALUE) {
      updateRow(id, { feeType, feeTypeLabel: '', isCustom: true, amount: 0 })
      return
    }
    updateRow(id, {
      feeType,
      feeTypeLabel: opt?.label ?? '',
      isCustom: false,
      amount: opt?.defaultPrice ?? 0,
    })
  }

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
        <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
          {title}
        </Typography>
        <Button label={addLabel} size="sm" startIcon={<Plus size={14} />} onClick={addRow} />
      </Stack>
      <Box sx={agreementEmbeddedTableSx}>
        {rows.length === 0 ? (
          <Box sx={{ py: 2, px: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
              No line items added yet.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ overflowX: 'auto' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={agreementEmbeddedTableHeadCellSx}>
                    {variant === 'handling' ? FEE.courierFees.tableTypeColumn : 'Expense Type'}
                  </TableCell>
                  <TableCell sx={agreementEmbeddedTableHeadCellSx} align="right">
                    Amount
                  </TableCell>
                  <TableCell sx={agreementEmbeddedTableHeadCellSx}>Notes</TableCell>
                  <TableCell sx={{ ...agreementEmbeddedTableHeadCellSx, width: 88 }} align="center">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map(row => {
                  const isEditing = editingId === row.id
                  return (
                    <TableRow key={row.id}>
                      <TableCell sx={{ fontSize: 13, minWidth: 200 }}>
                        {isEditing ? (
                          <Stack spacing={1}>
                            <Select
                              value={row.isCustom ? CUSTOM_FEE_TYPE_VALUE : row.feeType}
                              onChange={v => handleTypeChange(row.id, String(v))}
                              options={options.map(o => ({ value: o.value, label: o.label }))}
                              size="sm"
                              fullWidth
                            />
                            {row.isCustom ? (
                              <Input
                                value={row.feeTypeLabel}
                                onChange={v => updateRow(row.id, { feeTypeLabel: v })}
                                placeholder="Custom fee name"
                                size="sm"
                                fullWidth
                              />
                            ) : null}
                          </Stack>
                        ) : (
                          row.feeTypeLabel || '—'
                        )}
                      </TableCell>
                      <TableCell align="right" sx={{ fontSize: 13 }}>
                        {isEditing ? (
                          <Input
                            type="number"
                            value={row.amount ? String(row.amount) : ''}
                            onChange={v => updateRow(row.id, { amount: Number(v) || 0 })}
                            size="sm"
                            fullWidth
                          />
                        ) : (
                          row.amount
                        )}
                      </TableCell>
                      <TableCell sx={{ fontSize: 13 }}>
                        {isEditing ? (
                          <Input
                            value={row.notes}
                            onChange={v => updateRow(row.id, { notes: v })}
                            size="sm"
                            fullWidth
                          />
                        ) : (
                          row.notes || '—'
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" justifyContent="center" spacing={0.5}>
                          <IconButton
                            size="small"
                            aria-label="Edit row"
                            onClick={() => setEditingId(isEditing ? null : row.id)}
                          >
                            <PencilLine size={14} />
                          </IconButton>
                          <IconButton size="small" aria-label="Delete row" onClick={() => removeRow(row.id)}>
                            <Trash2 size={14} />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </Box>
        )}
      </Box>
    </Box>
  )
}

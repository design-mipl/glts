import { useMemo, useState } from 'react'
import { Box, IconButton, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { Plus, Trash2 } from 'lucide-react'
import { Button, Input, Select } from '@/design-system/UIComponents'
import {
  agreementEmbeddedTableHeadCellSx,
  agreementEmbeddedTableSx,
} from '@/pages/admin/customer-accounts/agreements/components/agreementFormLayout'
import type { CommercialAgreement } from '@/shared/types/commercialAgreement'
import { INVOICE_COMPOSITION_FEE_LABELS } from '../../config/invoiceFeeCategoryLabels'
import type { InvoiceBillableServiceLine } from '../../types/invoiceFeeComposition.types'
import {
  createBillableServiceLineFromAgreement,
  listAvailableAgreementServicesToAdd,
} from '../../utils/invoiceFeeCompositionUtils'

const LABELS = INVOICE_COMPOSITION_FEE_LABELS.billableServices

interface InvoiceBillableServicesTableProps {
  lines: InvoiceBillableServiceLine[]
  onChange: (lines: InvoiceBillableServiceLine[]) => void
  agreement?: CommercialAgreement | null
  /** When false, hide add-service controls (credit note keep/remove only). */
  allowAddServices?: boolean
}

export function InvoiceBillableServicesTable({
  lines,
  onChange,
  agreement,
  allowAddServices = true,
}: InvoiceBillableServicesTableProps) {
  const [pendingServiceId, setPendingServiceId] = useState('')

  const availableOptions = useMemo(
    () => listAvailableAgreementServicesToAdd(agreement, lines),
    [agreement, lines],
  )

  const selectOptions = useMemo(
    () => availableOptions.map(option => ({ value: option.value, label: option.label })),
    [availableOptions],
  )

  const updateLine = (id: string, patch: Partial<Pick<InvoiceBillableServiceLine, 'amount' | 'remark'>>) => {
    onChange(lines.map(line => (line.id === id ? { ...line, ...patch } : line)))
  }

  const removeLine = (id: string) => {
    onChange(lines.filter(line => line.id !== id))
  }

  const addService = () => {
    const option = availableOptions.find(item => item.value === pendingServiceId)
    if (!option) return
    onChange([...lines, createBillableServiceLineFromAgreement(option)])
    setPendingServiceId('')
  }

  return (
    <Box>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', sm: 'center' }}
        spacing={1}
        sx={{ mb: 1 }}
      >
        <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
          {LABELS.section}
        </Typography>
        {allowAddServices ? (
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1}
          alignItems={{ xs: 'stretch', sm: 'center' }}
          sx={{ minWidth: 0, flex: { sm: 1 }, justifyContent: 'flex-end' }}
        >
          <Box sx={{ minWidth: { sm: 220 }, maxWidth: { sm: 280 }, flex: { sm: '0 1 280px' } }}>
            <Select
              value={pendingServiceId}
              onChange={v => setPendingServiceId(String(v))}
              options={selectOptions}
              placeholder={
                availableOptions.length === 0 ? LABELS.noAgreementServices : 'Select agreement service'
              }
              size="sm"
              fullWidth
              disabled={availableOptions.length === 0}
            />
          </Box>
          <Button
            label={LABELS.addService}
            size="sm"
            startIcon={<Plus size={14} />}
            onClick={addService}
            disabled={!pendingServiceId || availableOptions.length === 0}
          />
        </Stack>
        ) : null}
      </Stack>
      <Box sx={agreementEmbeddedTableSx}>
        {lines.length === 0 ? (
          <Box sx={{ py: 2, px: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
              {LABELS.empty}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ overflowX: 'auto' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={agreementEmbeddedTableHeadCellSx}>{LABELS.serviceColumn}</TableCell>
                  <TableCell sx={{ ...agreementEmbeddedTableHeadCellSx, width: 140 }} align="right">
                    {LABELS.amountColumn}
                  </TableCell>
                  <TableCell sx={agreementEmbeddedTableHeadCellSx}>{LABELS.remarkColumn}</TableCell>
                  <TableCell sx={{ ...agreementEmbeddedTableHeadCellSx, width: 56 }} align="center">
                    {LABELS.actionsColumn}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {lines.map(line => (
                  <TableRow key={line.id}>
                    <TableCell sx={{ fontSize: 13, fontWeight: 600, verticalAlign: 'top', minWidth: 180 }}>
                      {line.serviceLabel || '—'}
                    </TableCell>
                    <TableCell align="right" sx={{ verticalAlign: 'top' }}>
                      <Input
                        type="number"
                        value={line.amount ? String(line.amount) : ''}
                        onChange={v => updateLine(line.id, { amount: Number(v) || 0 })}
                        placeholder="0"
                        size="sm"
                        fullWidth
                        aria-label={`${line.serviceLabel} amount`}
                      />
                    </TableCell>
                    <TableCell sx={{ verticalAlign: 'top', minWidth: 200 }}>
                      <Input
                        value={line.remark}
                        onChange={v => updateLine(line.id, { remark: v })}
                        placeholder="Add remark"
                        size="sm"
                        fullWidth
                        aria-label={`${line.serviceLabel} remark`}
                      />
                    </TableCell>
                    <TableCell align="center" sx={{ verticalAlign: 'top' }}>
                      <IconButton
                        size="small"
                        onClick={() => removeLine(line.id)}
                        aria-label={`${LABELS.deleteService}: ${line.serviceLabel}`}
                      >
                        <Trash2 size={14} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}
      </Box>
      {lines.length > 0 ? (
        <Stack direction="row" justifyContent="flex-end" sx={{ mt: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
            {lines.length} service{lines.length === 1 ? '' : 's'}
          </Typography>
        </Stack>
      ) : null}
    </Box>
  )
}

import { Box, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { Input } from '@/design-system/UIComponents'
import {
  agreementEmbeddedTableHeadCellSx,
  agreementEmbeddedTableSx,
} from '@/pages/admin/customer-accounts/agreements/components/agreementFormLayout'
import { INVOICE_COMPOSITION_FEE_LABELS } from '../../config/invoiceFeeCategoryLabels'
import type { InvoiceBillableServiceLine } from '../../types/invoiceFeeComposition.types'

const LABELS = INVOICE_COMPOSITION_FEE_LABELS.billableServices

interface InvoiceBillableServicesTableProps {
  lines: InvoiceBillableServiceLine[]
  onChange: (lines: InvoiceBillableServiceLine[]) => void
}

export function InvoiceBillableServicesTable({ lines, onChange }: InvoiceBillableServicesTableProps) {
  const updateLine = (id: string, patch: Partial<Pick<InvoiceBillableServiceLine, 'amount' | 'remark'>>) => {
    onChange(lines.map(line => (line.id === id ? { ...line, ...patch } : line)))
  }

  return (
    <Box>
      <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13, mb: 1 }}>
        {LABELS.section}
      </Typography>
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

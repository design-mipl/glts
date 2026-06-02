import { Box, IconButton, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { Plus, Trash2 } from 'lucide-react'
import { Button, Input } from '@/design-system/UIComponents'
import type { InvoiceLineItem } from '@/shared/types/invoice'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import { agreementEmbeddedTableHeadCellSx, agreementEmbeddedTableSx } from '@/pages/admin/customer-accounts/agreements/components/agreementFormLayout'

interface InvoiceLineItemsTableProps {
  lineItems: InvoiceLineItem[]
  onChange: (items: InvoiceLineItem[]) => void
}

function newRow(): InvoiceLineItem {
  return {
    id: `li-${Date.now()}`,
    serviceType: '',
    description: '',
    quantity: 1,
    unitPrice: 0,
    gstApplicable: true,
    gstAmount: 0,
    amount: 0,
  }
}

export function InvoiceLineItemsTable({ lineItems, onChange }: InvoiceLineItemsTableProps) {
  const updateItem = (id: string, patch: Partial<InvoiceLineItem>) => {
    onChange(lineItems.map(item => (item.id === id ? { ...item, ...patch } : item)))
  }

  const removeItem = (id: string) => {
    onChange(lineItems.filter(item => item.id !== id))
  }

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
        <Typography variant="body2" fontWeight={600}>
          Invoice line items
        </Typography>
        <Button label="Add row" size="sm" startIcon={<Plus size={14} />} onClick={() => onChange([...lineItems, newRow()])} />
      </Stack>
      <Box sx={agreementEmbeddedTableSx}>
        {lineItems.length === 0 ? (
          <Box sx={{ py: 3, px: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontSize: 13 }}>
              Select applications or batches to auto-fetch line items, or add rows manually.
            </Typography>
            <Button label="Add row" size="sm" startIcon={<Plus size={14} />} onClick={() => onChange([newRow()])} />
          </Box>
        ) : (
          <Box sx={{ overflowX: 'auto' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={agreementEmbeddedTableHeadCellSx}>Application ID</TableCell>
                  <TableCell sx={agreementEmbeddedTableHeadCellSx}>Batch ID</TableCell>
                  <TableCell sx={agreementEmbeddedTableHeadCellSx}>Service Type</TableCell>
                  <TableCell sx={agreementEmbeddedTableHeadCellSx}>Description</TableCell>
                  <TableCell sx={agreementEmbeddedTableHeadCellSx}>Qty</TableCell>
                  <TableCell sx={agreementEmbeddedTableHeadCellSx}>Unit Price</TableCell>
                  <TableCell sx={agreementEmbeddedTableHeadCellSx}>GST</TableCell>
                  <TableCell sx={agreementEmbeddedTableHeadCellSx}>Amount</TableCell>
                  <TableCell align="right" sx={agreementEmbeddedTableHeadCellSx}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {lineItems.map(item => (
                  <TableRow key={item.id} hover>
                    <TableCell sx={{ minWidth: 140 }}>
                      <Input
                        value={item.applicationId ?? ''}
                        onChange={v => updateItem(item.id, { applicationId: v || undefined })}
                        size="sm"
                        fullWidth
                      />
                    </TableCell>
                    <TableCell sx={{ minWidth: 140 }}>
                      <Input
                        value={item.batchId ?? ''}
                        onChange={v => updateItem(item.id, { batchId: v || undefined })}
                        size="sm"
                        fullWidth
                      />
                    </TableCell>
                    <TableCell sx={{ minWidth: 130 }}>
                      <Input value={item.serviceType} onChange={v => updateItem(item.id, { serviceType: v })} size="sm" fullWidth />
                    </TableCell>
                    <TableCell sx={{ minWidth: 180 }}>
                      <Input value={item.description} onChange={v => updateItem(item.id, { description: v })} size="sm" fullWidth />
                    </TableCell>
                    <TableCell sx={{ width: 70 }}>
                      <Input
                        value={String(item.quantity)}
                        onChange={v => updateItem(item.id, { quantity: Number(v) || 0 })}
                        size="sm"
                        fullWidth
                      />
                    </TableCell>
                    <TableCell sx={{ width: 100 }}>
                      <Input
                        value={String(item.unitPrice)}
                        onChange={v => updateItem(item.id, { unitPrice: Number(v) || 0 })}
                        size="sm"
                        fullWidth
                      />
                    </TableCell>
                    <TableCell sx={{ width: 80, fontSize: 13 }}>{formatInr(item.gstAmount)}</TableCell>
                    <TableCell sx={{ width: 90, fontSize: 13, fontWeight: 600 }}>{formatInr(item.amount)}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => removeItem(item.id)} aria-label="Delete row">
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
    </Box>
  )
}

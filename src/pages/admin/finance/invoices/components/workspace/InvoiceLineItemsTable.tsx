import { Box, IconButton, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { Plus, Trash2 } from 'lucide-react'
import { Badge, Button, Checkbox, Input, Select } from '@/design-system/UIComponents'
import type { InvoiceLineItem } from '@/shared/types/invoice'
import { getBillableServiceOptions } from '@/shared/utils/invoiceBillingEngine'
import { defaultLineItemFields, formatInr, recalculateLineItem } from '@/shared/utils/invoiceCalculations'
import { agreementEmbeddedTableHeadCellSx, agreementEmbeddedTableSx } from '@/pages/admin/customer-accounts/agreements/components/agreementFormLayout'

interface InvoiceLineItemsTableProps {
  lineItems: InvoiceLineItem[]
  onChange: (items: InvoiceLineItem[]) => void
  gstPercentage: number
}

function newRow(gstPercentage: number): InvoiceLineItem {
  const base = {
    id: `li-${Date.now()}`,
    serviceType: '',
    description: '',
    quantity: 1,
    unitPrice: 0,
    gstApplicable: true,
    gstAmount: 0,
    amount: 0,
    ...defaultLineItemFields(),
  }
  return recalculateLineItem(base, gstPercentage)
}

export function InvoiceLineItemsTable({ lineItems, onChange, gstPercentage }: InvoiceLineItemsTableProps) {
  const serviceOptions = getBillableServiceOptions()

  const updateItem = (id: string, patch: Partial<InvoiceLineItem>) => {
    onChange(
      lineItems.map(item => {
        if (item.id !== id) return item
        const next = recalculateLineItem({ ...item, ...patch }, gstPercentage)
        return next
      }),
    )
  }

  const removeItem = (id: string) => {
    onChange(lineItems.filter(item => item.id !== id))
  }

  const handleServiceChange = (id: string, presetId: string) => {
    const svc = serviceOptions.find(s => s.value === presetId)
    if (!svc) return
    updateItem(id, {
      servicePresetId: presetId,
      serviceType: svc.label,
      unitPrice: svc.defaultPrice ?? 0,
    })
  }

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
        <Typography variant="body2" fontWeight={600}>
          Invoice line items
        </Typography>
        <Button label="Add row" size="sm" startIcon={<Plus size={14} />} onClick={() => onChange([...lineItems, newRow(gstPercentage)])} />
      </Stack>
      <Box sx={agreementEmbeddedTableSx}>
        {lineItems.length === 0 ? (
          <Box sx={{ py: 3, px: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontSize: 13 }}>
              Select applications or company billing period to auto-fetch line items, or add rows manually.
            </Typography>
            <Button label="Add row" size="sm" startIcon={<Plus size={14} />} onClick={() => onChange([newRow(gstPercentage)])} />
          </Box>
        ) : (
          <Box sx={{ overflowX: 'auto' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ ...agreementEmbeddedTableHeadCellSx, width: 40 }}>Include</TableCell>
                  <TableCell sx={agreementEmbeddedTableHeadCellSx}>Application ID</TableCell>
                  <TableCell sx={agreementEmbeddedTableHeadCellSx}>Batch ID</TableCell>
                  <TableCell sx={agreementEmbeddedTableHeadCellSx}>Pax name</TableCell>
                  <TableCell sx={agreementEmbeddedTableHeadCellSx}>Service Name</TableCell>
                  <TableCell sx={agreementEmbeddedTableHeadCellSx}>Description</TableCell>
                  <TableCell sx={agreementEmbeddedTableHeadCellSx}>Qty</TableCell>
                  <TableCell sx={agreementEmbeddedTableHeadCellSx}>Unit Price</TableCell>
                  <TableCell sx={agreementEmbeddedTableHeadCellSx}>GST</TableCell>
                  <TableCell sx={agreementEmbeddedTableHeadCellSx}>Amount</TableCell>
                  <TableCell sx={agreementEmbeddedTableHeadCellSx}>Billing Status</TableCell>
                  <TableCell sx={agreementEmbeddedTableHeadCellSx}>Remarks</TableCell>
                  <TableCell align="right" sx={agreementEmbeddedTableHeadCellSx}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {lineItems.map(item => (
                  <TableRow key={item.id} hover sx={{ opacity: item.included === false ? 0.55 : 1 }}>
                    <TableCell>
                      <Checkbox
                        checked={item.included !== false}
                        onChange={v => updateItem(item.id, { included: v })}
                      />
                    </TableCell>
                    <TableCell sx={{ minWidth: 120 }}>
                      <Input
                        value={item.applicationId ?? ''}
                        onChange={v => updateItem(item.id, { applicationId: v || undefined })}
                        size="sm"
                        fullWidth
                      />
                    </TableCell>
                    <TableCell sx={{ minWidth: 120 }}>
                      <Input
                        value={item.batchId ?? ''}
                        onChange={v => updateItem(item.id, { batchId: v || undefined })}
                        size="sm"
                        fullWidth
                      />
                    </TableCell>
                    <TableCell sx={{ minWidth: 120 }}>
                      <Input
                        value={item.applicantName ?? ''}
                        onChange={v => updateItem(item.id, { applicantName: v || undefined })}
                        size="sm"
                        fullWidth
                      />
                    </TableCell>
                    <TableCell sx={{ minWidth: 140 }}>
                      <Select
                        value={item.servicePresetId ?? ''}
                        onChange={v => handleServiceChange(item.id, String(v))}
                        options={serviceOptions}
                        placeholder="Select service"
                        size="sm"
                        clearable
                        fullWidth
                      />
                    </TableCell>
                    <TableCell sx={{ minWidth: 160 }}>
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
                    <TableCell sx={{ width: 90 }}>
                      <Badge
                        label={item.billingStatus === 'billed' ? 'Billed' : item.billingStatus === 'partial' ? 'Partial' : 'Unbilled'}
                        color={item.billingStatus === 'billed' ? 'success' : item.billingStatus === 'partial' ? 'warning' : 'neutral'}
                        size="sm"
                      />
                    </TableCell>
                    <TableCell sx={{ minWidth: 120 }}>
                      <Input
                        value={item.remarks ?? ''}
                        onChange={v => updateItem(item.id, { remarks: v })}
                        size="sm"
                        fullWidth
                        placeholder="Remarks"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={0.5} justifyContent="flex-end" alignItems="center">
                        <Button
                          label={item.isAdditionalExpense ? 'Additional ✓' : 'Mark additional'}
                          size="sm"
                          variant={item.isAdditionalExpense ? 'contained' : 'outlined'}
                          onClick={() => updateItem(item.id, { isAdditionalExpense: !item.isAdditionalExpense })}
                        />
                        <IconButton size="small" onClick={() => removeItem(item.id)} aria-label="Delete row">
                          <Trash2 size={14} />
                        </IconButton>
                      </Stack>
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

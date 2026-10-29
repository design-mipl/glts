import { useMemo } from 'react'
import { Box, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { Trash2 } from 'lucide-react'
import { IconButton, Input, Select } from '@/design-system/UIComponents'
import type { OrderServiceLineItem } from '@/shared/types/order'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import {
  agreementEmbeddedTableHeadCellSx,
  agreementEmbeddedTableSx,
} from '@/pages/admin/customer-accounts/agreements/components/agreementFormLayout'
import { getOrderGstOptions, getOrderGstRate, getOrderServiceOptions, getOrderVendorOptions } from '../utils/orderMasterOptions'

interface OrderServiceLineItemsSectionProps {
  lineItems: OrderServiceLineItem[]
  onChange: (lineItems: OrderServiceLineItem[]) => void
  error?: string
}

export function createEmptyLineItem(): OrderServiceLineItem {
  return {
    id: `line-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    serviceMasterId: '',
    vendorId: '',
    quantity: 1,
    vendorRate: 0,
    clientRate: 0,
    margin: 0,
    gstMasterId: '',
  }
}

function toNumber(value: string): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

export function OrderServiceLineItemsSection({ lineItems, onChange, error }: OrderServiceLineItemsSectionProps) {
  const serviceOptions = useMemo(() => getOrderServiceOptions(), [])
  const vendorOptions = useMemo(() => getOrderVendorOptions(), [])
  const gstOptions = useMemo(() => getOrderGstOptions(), [])

  const totals = useMemo(() => {
    const subtotal = lineItems.reduce((sum, line) => sum + line.clientRate, 0)
    const taxAmount =
      Math.round(
        lineItems.reduce((sum, line) => sum + line.clientRate * (getOrderGstRate(line.gstMasterId) / 100), 0) * 100,
      ) / 100
    const grandTotal = Math.round((subtotal + taxAmount) * 100) / 100
    return { subtotal, taxAmount, grandTotal }
  }, [lineItems])

  const updateLine = (id: string, patch: Partial<OrderServiceLineItem>) => {
    onChange(
      lineItems.map((line) => {
        if (line.id !== id) return line
        const next = { ...line, ...patch }
        next.margin = next.clientRate - next.vendorRate
        return next
      }),
    )
  }

  const removeLine = (id: string) => onChange(lineItems.filter((line) => line.id !== id))

  return (
    <Stack spacing={2}>
      {error ? (
        <Typography variant="caption" color="error">
          {error}
        </Typography>
      ) : null}

      {lineItems.length === 0 ? (
        <Box sx={{ py: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
            No line items added yet. Add at least one service line item.
          </Typography>
        </Box>
      ) : (
        <Box sx={agreementEmbeddedTableSx}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={agreementEmbeddedTableHeadCellSx}>Service</TableCell>
                <TableCell sx={agreementEmbeddedTableHeadCellSx}>Vendor</TableCell>
                <TableCell sx={agreementEmbeddedTableHeadCellSx}>GST</TableCell>
                <TableCell sx={agreementEmbeddedTableHeadCellSx} align="right">
                  Vendor rate/cost
                </TableCell>
                <TableCell sx={agreementEmbeddedTableHeadCellSx} align="right">
                  IW
                </TableCell>
                <TableCell sx={agreementEmbeddedTableHeadCellSx} align="right">
                  Total
                </TableCell>
                <TableCell sx={agreementEmbeddedTableHeadCellSx} align="center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lineItems.map((line) => (
                <TableRow key={line.id}>
                  <TableCell sx={{ minWidth: 200 }}>
                    <Select
                      value={line.serviceMasterId}
                      onChange={(value) => updateLine(line.id, { serviceMasterId: String(value) })}
                      options={serviceOptions}
                      placeholder="Select service"
                      searchable
                      fullWidth
                      size="sm"
                    />
                  </TableCell>
                  <TableCell sx={{ minWidth: 200 }}>
                    <Select
                      value={line.vendorId}
                      onChange={(value) => updateLine(line.id, { vendorId: String(value) })}
                      options={vendorOptions}
                      placeholder="Select vendor"
                      searchable
                      fullWidth
                      size="sm"
                    />
                  </TableCell>
                  <TableCell sx={{ minWidth: 150 }}>
                    <Select
                      value={line.gstMasterId}
                      onChange={(value) => updateLine(line.id, { gstMasterId: String(value) })}
                      options={gstOptions}
                      placeholder="Select GST"
                      searchable
                      fullWidth
                      size="sm"
                    />
                  </TableCell>
                  <TableCell sx={{ minWidth: 110 }}>
                    <Input
                      type="number"
                      value={String(line.vendorRate)}
                      onChange={(value) => updateLine(line.id, { vendorRate: toNumber(value) })}
                      size="sm"
                      fullWidth
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
                      {formatInr(line.margin)}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ minWidth: 110 }}>
                    <Input
                      type="number"
                      value={String(line.clientRate)}
                      onChange={(value) => updateLine(line.id, { clientRate: toNumber(value) })}
                      size="sm"
                      fullWidth
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      icon={<Trash2 size={14} />}
                      tooltip="Remove line item"
                      onClick={() => removeLine(line.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}

      <Stack
        direction="row"
        justifyContent="flex-end"
        spacing={4}
        sx={{ pt: 1, borderTop: 1, borderColor: 'divider' }}
      >
        <Stack spacing={0.25} alignItems="flex-end">
          <Typography variant="caption" color="text.secondary">
            Subtotal
          </Typography>
          <Typography variant="body2" fontWeight={600}>
            {formatInr(totals.subtotal)}
          </Typography>
        </Stack>
        <Stack spacing={0.25} alignItems="flex-end">
          <Typography variant="caption" color="text.secondary">
            Tax (GST)
          </Typography>
          <Typography variant="body2" fontWeight={600}>
            {formatInr(totals.taxAmount)}
          </Typography>
        </Stack>
        <Stack spacing={0.25} alignItems="flex-end">
          <Typography variant="caption" color="text.secondary">
            Grand total
          </Typography>
          <Typography variant="body2" fontWeight={700}>
            {formatInr(totals.grandTotal)}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  )
}

import { useState, useEffect } from 'react'
import { Box, Typography, FormControlLabel, Checkbox, Divider } from '@mui/material'
import {
  Drawer,
  Button,
  Select,
  Input,
  DateRangePicker,
} from '@/design-system/components'
import { CLIENT_OPTIONS } from '../types'
import type { InvoiceStatus } from '../types'

const ALL_STATUSES: InvoiceStatus[] = [
  'Draft',
  'Sent',
  'Partially Paid',
  'Paid',
  'Overdue',
  'Unpaid',
]

export interface BillingFilterState {
  status: string[]
  client: string
  amountMin: number
  amountMax: number
  dateFrom: string
  dateTo: string
}

export const EMPTY_FILTERS: BillingFilterState = {
  status: [],
  client: '',
  amountMin: 0,
  amountMax: 0,
  dateFrom: '',
  dateTo: '',
}

export interface BillingFiltersProps {
  open: boolean
  onClose: () => void
  filters: BillingFilterState
  onApply: (filters: BillingFilterState) => void
}

export default function BillingFilters({
  open,
  onClose,
  filters,
  onApply,
}: BillingFiltersProps) {
  const [local, setLocal] = useState<BillingFilterState>(filters)

  useEffect(() => {
    if (open) setLocal(filters)
  }, [open, filters])

  const toggleStatus = (status: string) => {
    setLocal((prev) => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter((s) => s !== status)
        : [...prev.status, status],
    }))
  }

  const handleReset = () => {
    setLocal(EMPTY_FILTERS)
    onApply(EMPTY_FILTERS)
    onClose()
  }

  const handleApply = () => {
    onApply(local)
    onClose()
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Filters"
      subtitle="Refine invoice list"
      anchor="right"
      width={320}
      footer={
        <>
          <Button variant="outlined" color="secondary" fullWidth onClick={handleReset}>
            Reset
          </Button>
          <Button variant="contained" color="primary" fullWidth onClick={handleApply}>
            Apply
          </Button>
        </>
      }
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
            Status
          </Typography>
          {ALL_STATUSES.map((status) => (
            <FormControlLabel
              key={status}
              control={
                <Checkbox
                  size="small"
                  checked={local.status.includes(status)}
                  onChange={() => toggleStatus(status)}
                />
              }
              label={status}
              sx={{ display: 'flex', ml: 0 }}
            />
          ))}
        </Box>

        <Divider />

        <DateRangePicker
          label="Invoice date range"
          value={[
            local.dateFrom ? new Date(local.dateFrom) : null,
            local.dateTo ? new Date(local.dateTo) : null,
          ]}
          onChange={(range) =>
            setLocal((prev) => ({
              ...prev,
              dateFrom: range[0]?.toISOString().slice(0, 10) ?? '',
              dateTo: range[1]?.toISOString().slice(0, 10) ?? '',
            }))
          }
        />

        <Select
          label="Client"
          value={local.client}
          onChange={(val) => setLocal((prev) => ({ ...prev, client: String(val) }))}
          options={[{ label: 'All clients', value: '' }, ...CLIENT_OPTIONS.map((c) => ({ label: c, value: c }))]}
        />

        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
            Amount range
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <Input
              label="Min"
              type="number"
              value={local.amountMin ? String(local.amountMin) : ''}
              onChange={(value) =>
                setLocal((prev) => ({ ...prev, amountMin: Number(value) || 0 }))
              }
              size="sm"
            />
            <Input
              label="Max"
              type="number"
              value={local.amountMax ? String(local.amountMax) : ''}
              onChange={(value) =>
                setLocal((prev) => ({ ...prev, amountMax: Number(value) || 0 }))
              }
              size="sm"
            />
          </Box>
        </Box>
      </Box>
    </Drawer>
  )
}

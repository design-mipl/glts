import { useMemo, useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Divider,
  FormControlLabel,
  Checkbox,
  Popover,
} from '@mui/material'
import { Search } from 'lucide-react'
import { Button, Input } from '@/design-system/components'

export interface BillingColumnFilterProps {
  open: boolean
  anchorEl: HTMLElement | null
  columnKey: string | null
  columnLabel: string
  uniqueValues: string[]
  selectedValues: string[]
  onClose: () => void
  onApply: (columnKey: string, values: string[]) => void
}

export default function BillingColumnFilter({
  open,
  anchorEl,
  columnKey,
  columnLabel,
  uniqueValues,
  selectedValues,
  onClose,
  onApply,
}: BillingColumnFilterProps) {
  const [search, setSearch] = useState('')
  const [localSelected, setLocalSelected] = useState<string[]>(selectedValues)

  useEffect(() => {
    if (open) {
      setLocalSelected(selectedValues)
      setSearch('')
    }
  }, [open, selectedValues])

  const filteredValues = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return uniqueValues
    return uniqueValues.filter((v) => v.toLowerCase().includes(q))
  }, [uniqueValues, search])

  const toggleValue = (value: string) => {
    setLocalSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    )
  }

  const handleClear = () => {
    if (!columnKey) return
    onApply(columnKey, [])
    onClose()
  }

  const handleApply = () => {
    if (!columnKey) return
    onApply(columnKey, localSelected)
    onClose()
  }

  return (
    <Popover
      open={open && Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      slotProps={{
        paper: {
          sx: {
            mt: 0.5,
            borderRadius: 2,
            boxShadow: 3,
            border: 1,
            borderColor: 'divider',
          },
        },
      }}
    >
      <Box sx={{ p: 2, width: 250 }}>
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
          Filter by {columnLabel}
        </Typography>

        <Input
          placeholder="Search..."
          value={search}
          onChange={setSearch}
          size="sm"
          startAdornment={<Search size={16} />}
          sx={{ mb: 1.5 }}
        />

        <Box sx={{ maxHeight: 250, overflowY: 'auto', mb: 2 }}>
          {filteredValues.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No values
            </Typography>
          ) : (
            filteredValues.map((value) => (
              <FormControlLabel
                key={value}
                control={
                  <Checkbox
                    size="small"
                    checked={localSelected.includes(value)}
                    onChange={() => toggleValue(value)}
                  />
                }
                label={
                  <Typography variant="body2" noWrap>
                    {value}
                  </Typography>
                }
                sx={{ display: 'flex', ml: 0, mr: 0, width: '100%' }}
              />
            ))
          )}
        </Box>

        <Divider sx={{ mb: 1.5 }} />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="text" color="secondary" size="sm" fullWidth onClick={handleClear}>
            Clear
          </Button>
          <Button variant="contained" color="primary" size="sm" fullWidth onClick={handleApply}>
            Apply
          </Button>
        </Box>
      </Box>
    </Popover>
  )
}

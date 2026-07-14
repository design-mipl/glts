import { Box, Stack, Typography } from '@mui/material'
import { Search, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Checkbox, IconButton, Input } from '@/design-system/UIComponents'
import type { QuotationServiceLine } from '@/shared/types/quotation'
import { formatInr } from '@/shared/utils/invoiceCalculations'

export interface ServicePickerOption {
  value: string
  label: string
  defaultPrice: number
  gstApplicable?: boolean
}

interface SearchableServicePickerProps {
  options: ServicePickerOption[]
  selected: QuotationServiceLine[]
  onChange: (next: QuotationServiceLine[]) => void
  placeholder?: string
  disabled?: boolean
}

function newLine(option: ServicePickerOption): QuotationServiceLine {
  return {
    id: `qsl-${Math.random().toString(36).slice(2, 8)}`,
    serviceId: option.value,
    serviceName: option.label,
    amount: option.defaultPrice,
    gstApplicable: option.gstApplicable ?? true,
  }
}

export function SearchableServicePicker({
  options,
  selected,
  onChange,
  placeholder = 'Search service…',
  disabled,
}: SearchableServicePickerProps) {
  const [search, setSearch] = useState('')

  const selectedIds = useMemo(() => new Set(selected.map((s) => s.serviceId)), [selected])
  const query = search.trim().toLowerCase()

  const filtered = useMemo(() => {
    if (!query) return []
    return options.filter((opt) => {
      if (selectedIds.has(opt.value)) return false
      return opt.label.toLowerCase().includes(query)
    })
  }, [options, query, selectedIds])

  return (
    <Stack spacing={1}>
      <Input
        value={search}
        onChange={setSearch}
        placeholder={placeholder}
        startAdornment={<Search size={14} />}
        fullWidth
        disabled={disabled}
      />
      {query ? (
        <Box
          sx={{
            border: 1,
            borderColor: 'divider',
            borderRadius: 2,
            maxHeight: 180,
            overflowY: 'auto',
          }}
        >
          {filtered.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ p: 2, fontSize: 13, textAlign: 'center' }}>
              {options.length === 0
                ? 'No services found in GLTS Fee Master for this customer type.'
                : 'No matching services'}
            </Typography>
          ) : (
            filtered.slice(0, 40).map((opt) => (
              <Box
                key={opt.value}
                onClick={() => {
                  if (disabled) return
                  onChange([...selected, newLine(opt)])
                  setSearch('')
                }}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  px: 1.5,
                  py: 1,
                  cursor: disabled ? 'default' : 'pointer',
                  borderBottom: 1,
                  borderColor: 'divider',
                  '&:last-of-type': { borderBottom: 0 },
                  '&:hover': disabled ? undefined : { bgcolor: 'action.hover' },
                }}
              >
                <Typography variant="body2" sx={{ fontSize: 13 }}>
                  {opt.label}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13, fontWeight: 600 }}>
                  {formatInr(opt.defaultPrice)}
                </Typography>
              </Box>
            ))
          )}
        </Box>
      ) : null}
    </Stack>
  )
}

interface SelectedServiceListProps {
  services: QuotationServiceLine[]
  onChange: (next: QuotationServiceLine[]) => void
  readOnly?: boolean
  showAmountEdit?: boolean
}

export function SelectedServiceList({
  services,
  onChange,
  readOnly,
  showAmountEdit = true,
}: SelectedServiceListProps) {
  if (services.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
        No services selected yet.
      </Typography>
    )
  }

  return (
    <Stack spacing={1}>
      {services.map((svc) => (
        <Box
          key={svc.id}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            px: 1.5,
            py: 1,
            border: 1,
            borderColor: 'divider',
            borderRadius: 1.5,
            minHeight: 44,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              flex: 1,
              minWidth: 0,
              fontSize: 13,
              fontWeight: 600,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            title={svc.serviceName}
          >
            {svc.serviceName}
          </Typography>
          {readOnly || !showAmountEdit ? (
            <Typography
              variant="body2"
              sx={{ fontSize: 13, fontWeight: 600, flexShrink: 0, whiteSpace: 'nowrap' }}
            >
              {formatInr(svc.amount)}
            </Typography>
          ) : (
            <>
              <Box sx={{ width: 112, flexShrink: 0 }}>
                <Input
                  type="number"
                  value={String(svc.amount)}
                  onChange={(v) =>
                    onChange(
                      services.map((s) =>
                        s.id === svc.id ? { ...s, amount: Number(v) || 0 } : s,
                      ),
                    )
                  }
                  fullWidth
                />
              </Box>
              <Box sx={{ flexShrink: 0, minWidth: 64, pl: 1.5 }}>
                <Checkbox
                  checked={svc.gstApplicable}
                  onChange={(checked) =>
                    onChange(
                      services.map((s) => (s.id === svc.id ? { ...s, gstApplicable: checked } : s)),
                    )
                  }
                  label="GST"
                  size="sm"
                />
              </Box>
              <Box sx={{ flexShrink: 0 }}>
                <IconButton
                  tooltip="Remove service"
                  size="sm"
                  variant="soft"
                  icon={<X size={14} />}
                  onClick={() => onChange(services.filter((s) => s.id !== svc.id))}
                />
              </Box>
            </>
          )}
        </Box>
      ))}
    </Stack>
  )
}

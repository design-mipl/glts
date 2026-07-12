import { Box, Stack, Typography } from '@mui/material'
import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Checkbox, Input } from '@/design-system/UIComponents'
import type { QuotationVfsServiceLine } from '@/shared/types/quotation'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import {
  resolveVfsPickerServices,
  sumVfsPickerServiceAmounts,
  type VfsPickerService,
} from '@/shared/utils/vfsServicePickerUtils'
import {
  vfsServicePickerEmptyStateSx,
  vfsServicePickerListSx,
  vfsServicePickerServiceRowSx,
} from '@/shared/utils/vfsServicePickerLayout'

interface VfsServiceSelectorProps {
  country: string
  visaType: string
  countryId?: string
  visaOfferingId?: string
  jurisdictionId?: string
  selected: QuotationVfsServiceLine[]
  onChange: (next: QuotationVfsServiceLine[]) => void
  disabled?: boolean
}

function toLine(service: VfsPickerService): QuotationVfsServiceLine {
  return {
    id: service.id,
    serviceName: service.serviceName,
    amount: service.amount,
    gstIncluded: service.gstIncluded,
  }
}

export function VfsServiceSelector({
  country,
  visaType,
  countryId,
  visaOfferingId,
  jurisdictionId,
  selected,
  onChange,
  disabled,
}: VfsServiceSelectorProps) {
  const [search, setSearch] = useState('')

  const catalog = useMemo(
    () =>
      resolveVfsPickerServices({
        country,
        visaType,
        countryId,
        visaOfferingId,
        jurisdictionId,
      }),
    [country, countryId, jurisdictionId, visaOfferingId, visaType],
  )

  const selectedIds = useMemo(() => new Set(selected.map((s) => s.id)), [selected])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return catalog
    return catalog.filter((s) => s.serviceName.toLowerCase().includes(q))
  }, [catalog, search])

  const runningTotal = sumVfsPickerServiceAmounts(selected)

  const toggle = (service: VfsPickerService) => {
    if (disabled) return
    if (selectedIds.has(service.id)) {
      onChange(selected.filter((s) => s.id !== service.id))
      return
    }
    onChange([...selected, toLine(service)])
  }

  if (!countryId || !visaType) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
        Select country and visa type to load VFS services.
      </Typography>
    )
  }

  return (
    <Stack spacing={1.5}>
      <Input
        value={search}
        onChange={setSearch}
        placeholder="Search VFS services…"
        startAdornment={<Search size={14} />}
        fullWidth
        disabled={disabled}
      />
      <Box sx={vfsServicePickerListSx}>
        {filtered.length === 0 ? (
          <Box sx={vfsServicePickerEmptyStateSx}>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
              No VFS services found for this selection.
            </Typography>
          </Box>
        ) : (
          filtered.map((service) => {
            const checked = selectedIds.has(service.id)
            return (
              <Box
                key={service.id}
                onClick={() => toggle(service)}
                sx={{
                  ...vfsServicePickerServiceRowSx,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  cursor: disabled ? 'default' : 'pointer',
                  opacity: disabled ? 0.6 : 1,
                  borderBottom: 1,
                  borderColor: 'divider',
                  '&:last-of-type': { borderBottom: 0 },
                }}
              >
                <Checkbox checked={checked} onChange={() => toggle(service)} disabled={disabled} size="sm" />
                <Typography variant="body2" sx={{ flex: 1, fontSize: 13 }}>
                  {service.serviceName}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 600 }}>
                  {formatInr(service.amount)}
                </Typography>
              </Box>
            )
          })
        )}
      </Box>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
          {selected.length} selected
        </Typography>
        <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 700 }}>
          Running total {formatInr(runningTotal)}
        </Typography>
      </Stack>
    </Stack>
  )
}

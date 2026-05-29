import { Stack } from '@mui/material'
import { Select } from '@/design-system/UIComponents'
import { vesselTypeOptions } from '../config/vesselTypeConfig'

interface VesselAdvancedFiltersProps {
  vesselType: string
  flagCountry: string
  status: string
  flagOptions: string[]
  onVesselTypeChange: (value: string) => void
  onFlagCountryChange: (value: string) => void
  onStatusChange: (value: string) => void
}

export function VesselAdvancedFilters({
  vesselType,
  flagCountry,
  status,
  flagOptions,
  onVesselTypeChange,
  onFlagCountryChange,
  onStatusChange,
}: VesselAdvancedFiltersProps) {
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ width: '100%' }}>
      <Select
        value={vesselType}
        onChange={v => onVesselTypeChange(String(v))}
        options={[{ value: 'all', label: 'All vessel types' }, ...vesselTypeOptions.map(o => ({ value: o.value, label: o.label }))]}
        sx={{ minWidth: { sm: 180 } }}
      />
      <Select
        value={flagCountry}
        onChange={v => onFlagCountryChange(String(v))}
        options={[{ value: 'all', label: 'All flag countries' }, ...flagOptions.map(c => ({ value: c, label: c }))]}
        sx={{ minWidth: { sm: 180 } }}
      />
      <Select
        value={status}
        onChange={v => onStatusChange(String(v))}
        options={[
          { value: 'all', label: 'All statuses' },
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' },
        ]}
        sx={{ minWidth: { sm: 160 } }}
      />
    </Stack>
  )
}

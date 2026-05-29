import { Stack } from '@mui/material'
import { Select } from '@/design-system/UIComponents'

interface EntityAdvancedFiltersProps {
  country: string
  status: string
  countryOptions: string[]
  onCountryChange: (value: string) => void
  onStatusChange: (value: string) => void
}

export function EntityAdvancedFilters({
  country,
  status,
  countryOptions,
  onCountryChange,
  onStatusChange,
}: EntityAdvancedFiltersProps) {
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ width: '100%' }}>
      <Select
        value={country}
        onChange={v => onCountryChange(String(v))}
        options={[
          { value: 'all', label: 'All countries' },
          ...countryOptions.map(c => ({ value: c, label: c })),
        ]}
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

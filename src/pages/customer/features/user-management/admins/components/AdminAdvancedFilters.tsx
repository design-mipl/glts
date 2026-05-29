import { Stack } from '@mui/material'
import { Select } from '@/design-system/UIComponents'
import { ADMIN_LOCATIONS } from '@/shared/data/mockAdminUsers'

interface AdminAdvancedFiltersProps {
  status: string
  location: string
  onStatusChange: (value: string) => void
  onLocationChange: (value: string) => void
}

export function AdminAdvancedFilters({
  status,
  location,
  onStatusChange,
  onLocationChange,
}: AdminAdvancedFiltersProps) {
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ width: '100%' }}>
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
      <Select
        value={location}
        onChange={v => onLocationChange(String(v))}
        options={[
          { value: 'all', label: 'All locations' },
          ...ADMIN_LOCATIONS.map(loc => ({ value: loc, label: loc })),
        ]}
        sx={{ minWidth: { sm: 180 } }}
      />
    </Stack>
  )
}

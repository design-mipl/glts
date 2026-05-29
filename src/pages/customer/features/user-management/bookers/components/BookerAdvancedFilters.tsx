import { Stack } from '@mui/material'
import { Select } from '@/design-system/UIComponents'
import { BOOKER_LOCATIONS } from '@/shared/data/mockBookerUsers'
import { bookerManagementService } from '@/shared/services/bookerManagementService'

interface BookerAdvancedFiltersProps {
  status: string
  location: string
  createdBy: string
  onStatusChange: (value: string) => void
  onLocationChange: (value: string) => void
  onCreatedByChange: (value: string) => void
}

export function BookerAdvancedFilters({
  status,
  location,
  createdBy,
  onStatusChange,
  onLocationChange,
  onCreatedByChange,
}: BookerAdvancedFiltersProps) {
  const createdByOptions = bookerManagementService.getCreatedByOptions()

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
          ...BOOKER_LOCATIONS.map(loc => ({ value: loc, label: loc })),
        ]}
        sx={{ minWidth: { sm: 180 } }}
      />
      <Select
        value={createdBy}
        onChange={v => onCreatedByChange(String(v))}
        options={[
          { value: 'all', label: 'All creators' },
          ...createdByOptions.map(name => ({ value: name, label: name })),
        ]}
        sx={{ minWidth: { sm: 180 } }}
      />
    </Stack>
  )
}

import { Stack } from '@mui/material'
import { Select } from '@/design-system/UIComponents'
import type { ServiceMasterListFilters } from '@/shared/types/serviceMaster'
import { SERVICE_TYPE_OPTIONS } from '../config/serviceTypeConfig'

export interface ServiceAdvancedFiltersProps {
  filters: ServiceMasterListFilters
  onChange: (next: ServiceMasterListFilters) => void
}

export function ServiceAdvancedFilters({ filters, onChange }: ServiceAdvancedFiltersProps) {
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} useFlexGap flexWrap="wrap">
      <Select
        label="Service type"
        placeholder="Select service type"
        value={filters.serviceType ?? 'all'}
        onChange={(value) =>
          onChange({ ...filters, serviceType: value as ServiceMasterListFilters['serviceType'] })
        }
        options={[{ value: 'all', label: 'All types' }, ...SERVICE_TYPE_OPTIONS]}
        size="sm"
        sx={{ minWidth: 180 }}
      />
    </Stack>
  )
}

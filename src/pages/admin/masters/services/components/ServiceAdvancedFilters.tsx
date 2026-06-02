import { Stack } from '@mui/material'
import { Select } from '@/design-system/UIComponents'
import type { ServiceMasterListFilters } from '@/shared/types/serviceMaster'
import { SERVICE_CATEGORY_OPTIONS, SERVICE_CURRENCY_OPTIONS } from '../config/serviceClassificationConfig'

export interface ServiceAdvancedFiltersProps {
  filters: ServiceMasterListFilters
  onChange: (next: ServiceMasterListFilters) => void
}

export function ServiceAdvancedFilters({ filters, onChange }: ServiceAdvancedFiltersProps) {
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} useFlexGap flexWrap="wrap">
      <Select
        label="Category"
        placeholder="Select category"
        value={filters.category ?? 'all'}
        onChange={(value) =>
          onChange({ ...filters, category: value as ServiceMasterListFilters['category'] })
        }
        options={[{ value: 'all', label: 'All categories' }, ...SERVICE_CATEGORY_OPTIONS]}
        size="sm"
        sx={{ minWidth: 180 }}
      />
      <Select
        label="Currency"
        placeholder="Select currency"
        value={filters.currency ?? 'all'}
        onChange={(value) =>
          onChange({ ...filters, currency: value as ServiceMasterListFilters['currency'] })
        }
        options={[{ value: 'all', label: 'All currencies' }, ...SERVICE_CURRENCY_OPTIONS]}
        size="sm"
        sx={{ minWidth: 140 }}
      />
    </Stack>
  )
}

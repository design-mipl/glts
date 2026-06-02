import { Stack } from '@mui/material'
import { Select } from '@/design-system/UIComponents'
import type { SacCodeMasterListFilters } from '@/shared/types/sacCodeMaster'
import { SAC_CATEGORY_OPTIONS } from '../config/sacCategoryOptions'

export interface SacCodeAdvancedFiltersProps {
  filters: SacCodeMasterListFilters
  onChange: (next: SacCodeMasterListFilters) => void
}

export function SacCodeAdvancedFilters({ filters, onChange }: SacCodeAdvancedFiltersProps) {
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} useFlexGap flexWrap="wrap">
      <Select
        label="Category"
        placeholder="Select category"
        value={filters.category ?? 'all'}
        onChange={(value) =>
          onChange({ ...filters, category: value as SacCodeMasterListFilters['category'] })
        }
        options={[{ value: 'all', label: 'All categories' }, ...SAC_CATEGORY_OPTIONS]}
        size="sm"
        sx={{ minWidth: 180 }}
      />
    </Stack>
  )
}

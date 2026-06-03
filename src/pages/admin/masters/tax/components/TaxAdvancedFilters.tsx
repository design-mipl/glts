import { Stack } from '@mui/material'
import { Select } from '@/design-system/UIComponents'
import type { TaxMasterListFilters } from '@/shared/types/taxMaster'
import { TDS_APPLICABLE_ON_OPTIONS } from '@/shared/services/taxMasterService'
import type { TaxConfigurationTab } from '../config/taxTabs'

export interface TaxAdvancedFiltersProps {
  activeTab: TaxConfigurationTab
  filters: TaxMasterListFilters
  onChange: (next: TaxMasterListFilters) => void
}

export function TaxAdvancedFilters({ activeTab, filters, onChange }: TaxAdvancedFiltersProps) {
  if (activeTab !== 'tds') return null

  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} useFlexGap flexWrap="wrap">
      <Select
        placeholder="All applicability"
        value={filters.applicableOn === 'all' ? '' : (filters.applicableOn ?? '')}
        onChange={(value) =>
          onChange({
            ...filters,
            applicableOn: (value ? value : 'all') as TaxMasterListFilters['applicableOn'],
          })
        }
        options={TDS_APPLICABLE_ON_OPTIONS}
        size="sm"
        clearable
        fullWidth
        sx={{ minWidth: { xs: '100%', sm: 220 } }}
      />
    </Stack>
  )
}

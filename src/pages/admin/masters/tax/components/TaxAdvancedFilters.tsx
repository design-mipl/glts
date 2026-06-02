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
        label="Applicable on"
        placeholder="Select applicability"
        value={filters.applicableOn ?? 'all'}
        onChange={(value) =>
          onChange({ ...filters, applicableOn: value as TaxMasterListFilters['applicableOn'] })
        }
        options={[
          { value: 'all', label: 'All applicability' },
          ...TDS_APPLICABLE_ON_OPTIONS,
        ]}
        size="sm"
        sx={{ minWidth: 180 }}
      />
    </Stack>
  )
}

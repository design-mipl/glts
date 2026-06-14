import { Select } from '@/design-system/UIComponents'
import { ListingFilterField } from '@/design-system/listingFilterPopoverShell'
import type { SacCodeMasterListFilters } from '@/shared/types/sacCodeMaster'
import { SAC_CATEGORY_OPTIONS } from '../config/sacCategoryOptions'

export const EMPTY_SAC_CODE_LIST_FILTERS: SacCodeMasterListFilters = {
  category: 'all',
}

export interface SacCodeAdvancedFilterFieldsProps {
  draft: SacCodeMasterListFilters
  patch: (partial: Partial<SacCodeMasterListFilters>) => void
}

export function SacCodeAdvancedFilterFields({ draft, patch }: SacCodeAdvancedFilterFieldsProps) {
  return (
    <ListingFilterField label="Category">
      <Select
        placeholder="Select category"
        value={draft.category ?? 'all'}
        onChange={(value) =>
          patch({ category: value as SacCodeMasterListFilters['category'] })
        }
        options={[{ value: 'all', label: 'All categories' }, ...SAC_CATEGORY_OPTIONS]}
        size="sm"
        fullWidth
      />
    </ListingFilterField>
  )
}

export function hasSacCodeFiltersActive(filters: SacCodeMasterListFilters): boolean {
  return (filters.category ?? 'all') !== 'all'
}

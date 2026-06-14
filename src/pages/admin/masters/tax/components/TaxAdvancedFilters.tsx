import { Select } from '@/design-system/UIComponents'
import { ListingFilterField } from '@/design-system/listingFilterPopoverShell'
import type { TaxMasterListFilters } from '@/shared/types/taxMaster'
import { TDS_APPLICABLE_ON_OPTIONS } from '@/shared/services/taxMasterService'

export interface TaxAdvancedFilterFieldsProps {
  draft: TaxMasterListFilters
  patch: (partial: Partial<TaxMasterListFilters>) => void
}

export function TaxAdvancedFilterFields({ draft, patch }: TaxAdvancedFilterFieldsProps) {
  return (
    <ListingFilterField label="Applicable on">
      <Select
        placeholder="All applicability"
        value={draft.applicableOn === 'all' ? '' : (draft.applicableOn ?? '')}
        onChange={(value) =>
          patch({
            applicableOn: (value ? value : 'all') as TaxMasterListFilters['applicableOn'],
          })
        }
        options={TDS_APPLICABLE_ON_OPTIONS}
        size="sm"
        clearable
        fullWidth
      />
    </ListingFilterField>
  )
}

export function hasTaxFiltersActive(filters: TaxMasterListFilters): boolean {
  return Boolean(filters.applicableOn && filters.applicableOn !== 'all')
}

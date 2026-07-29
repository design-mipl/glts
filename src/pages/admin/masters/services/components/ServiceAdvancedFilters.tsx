import { Select } from '@/design-system/UIComponents'
import { ListingFilterField } from '@/design-system/listingFilterPopoverShell'
import type { ServiceMasterListFilters } from '@/shared/types/serviceMaster'
import { MASTER_STATUS_FILTER_OPTIONS } from '../../config/masterStatusConfig'

export const EMPTY_SERVICE_LIST_FILTERS: ServiceMasterListFilters = {
  status: 'all',
}

export interface ServiceAdvancedFilterFieldsProps {
  draft: ServiceMasterListFilters
  patch: (partial: Partial<ServiceMasterListFilters>) => void
}

export function ServiceAdvancedFilterFields({ draft, patch }: ServiceAdvancedFilterFieldsProps) {
  return (
    <ListingFilterField label="Status">
      <Select
        placeholder="Select status"
        value={draft.status ?? 'all'}
        onChange={(value) =>
          patch({ status: value as ServiceMasterListFilters['status'] })
        }
        options={[...MASTER_STATUS_FILTER_OPTIONS]}
        size="sm"
        fullWidth
      />
    </ListingFilterField>
  )
}

export function hasServiceFiltersActive(filters: ServiceMasterListFilters): boolean {
  return (filters.status ?? 'all') !== 'all'
}

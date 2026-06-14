import { Select } from '@/design-system/UIComponents'
import { ListingFilterField } from '@/design-system/listingFilterPopoverShell'
import type { ServiceMasterListFilters } from '@/shared/types/serviceMaster'
import { SERVICE_TYPE_OPTIONS } from '../config/serviceTypeConfig'

export interface ServiceAdvancedFilterFieldsProps {
  draft: ServiceMasterListFilters
  patch: (partial: Partial<ServiceMasterListFilters>) => void
}

export function ServiceAdvancedFilterFields({ draft, patch }: ServiceAdvancedFilterFieldsProps) {
  return (
    <ListingFilterField label="Service type">
      <Select
        placeholder="Select service type"
        value={draft.serviceType ?? 'all'}
        onChange={(value) =>
          patch({ serviceType: value as ServiceMasterListFilters['serviceType'] })
        }
        options={[{ value: 'all', label: 'All types' }, ...SERVICE_TYPE_OPTIONS]}
        size="sm"
        fullWidth
      />
    </ListingFilterField>
  )
}

export function hasServiceFiltersActive(filters: ServiceMasterListFilters): boolean {
  return (filters.serviceType ?? 'all') !== 'all'
}

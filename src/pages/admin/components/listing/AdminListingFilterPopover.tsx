import { ListingFilterPopoverShell } from '@/design-system/listingFilterPopoverShell'
import type { AdminListingFilterState } from './AdminListingAdvancedFilters'
import {
  AdminListingStandardFilterFields,
  hasAdminListingStandardFiltersActive,
} from './AdminListingStandardFilterFields'

export interface AdminListingFilterPopoverProps {
  open: boolean
  anchorEl: HTMLElement | null
  onClose: () => void
  filters: AdminListingFilterState
  onApply: (filters: AdminListingFilterState) => void
  onClear: () => void
  countries: string[]
  statuses: string[]
  priorities: string[]
}

export function AdminListingFilterPopover({
  open,
  anchorEl,
  onClose,
  filters,
  onApply,
  onClear,
  countries,
  statuses,
  priorities,
}: AdminListingFilterPopoverProps) {
  return (
    <ListingFilterPopoverShell
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      value={filters}
      onApply={onApply}
      onClear={onClear}
      hasActive={hasAdminListingStandardFiltersActive}
      children={(draft, patch) => (
        <AdminListingStandardFilterFields
          draft={draft}
          patch={patch}
          countries={countries}
          statuses={statuses}
          priorities={priorities}
        />
      )}
    />
  )
}

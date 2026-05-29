import { Box } from '@mui/material'
import { Button, Select } from '@/design-system/UIComponents'

export interface AdminListingFilterState {
  country: string
  status: string
  priority: string
}

export const EMPTY_ADMIN_LISTING_FILTERS: AdminListingFilterState = {
  country: '',
  status: '',
  priority: '',
}

interface AdminListingAdvancedFiltersProps {
  filters: AdminListingFilterState
  onFiltersChange: (filters: AdminListingFilterState) => void
  onClearFilters: () => void
  countries: string[]
  statuses: string[]
  priorities: string[]
  hasActiveFilters: boolean
}

export function AdminListingAdvancedFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  countries,
  statuses,
  priorities,
  hasActiveFilters,
}: AdminListingAdvancedFiltersProps) {
  const patch = (partial: Partial<AdminListingFilterState>) => onFiltersChange({ ...filters, ...partial })

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
          gap: 1.5,
        }}
      >
        <Select
          value={filters.country}
          onChange={(value) => patch({ country: String(value) })}
          options={countries.map((c) => ({ value: c, label: c }))}
          placeholder="All countries"
          size="sm"
          clearable
          fullWidth
        />
        <Select
          value={filters.status}
          onChange={(value) => patch({ status: String(value) })}
          options={statuses.map((s) => ({ value: s, label: s }))}
          placeholder="All statuses"
          size="sm"
          clearable
          fullWidth
        />
        <Select
          value={filters.priority}
          onChange={(value) => patch({ priority: String(value) })}
          options={priorities.map((p) => ({ value: p, label: p }))}
          placeholder="All priorities"
          size="sm"
          clearable
          fullWidth
        />
      </Box>
      {hasActiveFilters && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button label="Clear filters" variant="text" size="sm" onClick={onClearFilters} />
        </Box>
      )}
    </Box>
  )
}

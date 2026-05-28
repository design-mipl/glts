import { Box, Button } from '@mui/material'
import { Select } from '@/design-system/UIComponents'

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
          label="Country"
          value={filters.country}
          onChange={(value) => patch({ country: String(value) })}
          options={[{ value: '', label: 'All countries' }, ...countries.map((c) => ({ value: c, label: c }))]}
          size="sm"
          clearable
        />
        <Select
          label="Status"
          value={filters.status}
          onChange={(value) => patch({ status: String(value) })}
          options={[{ value: '', label: 'All statuses' }, ...statuses.map((s) => ({ value: s, label: s }))]}
          size="sm"
          clearable
        />
        <Select
          label="Priority"
          value={filters.priority}
          onChange={(value) => patch({ priority: String(value) })}
          options={[{ value: '', label: 'All priorities' }, ...priorities.map((p) => ({ value: p, label: p }))]}
          size="sm"
          clearable
        />
      </Box>
      {hasActiveFilters && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button size="small" variant="text" onClick={onClearFilters} sx={{ fontWeight: 600 }}>
            Clear filters
          </Button>
        </Box>
      )}
    </Box>
  )
}

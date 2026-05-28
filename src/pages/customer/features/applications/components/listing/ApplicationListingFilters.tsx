import { Box, Button } from '@mui/material'
import { Select } from '@/design-system/UIComponents'
import type { ApplicationListingFilterState } from '../../types/applicationListing.types'
import type { ApplicationRecordType } from '../../types/applicationListing.types'
import { APPLICATION_OPERATIONAL_STATUSES, PROCESSING_STAGE_OPTIONS } from './applicationStatus'

interface ApplicationListingFiltersProps {
  filters: ApplicationListingFilterState
  onFiltersChange: (filters: ApplicationListingFilterState) => void
  onClearFilters: () => void
  countries: string[]
  visaTypes: string[]
  hasActiveFilters: boolean
}

export function ApplicationListingFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  countries,
  visaTypes,
  hasActiveFilters,
}: ApplicationListingFiltersProps) {
  const patch = (partial: Partial<ApplicationListingFilterState>) => onFiltersChange({ ...filters, ...partial })

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(5, 1fr)',
          },
          gap: 1.5,
        }}
      >
        <Select
          label="Application type"
          value={filters.applicationType}
          onChange={v => patch({ applicationType: String(v) as ApplicationRecordType | '' })}
          options={[
            { value: '', label: 'All types' },
            { value: 'single', label: 'Single' },
            { value: 'bulk', label: 'Bulk' },
          ]}
          size="sm"
          clearable
        />
        <Select
          label="Country"
          value={filters.country}
          onChange={v => patch({ country: String(v) })}
          options={[{ value: '', label: 'All countries' }, ...countries.map(c => ({ value: c, label: c }))]}
          size="sm"
          clearable
        />
        <Select
          label="Visa type"
          value={filters.visaType}
          onChange={v => patch({ visaType: String(v) })}
          options={[{ value: '', label: 'All visa types' }, ...visaTypes.map(v => ({ value: v, label: v }))]}
          size="sm"
          clearable
        />
        <Select
          label="Status"
          value={filters.status}
          onChange={v => patch({ status: String(v) })}
          options={[
            { value: '', label: 'All statuses' },
            ...APPLICATION_OPERATIONAL_STATUSES.map(s => ({ value: s, label: s })),
          ]}
          size="sm"
          clearable
        />
        <Select
          label="Processing stage"
          value={filters.processingStage}
          onChange={v => patch({ processingStage: String(v) })}
          options={PROCESSING_STAGE_OPTIONS}
          size="sm"
          clearable
        />
      </Box>
      {hasActiveFilters && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button size="small" variant="text" onClick={onClearFilters} sx={{ fontSize: 13, fontWeight: 600 }}>
            Clear filters
          </Button>
        </Box>
      )}
    </Box>
  )
}

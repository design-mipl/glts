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
  createdByOptions: { value: string; label: string }[]
  showCreatedByFilter?: boolean
  hasActiveFilters: boolean
}

const PROCESSING_STAGES = PROCESSING_STAGE_OPTIONS.filter(opt => opt.value !== '')

export function ApplicationListingFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  countries,
  visaTypes,
  createdByOptions,
  showCreatedByFilter = true,
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
          },
          gap: 1.5,
        }}
      >
        <Select
          value={filters.applicationType}
          onChange={v => patch({ applicationType: String(v) as ApplicationRecordType | '' })}
          options={[
            { value: 'single', label: 'Single' },
            { value: 'bulk', label: 'Bulk' },
          ]}
          placeholder="All types"
          size="sm"
          clearable
          fullWidth
        />
        <Select
          value={filters.country}
          onChange={v => patch({ country: String(v) })}
          options={countries.map(c => ({ value: c, label: c }))}
          placeholder="All countries"
          size="sm"
          clearable
          fullWidth
        />
        <Select
          value={filters.visaType}
          onChange={v => patch({ visaType: String(v) })}
          options={visaTypes.map(v => ({ value: v, label: v }))}
          placeholder="All visa types"
          size="sm"
          clearable
          fullWidth
        />
        <Select
          value={filters.status}
          onChange={v => patch({ status: String(v) })}
          options={APPLICATION_OPERATIONAL_STATUSES.map(s => ({ value: s, label: s }))}
          placeholder="All statuses"
          size="sm"
          clearable
          fullWidth
        />
        <Select
          value={filters.processingStage}
          onChange={v => patch({ processingStage: String(v) })}
          options={PROCESSING_STAGES}
          placeholder="All stages"
          size="sm"
          clearable
          fullWidth
        />
        {showCreatedByFilter && (
          <Select
            value={filters.createdBy}
            onChange={v => patch({ createdBy: String(v) })}
            options={createdByOptions}
            placeholder="All creators"
            size="sm"
            clearable
            fullWidth
          />
        )}
      </Box>
      {hasActiveFilters && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="text" onClick={onClearFilters} sx={{ fontSize: 13, fontWeight: 600 }}>
            Clear filters
          </Button>
        </Box>
      )}
    </Box>
  )
}

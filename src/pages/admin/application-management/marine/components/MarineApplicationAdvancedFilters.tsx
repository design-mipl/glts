import { Box } from '@mui/material'
import { Button, Select } from '@/design-system/UIComponents'
import type {
  ApplicationListingFilterState,
  ApplicationRecordType,
} from '@/pages/customer/features/applications/types/applicationListing.types'
import { PROCESSING_STAGE_OPTIONS } from '@/pages/customer/features/applications/components/listing/applicationStatus'

/** Admin-visible statuses — same labels as customer portal, excluding Draft. */
const ADMIN_STATUS_OPTIONS = [
  'Pending Documents',
  'Verification Pending',
  'Under Review',
  'Submitted',
  'Correction Required',
  'Passport Ready',
  'Completed',
  'Rejected',
] as const

const ADMIN_PROCESSING_STAGES = PROCESSING_STAGE_OPTIONS.filter(
  opt =>
    opt.value !== '' &&
    opt.value !== 'Intake' &&
    opt.value !== 'Closed',
)

interface MarineApplicationAdvancedFiltersProps {
  filters: ApplicationListingFilterState
  onFiltersChange: (filters: ApplicationListingFilterState) => void
  onClearFilters: () => void
  countries: string[]
  visaTypes: string[]
  createdByOptions: { value: string; label: string }[]
  hasActiveFilters: boolean
}

export function MarineApplicationAdvancedFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  countries,
  visaTypes,
  createdByOptions,
  hasActiveFilters,
}: MarineApplicationAdvancedFiltersProps) {
  const patch = (partial: Partial<ApplicationListingFilterState>) =>
    onFiltersChange({ ...filters, ...partial })

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
          options={ADMIN_STATUS_OPTIONS.map(s => ({ value: s, label: s }))}
          placeholder="All statuses"
          size="sm"
          clearable
          fullWidth
        />
        <Select
          value={filters.processingStage}
          onChange={v => patch({ processingStage: String(v) })}
          options={ADMIN_PROCESSING_STAGES}
          placeholder="All stages"
          size="sm"
          clearable
          fullWidth
        />
        <Select
          value={filters.createdBy}
          onChange={v => patch({ createdBy: String(v) })}
          options={createdByOptions}
          placeholder="All creators"
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

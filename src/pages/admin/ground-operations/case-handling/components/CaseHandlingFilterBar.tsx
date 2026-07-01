import { Box } from '@mui/material'
import { Input, Select } from '@/design-system/UIComponents'
import { ListingFilterField } from '@/design-system/listingFilterPopoverShell'
import { listingToolbarFiltersContainerSx } from '@/design-system/listingToolbarChrome'
import type {
  OperationalDateFilterPreset,
  OperationsDeskFilters,
} from '@/shared/types/operationalCaseHandling'
import { DATE_FILTER_OPTIONS } from '../utils/operationalCaseHandlingUtils'

interface FilterOptions {
  statuses: string[]
  priorities: string[]
  cityTeams: string[]
  executives: string[]
  countries: string[]
  jurisdictions: string[]
  applications: string[]
}

function DateFilterFields({
  datePreset,
  customDateFrom,
  customDateTo,
  onDatePresetChange,
  onCustomFromChange,
  onCustomToChange,
}: {
  datePreset: OperationalDateFilterPreset
  customDateFrom?: string
  customDateTo?: string
  onDatePresetChange: (preset: OperationalDateFilterPreset) => void
  onCustomFromChange: (value: string) => void
  onCustomToChange: (value: string) => void
}) {
  return (
    <>
      <ListingFilterField label="Operational date">
        <Select
          value={datePreset}
          onChange={(value) => onDatePresetChange(String(value) as OperationalDateFilterPreset)}
          options={DATE_FILTER_OPTIONS}
          placeholder="Date"
          size="sm"
          fullWidth
        />
      </ListingFilterField>
      {datePreset === 'custom' ? (
        <Box sx={listingToolbarFiltersContainerSx()}>
          <ListingFilterField label="From">
            <Input
              type="date"
              size="sm"
              value={customDateFrom ?? ''}
              onChange={onCustomFromChange}
              placeholder="From"
            />
          </ListingFilterField>
          <ListingFilterField label="To">
            <Input
              type="date"
              size="sm"
              value={customDateTo ?? ''}
              onChange={onCustomToChange}
              placeholder="To"
            />
          </ListingFilterField>
        </Box>
      ) : null}
    </>
  )
}

export interface OperationsDeskFilterFieldsProps {
  draft: OperationsDeskFilters
  patch: (partial: Partial<OperationsDeskFilters>) => void
  options: FilterOptions
  hideStatusFilter?: boolean
}

export function OperationsDeskFilterFields({
  draft,
  patch,
  options,
  hideStatusFilter = false,
}: OperationsDeskFilterFieldsProps) {
  return (
    <>
      <DateFilterFields
        datePreset={draft.datePreset}
        customDateFrom={draft.customDateFrom}
        customDateTo={draft.customDateTo}
        onDatePresetChange={(preset) => patch({ datePreset: preset })}
        onCustomFromChange={(value) => patch({ customDateFrom: value })}
        onCustomToChange={(value) => patch({ customDateTo: value })}
      />
      <ListingFilterField label="Batch / Application">
        <Select
          value={draft.applicationId}
          onChange={(value) => patch({ applicationId: String(value) })}
          options={options.applications.map((id) => ({ value: id, label: id }))}
          placeholder="All applications"
          size="sm"
          clearable
          fullWidth
        />
      </ListingFilterField>
      {!hideStatusFilter ? (
        <ListingFilterField label="Status">
          <Select
            value={draft.status}
            onChange={(value) => patch({ status: String(value) })}
            options={options.statuses.map((s) => ({ value: s, label: s }))}
            placeholder="All statuses"
            size="sm"
            clearable
            fullWidth
          />
        </ListingFilterField>
      ) : null}
      <ListingFilterField label="Team">
        <Select
          value={draft.team}
          onChange={(value) => patch({ team: String(value) })}
          options={options.cityTeams.map((t) => ({ value: t, label: t }))}
          placeholder="All teams"
          size="sm"
          clearable
          fullWidth
        />
      </ListingFilterField>
      <ListingFilterField label="Executive">
        <Select
          value={draft.executive}
          onChange={(value) => patch({ executive: String(value) })}
          options={options.executives.map((e) => ({ value: e, label: e }))}
          placeholder="All executives"
          size="sm"
          clearable
          fullWidth
        />
      </ListingFilterField>
      <ListingFilterField label="Priority">
        <Select
          value={draft.priority}
          onChange={(value) => patch({ priority: String(value) })}
          options={options.priorities.map((p) => ({ value: p, label: p }))}
          placeholder="All priorities"
          size="sm"
          clearable
          fullWidth
        />
      </ListingFilterField>
      <ListingFilterField label="Visa country">
        <Select
          value={draft.visaCountry}
          onChange={(value) => patch({ visaCountry: String(value) })}
          options={options.countries.map((c) => ({ value: c, label: c }))}
          placeholder="All countries"
          size="sm"
          clearable
          fullWidth
        />
      </ListingFilterField>
      <ListingFilterField label="Jurisdiction">
        <Select
          value={draft.jurisdiction}
          onChange={(value) => patch({ jurisdiction: String(value) })}
          options={options.jurisdictions.map((j) => ({ value: j, label: j }))}
          placeholder="All jurisdictions"
          size="sm"
          clearable
          fullWidth
        />
      </ListingFilterField>
      <Box sx={listingToolbarFiltersContainerSx()}>
        <ListingFilterField label="Joining from">
          <Input
            type="date"
            size="sm"
            value={draft.joiningDateFrom}
            onChange={(value) => patch({ joiningDateFrom: value })}
            placeholder="From"
          />
        </ListingFilterField>
        <ListingFilterField label="Joining to">
          <Input
            type="date"
            size="sm"
            value={draft.joiningDateTo}
            onChange={(value) => patch({ joiningDateTo: value })}
            placeholder="To"
          />
        </ListingFilterField>
      </Box>
    </>
  )
}

export function hasOperationsDeskFiltersActive(
  filters: OperationsDeskFilters,
  options?: { ignoreStatus?: boolean },
): boolean {
  return (
    (!options?.ignoreStatus && Boolean(filters.status)) ||
    Boolean(filters.team) ||
    Boolean(filters.executive) ||
    Boolean(filters.priority) ||
    Boolean(filters.visaCountry) ||
    Boolean(filters.jurisdiction) ||
    Boolean(filters.applicationId) ||
    Boolean(filters.joiningDateFrom) ||
    Boolean(filters.joiningDateTo) ||
    filters.datePreset !== 'today'
  )
}

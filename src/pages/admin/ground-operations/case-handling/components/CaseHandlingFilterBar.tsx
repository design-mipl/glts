import { Box, Stack } from '@mui/material'
import { Button, Input, Select } from '@/design-system/UIComponents'
import type {
  OperationalCaseListFilters,
  OperationalDateFilterPreset,
  OperationsDeskFilters,
} from '@/shared/types/operationalCaseHandling'
import { DATE_FILTER_OPTIONS } from '../utils/operationalCaseHandlingUtils'

interface FilterOptions {
  countries: string[]
  statuses: string[]
  priorities: string[]
  cityTeams: string[]
}

interface PriorityQueueFilterBarProps {
  variant: 'priority_queue'
  filters: OperationalCaseListFilters
  onFiltersChange: (filters: OperationalCaseListFilters) => void
  options: FilterOptions
  onClear: () => void
  hasActiveFilters: boolean
}

interface OperationsDeskFilterBarProps {
  variant: 'operations_desk'
  filters: OperationsDeskFilters
  onFiltersChange: (filters: OperationsDeskFilters) => void
  options: Pick<FilterOptions, 'statuses' | 'cityTeams'>
  onClear: () => void
  hasActiveFilters: boolean
}

type CaseHandlingFilterBarProps = PriorityQueueFilterBarProps | OperationsDeskFilterBarProps

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
      <Select
        value={datePreset}
        onChange={value => onDatePresetChange(String(value) as OperationalDateFilterPreset)}
        options={DATE_FILTER_OPTIONS}
        placeholder="Date"
        size="sm"
        fullWidth
      />
      {datePreset === 'custom' ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 1,
            gridColumn: { md: 'span 2' },
          }}
        >
          <Input
            type="date"
            size="sm"
            value={customDateFrom ?? ''}
            onChange={onCustomFromChange}
            placeholder="From"
          />
          <Input
            type="date"
            size="sm"
            value={customDateTo ?? ''}
            onChange={onCustomToChange}
            placeholder="To"
          />
        </Box>
      ) : null}
    </>
  )
}

export function CaseHandlingFilterBar(props: CaseHandlingFilterBarProps) {
  if (props.variant === 'operations_desk') {
    const { filters, onFiltersChange, options, onClear, hasActiveFilters } = props
    return (
      <Stack spacing={1}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)',
            },
            gap: 1,
          }}
        >
          <DateFilterFields
            datePreset={filters.datePreset}
            customDateFrom={filters.customDateFrom}
            customDateTo={filters.customDateTo}
            onDatePresetChange={preset => onFiltersChange({ ...filters, datePreset: preset })}
            onCustomFromChange={value => onFiltersChange({ ...filters, customDateFrom: value })}
            onCustomToChange={value => onFiltersChange({ ...filters, customDateTo: value })}
          />
          <Select
            value={filters.status}
            onChange={value => onFiltersChange({ ...filters, status: String(value) })}
            options={options.statuses.map(s => ({ value: s, label: s }))}
            placeholder="All statuses"
            size="sm"
            clearable
            fullWidth
          />
          <Select
            value={filters.team}
            onChange={value => onFiltersChange({ ...filters, team: String(value) })}
            options={options.cityTeams.map(t => ({ value: t, label: t }))}
            placeholder="All teams"
            size="sm"
            clearable
            fullWidth
          />
        </Box>
        {hasActiveFilters && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button label="Clear filters" variant="text" size="sm" onClick={onClear} />
          </Box>
        )}
      </Stack>
    )
  }

  const { filters, onFiltersChange, options, onClear, hasActiveFilters } = props

  return (
    <Stack spacing={1}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)',
            lg: 'repeat(4, 1fr)',
          },
          gap: 1,
        }}
      >
        <DateFilterFields
          datePreset={filters.datePreset}
          customDateFrom={filters.customDateFrom}
          customDateTo={filters.customDateTo}
          onDatePresetChange={preset => onFiltersChange({ ...filters, datePreset: preset })}
          onCustomFromChange={value => onFiltersChange({ ...filters, customDateFrom: value })}
          onCustomToChange={value => onFiltersChange({ ...filters, customDateTo: value })}
        />
        <Select
          value={filters.priority}
          onChange={value => onFiltersChange({ ...filters, priority: String(value) })}
          options={options.priorities.map(p => ({ value: p, label: p }))}
          placeholder="All priorities"
          size="sm"
          clearable
          fullWidth
        />
        <Select
          value={filters.cityTeam}
          onChange={value => onFiltersChange({ ...filters, cityTeam: String(value) })}
          options={options.cityTeams.map(t => ({ value: t, label: t }))}
          placeholder="All city teams"
          size="sm"
          clearable
          fullWidth
        />
        <Select
          value={filters.country}
          onChange={value => onFiltersChange({ ...filters, country: String(value) })}
          options={options.countries.map(c => ({ value: c, label: c }))}
          placeholder="All countries"
          size="sm"
          clearable
          fullWidth
        />
      </Box>
      {hasActiveFilters && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button label="Clear filters" variant="text" size="sm" onClick={onClear} />
        </Box>
      )}
    </Stack>
  )
}

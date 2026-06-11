import { Box, Stack } from '@mui/material'
import { Button, Input, Select } from '@/design-system/UIComponents'
import type {
  AssignmentQueueFilters,
  OperationalDateFilterPreset,
} from '@/shared/types/operationalPassengerAssignment'
import { ASSIGNMENT_PRIORITY_OPTIONS } from '../config/assignmentPriorityConfig'
import { PASSENGER_STATUS_OPTIONS } from '../config/assignmentStatusConfig'
import { DATE_FILTER_OPTIONS } from '../utils/assignmentQueueListingUtils'

interface AssignmentAdvancedFiltersProps {
  filters: AssignmentQueueFilters
  onFiltersChange: (filters: AssignmentQueueFilters) => void
  options: {
    jurisdictions: string[]
    teams: string[]
    users: string[]
  }
  onClear: () => void
  hasActiveFilters: boolean
}

export function AssignmentAdvancedFilters({
  filters,
  onFiltersChange,
  options,
  onClear,
  hasActiveFilters,
}: AssignmentAdvancedFiltersProps) {
  const update = (partial: Partial<AssignmentQueueFilters>) => {
    onFiltersChange({ ...filters, ...partial })
  }

  return (
    <Stack spacing={1}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(6, 1fr)',
          },
          gap: 1,
        }}
      >
        <Select
          value={filters.datePreset}
          onChange={value => update({ datePreset: String(value) as OperationalDateFilterPreset })}
          options={[...DATE_FILTER_OPTIONS]}
          placeholder="Date"
          size="sm"
          fullWidth
        />
        {filters.datePreset === 'custom' ? (
          <>
            <Input
              type="date"
              size="sm"
              value={filters.customDateFrom ?? ''}
              onChange={v => update({ customDateFrom: v })}
              placeholder="From"
            />
            <Input
              type="date"
              size="sm"
              value={filters.customDateTo ?? ''}
              onChange={v => update({ customDateTo: v })}
              placeholder="To"
            />
          </>
        ) : null}
        <Select
          value={filters.jurisdiction}
          onChange={value => update({ jurisdiction: String(value) })}
          options={[
            { value: '', label: 'All jurisdictions' },
            ...options.jurisdictions.map(j => ({ value: j, label: j })),
          ]}
          placeholder="Jurisdiction"
          size="sm"
          fullWidth
        />
        <Select
          value={filters.team}
          onChange={value => update({ team: String(value) })}
          options={[
            { value: '', label: 'All teams' },
            ...options.teams.map(t => ({ value: t, label: t })),
          ]}
          placeholder="Team"
          size="sm"
          fullWidth
        />
        <Select
          value={filters.assignedUser}
          onChange={value => update({ assignedUser: String(value) })}
          options={[
            { value: '', label: 'All users' },
            ...options.users.map(u => ({ value: u, label: u })),
          ]}
          placeholder="Assigned user"
          size="sm"
          fullWidth
        />
        <Select
          value={filters.priority}
          onChange={value => update({ priority: String(value) })}
          options={[{ value: '', label: 'All priorities' }, ...ASSIGNMENT_PRIORITY_OPTIONS]}
          placeholder="Priority"
          size="sm"
          fullWidth
        />
        <Select
          value={filters.status}
          onChange={value => update({ status: String(value) })}
          options={[{ value: '', label: 'All statuses' }, ...PASSENGER_STATUS_OPTIONS]}
          placeholder="Status"
          size="sm"
          fullWidth
        />
      </Box>
      {hasActiveFilters ? (
        <Box>
          <Button label="Clear filters" variant="text" size="sm" onClick={onClear} />
        </Box>
      ) : null}
    </Stack>
  )
}

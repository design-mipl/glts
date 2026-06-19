import { Input, Select } from '@/design-system/UIComponents'
import { ListingFilterField } from '@/design-system/listingFilterPopoverShell'
import type {
  AssignmentQueueFilters,
  OperationalDateFilterPreset,
} from '@/shared/types/operationalPassengerAssignment'
import { ASSIGNMENT_PRIORITY_OPTIONS } from '../config/assignmentPriorityConfig'
import { PASSENGER_STATUS_OPTIONS } from '../config/assignmentStatusConfig'
import {
  ASSIGNMENT_SLA_FILTER_OPTIONS,
  DATE_FILTER_OPTIONS,
} from '../utils/assignmentQueueListingUtils'

export interface AssignmentAdvancedFilterFieldsProps {
  draft: AssignmentQueueFilters
  patch: (partial: Partial<AssignmentQueueFilters>) => void
  options: {
    jurisdictions: string[]
    teams: string[]
    users: string[]
    countries: string[]
    visaTypes: string[]
  }
  extendedFilters?: boolean
}

export function AssignmentAdvancedFilterFields({
  draft,
  patch,
  options,
  extendedFilters = false,
}: AssignmentAdvancedFilterFieldsProps) {
  return (
    <>
      <ListingFilterField label="Date">
        <Select
          value={draft.datePreset}
          onChange={(value) => patch({ datePreset: String(value) as OperationalDateFilterPreset })}
          options={[...DATE_FILTER_OPTIONS]}
          placeholder="Date"
          size="sm"
          fullWidth
        />
      </ListingFilterField>
      {draft.datePreset === 'custom' ? (
        <>
          <ListingFilterField label="From">
            <Input
              type="date"
              size="sm"
              value={draft.customDateFrom ?? ''}
              onChange={(v) => patch({ customDateFrom: v })}
              placeholder="From"
            />
          </ListingFilterField>
          <ListingFilterField label="To">
            <Input
              type="date"
              size="sm"
              value={draft.customDateTo ?? ''}
              onChange={(v) => patch({ customDateTo: v })}
              placeholder="To"
            />
          </ListingFilterField>
        </>
      ) : null}
      <ListingFilterField label="Priority">
        <Select
          value={draft.priority}
          onChange={(value) => patch({ priority: String(value) })}
          options={[{ value: '', label: 'All priorities' }, ...ASSIGNMENT_PRIORITY_OPTIONS]}
          placeholder="Priority"
          size="sm"
          fullWidth
        />
      </ListingFilterField>
      <ListingFilterField label="Country">
        <Select
          value={draft.country}
          onChange={(value) => patch({ country: String(value) })}
          options={[
            { value: '', label: 'All countries' },
            ...options.countries.map((c) => ({ value: c, label: c })),
          ]}
          placeholder="Country"
          size="sm"
          fullWidth
        />
      </ListingFilterField>
      {extendedFilters ? (
        <ListingFilterField label="Visa type">
          <Select
            value={draft.visaType}
            onChange={(value) => patch({ visaType: String(value) })}
            options={[
              { value: '', label: 'All visa types' },
              ...options.visaTypes.map((v) => ({ value: v, label: v })),
            ]}
            placeholder="Visa type"
            size="sm"
            fullWidth
          />
        </ListingFilterField>
      ) : null}
      <ListingFilterField label="Jurisdiction">
        <Select
          value={draft.jurisdiction}
          onChange={(value) => patch({ jurisdiction: String(value) })}
          options={[
            { value: '', label: 'All jurisdictions' },
            ...options.jurisdictions.map((j) => ({ value: j, label: j })),
          ]}
          placeholder="Jurisdiction"
          size="sm"
          fullWidth
        />
      </ListingFilterField>
      <ListingFilterField label="Team">
        <Select
          value={draft.team}
          onChange={(value) => patch({ team: String(value) })}
          options={[
            { value: '', label: 'All teams' },
            ...options.teams.map((t) => ({ value: t, label: t })),
          ]}
          placeholder="Team"
          size="sm"
          fullWidth
        />
      </ListingFilterField>
      <ListingFilterField label="Assigned user">
        <Select
          value={draft.assignedUser}
          onChange={(value) => patch({ assignedUser: String(value) })}
          options={[
            { value: '', label: 'All users' },
            ...options.users.map((u) => ({ value: u, label: u })),
          ]}
          placeholder="Assigned user"
          size="sm"
          fullWidth
        />
      </ListingFilterField>
      {extendedFilters ? (
        <>
          <ListingFilterField label="Status">
            <Select
              value={draft.status}
              onChange={(value) => patch({ status: String(value) })}
              options={[{ value: '', label: 'All statuses' }, ...PASSENGER_STATUS_OPTIONS]}
              placeholder="Status"
              size="sm"
              fullWidth
            />
          </ListingFilterField>
          <ListingFilterField label="SLA">
            <Select
              value={draft.sla}
              onChange={(value) => patch({ sla: String(value) })}
              options={[{ value: '', label: 'All SLA states' }, ...ASSIGNMENT_SLA_FILTER_OPTIONS]}
              placeholder="SLA"
              size="sm"
              fullWidth
            />
          </ListingFilterField>
        </>
      ) : null}
    </>
  )
}

export function hasAssignmentQueueFiltersActive(
  filters: AssignmentQueueFilters,
  extendedFilters = false,
): boolean {
  const base =
    Boolean(filters.jurisdiction) ||
    Boolean(filters.team) ||
    Boolean(filters.assignedUser) ||
    Boolean(filters.priority) ||
    Boolean(filters.country) ||
    filters.datePreset !== 'today'

  if (!extendedFilters) return base

  return (
    base ||
    Boolean(filters.visaType) ||
    Boolean(filters.status) ||
    Boolean(filters.sla)
  )
}

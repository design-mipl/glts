import { DatePicker, Select } from '@/design-system/UIComponents'
import { ListingFilterField } from '@/design-system/listingFilterPopoverShell'
import { APPLICATION_CUSTOMER_SEGMENT_OPTIONS } from '@/shared/config/applicationCustomerSegmentConfig'
import type { FundAllocationQueueFilters } from '@/shared/types/fundAllocation'
import {
  formatFundAllocationFilterDate,
  parseFundAllocationFilterDate,
} from '../utils/fundAllocationListingUtils'

export interface FundAllocationAdvancedFilterFieldsProps {
  draft: FundAllocationQueueFilters
  patch: (partial: Partial<FundAllocationQueueFilters>) => void
  options: {
    countries: string[]
    visaTypes: string[]
    jurisdictions: string[]
    teams: string[]
    users: Array<{ value: string; label: string; team: string }>
  }
}

export function hasFundAllocationFiltersActive(filters: FundAllocationQueueFilters): boolean {
  return Boolean(
    filters.customerSegment ||
      filters.country ||
      filters.visaType ||
      filters.jurisdiction ||
      filters.assignedTeam ||
      filters.assignedUser ||
      filters.dateFrom ||
      filters.dateTo,
  )
}

export function FundAllocationAdvancedFilterFields({
  draft,
  patch,
  options,
}: FundAllocationAdvancedFilterFieldsProps) {
  return (
    <>
      <ListingFilterField label="Customer type">
        <Select
          value={draft.customerSegment}
          onChange={value => patch({ customerSegment: String(value) })}
          options={[{ value: '', label: 'All customer types' }, ...APPLICATION_CUSTOMER_SEGMENT_OPTIONS]}
          placeholder="Customer type"
          size="sm"
          fullWidth
        />
      </ListingFilterField>
      <ListingFilterField label="Country">
        <Select
          value={draft.country}
          onChange={value => patch({ country: String(value) })}
          options={[
            { value: '', label: 'All countries' },
            ...options.countries.map(country => ({ value: country, label: country })),
          ]}
          placeholder="Country"
          size="sm"
          fullWidth
        />
      </ListingFilterField>
      <ListingFilterField label="Visa type">
        <Select
          value={draft.visaType}
          onChange={value => patch({ visaType: String(value) })}
          options={[
            { value: '', label: 'All visa types' },
            ...options.visaTypes.map(visaType => ({ value: visaType, label: visaType })),
          ]}
          placeholder="Visa type"
          size="sm"
          fullWidth
        />
      </ListingFilterField>
      <ListingFilterField label="Jurisdiction">
        <Select
          value={draft.jurisdiction}
          onChange={value => patch({ jurisdiction: String(value) })}
          options={[
            { value: '', label: 'All jurisdictions' },
            ...options.jurisdictions.map(jurisdiction => ({ value: jurisdiction, label: jurisdiction })),
          ]}
          placeholder="Jurisdiction"
          size="sm"
          fullWidth
        />
      </ListingFilterField>
      <ListingFilterField label="Team">
        <Select
          value={draft.assignedTeam}
          onChange={value => patch({ assignedTeam: String(value), assignedUser: '' })}
          options={[
            { value: '', label: 'All teams' },
            ...options.teams.map(team => ({ value: team, label: team })),
          ]}
          placeholder="Team"
          size="sm"
          fullWidth
        />
      </ListingFilterField>
      <ListingFilterField label="User">
        <Select
          value={draft.assignedUser}
          onChange={value => patch({ assignedUser: String(value) })}
          options={[
            { value: '', label: 'All users' },
            ...options.users
              .filter(user => !draft.assignedTeam || user.team === draft.assignedTeam)
              .map(user => ({ value: user.value, label: user.label })),
          ]}
          placeholder="User"
          size="sm"
          fullWidth
        />
      </ListingFilterField>
      <ListingFilterField label="VFS submission from">
        <DatePicker
          value={parseFundAllocationFilterDate(draft.dateFrom)}
          onChange={from =>
            patch({
              dateFrom: formatFundAllocationFilterDate(from),
            })
          }
          placeholder="DD/MM/YYYY"
          size="sm"
          fullWidth
        />
      </ListingFilterField>
      <ListingFilterField label="VFS submission to">
        <DatePicker
          value={parseFundAllocationFilterDate(draft.dateTo)}
          onChange={to =>
            patch({
              dateTo: formatFundAllocationFilterDate(to),
            })
          }
          minDate={parseFundAllocationFilterDate(draft.dateFrom) ?? undefined}
          placeholder="DD/MM/YYYY"
          size="sm"
          fullWidth
        />
      </ListingFilterField>
    </>
  )
}

import { Select } from '@/design-system/UIComponents'
import { ListingFilterField } from '@/design-system/listingFilterPopoverShell'
import type {
  ApplicationDocumentRequirementFilter,
  ApplicationListingFilterState,
  ApplicationRecordType,
} from '@/pages/customer/features/applications/types/applicationListing.types'
import { PROCESSING_STAGE_OPTIONS } from '@/pages/customer/features/applications/components/listing/applicationStatus'

/** Admin-visible statuses — queue Status from Ops/Docs QC handoffs. */
const ADMIN_STATUS_OPTIONS = [
  'Pending Documents',
  'Verification Pending',
  'Ops · Correction Required',
  'Ops · Document Missing',
  'Docs · Correction Required',
  'Docs · Document Missing / Blocked',
  'Submission Pending',
  'Form Pending',
  'Pending Payment',
  'Embassy/VFS Submission Pending',
  'Under Review',
  'Submitted',
  'Correction Required',
  'Document Rejected',
  'Passport Ready',
  'Completed',
  'Rejected',
] as const

const ADMIN_PROCESSING_STAGES = PROCESSING_STAGE_OPTIONS.filter(
  (opt) =>
    opt.value !== '' &&
    opt.value !== 'Ready for submission' &&
    opt.value !== 'Delivered',
)

export interface B2bApplicationFilterOptions {
  countries: string[]
  visaTypes: string[]
  createdByOptions: { value: string; label: string }[]
}

export interface B2bApplicationAdvancedFilterFieldsProps {
  draft: ApplicationListingFilterState
  patch: (partial: Partial<ApplicationListingFilterState>) => void
  options: B2bApplicationFilterOptions
}

export function B2bApplicationAdvancedFilterFields({
  draft,
  patch,
  options,
}: B2bApplicationAdvancedFilterFieldsProps) {
  return (
    <>
      <ListingFilterField label="Application type">
        <Select
          value={draft.applicationType}
          onChange={(v) => patch({ applicationType: String(v) as ApplicationRecordType | '' })}
          options={[
            { value: 'single', label: 'Single' },
            { value: 'bulk', label: 'Bulk' },
          ]}
          placeholder="All types"
          size="sm"
          clearable
          fullWidth
        />
      </ListingFilterField>
      <ListingFilterField label="Documents">
        <Select
          value={draft.documentRequirement ?? ''}
          onChange={(v) =>
            patch({
              documentRequirement: (v ? String(v) : '') as ApplicationDocumentRequirementFilter,
            })
          }
          options={[
            { value: 'required', label: 'Docs required' },
            { value: 'not_required', label: 'Docs not required' },
          ]}
          placeholder="All document types"
          size="sm"
          clearable
          fullWidth
        />
      </ListingFilterField>
      <ListingFilterField label="Country">
        <Select
          value={draft.country}
          onChange={(v) => patch({ country: String(v) })}
          options={options.countries.map((c) => ({ value: c, label: c }))}
          placeholder="All countries"
          size="sm"
          clearable
          fullWidth
        />
      </ListingFilterField>
      <ListingFilterField label="Visa type">
        <Select
          value={draft.visaType}
          onChange={(v) => patch({ visaType: String(v) })}
          options={options.visaTypes.map((v) => ({ value: v, label: v }))}
          placeholder="All visa types"
          size="sm"
          clearable
          fullWidth
        />
      </ListingFilterField>
      <ListingFilterField label="Status">
        <Select
          value={draft.status}
          onChange={(v) => patch({ status: String(v) })}
          options={ADMIN_STATUS_OPTIONS.map((s) => ({ value: s, label: s }))}
          placeholder="All statuses"
          size="sm"
          clearable
          fullWidth
        />
      </ListingFilterField>
      <ListingFilterField label="Processing stage">
        <Select
          value={draft.processingStage}
          onChange={(v) => patch({ processingStage: String(v) })}
          options={ADMIN_PROCESSING_STAGES}
          placeholder="All stages"
          size="sm"
          clearable
          fullWidth
        />
      </ListingFilterField>
      <ListingFilterField label="Created by">
        <Select
          value={draft.createdBy}
          onChange={(v) => patch({ createdBy: String(v) })}
          options={options.createdByOptions}
          placeholder="All creators"
          size="sm"
          clearable
          fullWidth
        />
      </ListingFilterField>
    </>
  )
}

export function hasB2bApplicationFiltersActive(filters: ApplicationListingFilterState): boolean {
  return Boolean(
    filters.country ||
      filters.visaType ||
      filters.status ||
      filters.processingStage ||
      filters.applicationType ||
      filters.createdBy ||
      filters.documentRequirement,
  )
}

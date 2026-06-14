import { Input, Select } from '@/design-system/UIComponents'
import { ListingFilterField } from '@/design-system/listingFilterPopoverShell'
import { companyMasterService } from '@/shared/services/companyMasterService'
import type { AgreementAdvancedFilterState } from '../utils/agreementListingUtils'
import { AGREEMENT_WORKFLOW_OPTIONS } from '../config/agreementStatusConfig'

export interface AgreementAdvancedFilterFieldsProps {
  draft: AgreementAdvancedFilterState
  patch: (partial: Partial<AgreementAdvancedFilterState>) => void
}

export function AgreementAdvancedFilterFields({ draft, patch }: AgreementAdvancedFilterFieldsProps) {
  const companyOptions = companyMasterService.getSelectOptions()

  return (
    <>
      <ListingFilterField label="Agreement type">
        <Select
          value={draft.agreementType}
          onChange={(v) => patch({ agreementType: String(v) })}
          options={[
            { value: 'all', label: 'All agreement types' },
            { value: 'agreemented', label: 'Agreemented' },
            { value: 'non_agreemented', label: 'Non-agreemented' },
          ]}
          placeholder="Agreement type"
          size="sm"
          fullWidth
        />
      </ListingFilterField>
      <ListingFilterField label="Billing type">
        <Select
          value={draft.billingType}
          onChange={(v) => patch({ billingType: String(v) })}
          options={[
            { value: 'all', label: 'All billing types' },
            { value: 'advance', label: 'Advance' },
            { value: 'credit', label: 'Credit' },
            { value: 'mixed', label: 'Mixed' },
          ]}
          placeholder="Billing type"
          size="sm"
          fullWidth
        />
      </ListingFilterField>
      <ListingFilterField label="Workflow type">
        <Select
          value={draft.workflowType}
          onChange={(v) => patch({ workflowType: String(v) })}
          options={[
            { value: 'all', label: 'All workflow types' },
            ...AGREEMENT_WORKFLOW_OPTIONS,
          ]}
          placeholder="Workflow type"
          size="sm"
          fullWidth
        />
      </ListingFilterField>
      <ListingFilterField label="Status">
        <Select
          value={draft.status}
          onChange={(v) => patch({ status: String(v) })}
          options={[
            { value: 'all', label: 'All statuses' },
            { value: 'draft', label: 'Draft' },
            { value: 'submitted', label: 'Pending Approval' },
            { value: 'approved', label: 'Approved' },
            { value: 'rejected', label: 'Rejected' },
            { value: 'expired', label: 'Expired' },
            { value: 'inactive', label: 'Inactive' },
          ]}
          placeholder="Status"
          size="sm"
          fullWidth
        />
      </ListingFilterField>
      <ListingFilterField label="Company">
        <Select
          value={draft.companyId}
          onChange={(v) => patch({ companyId: String(v) })}
          options={[
            { value: 'all', label: 'All companies' },
            ...companyOptions.map((c) => ({ value: c.value, label: c.label })),
          ]}
          placeholder="Company"
          size="sm"
          fullWidth
        />
      </ListingFilterField>
      <ListingFilterField label="Entity name">
        <Input
          value={draft.entityName}
          onChange={(v) => patch({ entityName: v })}
          placeholder="Entity name"
          size="sm"
          fullWidth
        />
      </ListingFilterField>
      <ListingFilterField label="Updated from">
        <Input
          type="date"
          value={draft.dateFrom}
          onChange={(v) => patch({ dateFrom: v })}
          placeholder="Updated from"
          size="sm"
          fullWidth
        />
      </ListingFilterField>
      <ListingFilterField label="Updated to">
        <Input
          type="date"
          value={draft.dateTo}
          onChange={(v) => patch({ dateTo: v })}
          placeholder="Updated to"
          size="sm"
          fullWidth
        />
      </ListingFilterField>
    </>
  )
}

import { Input, Select } from '@/design-system/UIComponents'
import { ListingFilterField } from '@/design-system/listingFilterPopoverShell'
import { AGREEMENT_WORKFLOW_OPTIONS } from '../../agreements/config/agreementStatusConfig'
import type { QuotationAdvancedFilterState } from '../utils/quotationListingUtils'

export interface QuotationAdvancedFilterFieldsProps {
  draft: QuotationAdvancedFilterState
  patch: (partial: Partial<QuotationAdvancedFilterState>) => void
}

export function QuotationAdvancedFilterFields({ draft, patch }: QuotationAdvancedFilterFieldsProps) {
  return (
    <>
      <ListingFilterField label="Quotation No.">
        <Input
          value={draft.quotationNo}
          onChange={(v) => patch({ quotationNo: v })}
          placeholder="Search quotation number"
          size="sm"
          fullWidth
        />
      </ListingFilterField>
      <ListingFilterField label="Company Name">
        <Input
          value={draft.companyName}
          onChange={(v) => patch({ companyName: v })}
          placeholder="Search company"
          size="sm"
          fullWidth
        />
      </ListingFilterField>
      <ListingFilterField label="Workflow Type">
        <Select
          value={draft.workflowType}
          onChange={(v) => patch({ workflowType: String(v) })}
          options={[{ value: 'all', label: 'All workflow types' }, ...AGREEMENT_WORKFLOW_OPTIONS]}
          placeholder="Workflow type"
          size="sm"
          fullWidth
        />
      </ListingFilterField>
      <ListingFilterField label="Shared Status">
        <Select
          value={draft.sharedStatus}
          onChange={(v) => patch({ sharedStatus: String(v) })}
          options={[
            { value: 'all', label: 'All' },
            { value: 'not_shared', label: 'Not Shared' },
            { value: 'shared', label: 'Shared' },
          ]}
          placeholder="Shared status"
          size="sm"
          fullWidth
        />
      </ListingFilterField>
      <ListingFilterField label="Date from">
        <Input
          type="date"
          value={draft.dateFrom}
          onChange={(v) => patch({ dateFrom: v })}
          size="sm"
          fullWidth
        />
      </ListingFilterField>
      <ListingFilterField label="Date to">
        <Input
          type="date"
          value={draft.dateTo}
          onChange={(v) => patch({ dateTo: v })}
          size="sm"
          fullWidth
        />
      </ListingFilterField>
    </>
  )
}

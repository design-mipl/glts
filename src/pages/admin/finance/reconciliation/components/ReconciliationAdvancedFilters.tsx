import { Input, Select } from '@/design-system/UIComponents'
import { ListingFilterField } from '@/design-system/listingFilterPopoverShell'
import { EXPENSE_PAYMENT_MODE_OPTIONS } from '@/pages/admin/finance/expenses/config/expenseDetailFormConfig'
import type { ReconciliationFilters, ReconciliationPeriodPreset, ReconciliationStatus, ReconciliationTab } from '@/shared/types/reconciliation'
import { RECONCILIATION_PERIOD_OPTIONS } from '../config/reconciliationListingConfig'

export interface ReconciliationAdvancedFilterFieldsProps {
  draft: ReconciliationFilters
  patch: (partial: Partial<ReconciliationFilters>) => void
  tab: ReconciliationTab
}

export function ReconciliationAdvancedFilterFields({
  draft,
  patch,
  tab,
}: ReconciliationAdvancedFilterFieldsProps) {
  return (
    <>
      <ListingFilterField label="Period">
        <Select
          value={draft.period}
          onChange={value => patch({ period: String(value) as ReconciliationPeriodPreset })}
          options={[...RECONCILIATION_PERIOD_OPTIONS]}
          placeholder="Period"
          size="sm"
          fullWidth
        />
      </ListingFilterField>
      {draft.period === 'custom' ? (
        <>
          <ListingFilterField label="From">
            <Input
              type="date"
              size="sm"
              value={draft.customFrom ?? ''}
              onChange={v => patch({ customFrom: v })}
              placeholder="From"
            />
          </ListingFilterField>
          <ListingFilterField label="To">
            <Input
              type="date"
              size="sm"
              value={draft.customTo ?? ''}
              onChange={v => patch({ customTo: v })}
              placeholder="To"
            />
          </ListingFilterField>
        </>
      ) : null}
      <ListingFilterField label="Status">
        <Select
          value={draft.status ?? ''}
          onChange={value => patch({ status: String(value) as ReconciliationStatus | '' })}
          options={[
            { value: '', label: 'All statuses' },
            { value: 'pending', label: 'Pending' },
            { value: 'submitted', label: 'Submitted' },
            { value: 'rejected', label: 'Rejected' },
          ]}
          placeholder="Status"
          size="sm"
          fullWidth
        />
      </ListingFilterField>
      {tab === 'mode_of_payment' ? (
        <ListingFilterField label="Mode of payment">
          <Select
            value={draft.paymentMode ?? ''}
            onChange={value => patch({ paymentMode: String(value) })}
            options={[
              { value: '', label: 'All modes' },
              ...EXPENSE_PAYMENT_MODE_OPTIONS.map(option => ({
                value: option.value,
                label: option.label,
              })),
            ]}
            placeholder="Mode"
            size="sm"
            fullWidth
          />
        </ListingFilterField>
      ) : null}
    </>
  )
}

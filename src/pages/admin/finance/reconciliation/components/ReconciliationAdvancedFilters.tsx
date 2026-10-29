import { Input, Select } from '@/design-system/UIComponents'
import { ListingFilterField } from '@/design-system/listingFilterPopoverShell'
import type { ReconciliationFilters, ReconciliationPeriodPreset, ReconciliationTab } from '@/shared/types/reconciliation'
import { RECONCILIATION_PAYMENT_MODE_OPTIONS, RECONCILIATION_PERIOD_OPTIONS } from '../config/reconciliationListingConfig'

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
      {tab === 'mode_of_payment' ? (
        <ListingFilterField label="Mode of payment">
          <Select
            value={draft.paymentMode ?? ''}
            onChange={value => patch({ paymentMode: String(value) })}
            options={[
              { value: '', label: 'All modes' },
              ...RECONCILIATION_PAYMENT_MODE_OPTIONS.map(option => ({
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

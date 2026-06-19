import { Input, Select } from '@/design-system/UIComponents'
import { ListingFilterField } from '@/design-system/listingFilterPopoverShell'
import type { VendorCategory, VendorListFilters, VendorStatus, VendorType, PaymentTerms } from '@/shared/types/vendor'
import { PAYMENT_TERMS_OPTIONS } from '../config/paymentTermsConfig'
import { VENDOR_CATEGORY_OPTIONS } from '../config/vendorCategoryConfig'
import { VENDOR_STATUS_OPTIONS, VENDOR_TYPE_OPTIONS } from '../config/vendorStatusConfig'
import { getVendorServiceMasterOptions } from '../utils/vendorServiceMasterOptions'

export type VendorAdvancedFilterState = Required<
  Pick<VendorListFilters, 'category' | 'vendorType' | 'status' | 'gstApplicable' | 'paymentTerms'>
> & {
  serviceMasterId: string
  dateFrom: string
  dateTo: string
}

export const EMPTY_VENDOR_FILTERS: VendorAdvancedFilterState = {
  category: 'all',
  vendorType: 'all',
  serviceMasterId: 'all',
  status: 'all',
  gstApplicable: 'all',
  paymentTerms: 'all',
  dateFrom: '',
  dateTo: '',
}

export interface VendorAdvancedFilterFieldsProps {
  draft: VendorAdvancedFilterState
  patch: (partial: Partial<VendorAdvancedFilterState>) => void
}

export function VendorAdvancedFilterFields({ draft, patch }: VendorAdvancedFilterFieldsProps) {
  const serviceOptions = getVendorServiceMasterOptions()

  return (
    <>
      <ListingFilterField label="Vendor category">
        <Select
          value={draft.category}
          onChange={(v) => patch({ category: v as VendorCategory | 'all' })}
          options={[{ value: 'all', label: 'All categories' }, ...VENDOR_CATEGORY_OPTIONS]}
          placeholder="Vendor category"
          size="sm"
          fullWidth
        />
      </ListingFilterField>
      <ListingFilterField label="Vendor type">
        <Select
          value={draft.vendorType}
          onChange={(v) => patch({ vendorType: v as VendorType | 'all' })}
          options={[{ value: 'all', label: 'All types' }, ...VENDOR_TYPE_OPTIONS]}
          placeholder="Vendor type"
          size="sm"
          fullWidth
        />
      </ListingFilterField>
      <ListingFilterField label="Service">
        <Select
          value={draft.serviceMasterId}
          onChange={(v) => patch({ serviceMasterId: String(v) })}
          options={[{ value: 'all', label: 'All services' }, ...serviceOptions]}
          placeholder="Service"
          size="sm"
          fullWidth
        />
      </ListingFilterField>
      <ListingFilterField label="Status">
        <Select
          value={draft.status}
          onChange={(v) => patch({ status: v as VendorStatus | 'all' })}
          options={[{ value: 'all', label: 'All statuses' }, ...VENDOR_STATUS_OPTIONS]}
          placeholder="Status"
          size="sm"
          fullWidth
        />
      </ListingFilterField>
      <ListingFilterField label="GST applicable">
        <Select
          value={draft.gstApplicable}
          onChange={(v) => patch({ gstApplicable: v as VendorAdvancedFilterState['gstApplicable'] })}
          options={[
            { value: 'all', label: 'All' },
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ]}
          placeholder="GST applicable"
          size="sm"
          fullWidth
        />
      </ListingFilterField>
      <ListingFilterField label="Payment terms">
        <Select
          value={draft.paymentTerms}
          onChange={(v) => patch({ paymentTerms: v as PaymentTerms | 'all' })}
          options={[{ value: 'all', label: 'All payment terms' }, ...PAYMENT_TERMS_OPTIONS]}
          placeholder="Payment terms"
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

export function hasVendorFiltersActive(filters: VendorAdvancedFilterState): boolean {
  return (
    filters.category !== 'all' ||
    filters.vendorType !== 'all' ||
    filters.serviceMasterId !== 'all' ||
    filters.status !== 'all' ||
    filters.gstApplicable !== 'all' ||
    filters.paymentTerms !== 'all' ||
    Boolean(filters.dateFrom) ||
    Boolean(filters.dateTo)
  )
}

export function vendorFiltersToListFilters(filters: VendorAdvancedFilterState): VendorListFilters {
  return {
    category: filters.category,
    vendorType: filters.vendorType,
    serviceMasterId: filters.serviceMasterId === 'all' ? undefined : filters.serviceMasterId,
    status: filters.status,
    gstApplicable: filters.gstApplicable,
    paymentTerms: filters.paymentTerms,
    dateFrom: filters.dateFrom || undefined,
    dateTo: filters.dateTo || undefined,
  }
}

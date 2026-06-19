import type { VendorCategory } from '@/shared/types/vendor'

export const vendorCategoryLabel: Record<VendorCategory, string> = {
  ticketing_partner: 'Ticketing Partner',
  insurance_partner: 'Insurance Partner',
  courier_partner: 'Courier Partner',
  vfs_partner: 'VFS Partner',
  embassy_agent: 'Embassy Agent',
  translation_agency: 'Translation Agency',
  ground_ops_vendor: 'Ground Operations Vendor',
  documentation_vendor: 'Documentation Vendor',
  other: 'Other',
}

export const vendorCategoryColor: Record<
  VendorCategory,
  'primary' | 'secondary' | 'error' | 'success' | 'warning' | 'info' | 'neutral'
> = {
  ticketing_partner: 'info',
  insurance_partner: 'success',
  courier_partner: 'neutral',
  vfs_partner: 'primary',
  embassy_agent: 'warning',
  translation_agency: 'info',
  ground_ops_vendor: 'neutral',
  documentation_vendor: 'primary',
  other: 'neutral',
}

export const VENDOR_CATEGORY_OPTIONS = (Object.keys(vendorCategoryLabel) as VendorCategory[]).map((value) => ({
  value,
  label: vendorCategoryLabel[value],
}))

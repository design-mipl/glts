import type { VendorCategory } from '@/shared/types/vendor'

export const vendorCategoryLabel: Record<VendorCategory, string> = {
  visa_processing: 'Visa Processing',
  ticketing: 'Ticketings',
  insurance: 'Insurance',
  courier: 'Courier',
  delivery: 'Delivery (Airport Deliveries, hand Deliveries, Cargo, Other Couriers, etc)',
  travel_agents: 'Travel Agents',
  documentation: 'Documentation (Printing / Photo / Notarry / Apostile, etc)',
  others: 'Others',
}

export const vendorCategoryColor: Record<
  VendorCategory,
  'primary' | 'secondary' | 'error' | 'success' | 'warning' | 'info' | 'neutral'
> = {
  visa_processing: 'primary',
  ticketing: 'info',
  insurance: 'success',
  courier: 'neutral',
  delivery: 'warning',
  travel_agents: 'secondary',
  documentation: 'primary',
  others: 'neutral',
}

export const VENDOR_CATEGORY_OPTIONS = (Object.keys(vendorCategoryLabel) as VendorCategory[]).map((value) => ({
  value,
  label: vendorCategoryLabel[value],
}))

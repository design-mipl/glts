import type { VendorBillStatus, VendorStatus, VendorType } from '@/shared/types/vendor'

export const vendorStatusLabel: Record<VendorStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
}

export const vendorStatusColor: Record<VendorStatus, 'neutral' | 'success'> = {
  active: 'success',
  inactive: 'neutral',
}

export const vendorTypeLabel: Record<VendorType, string> = {
  company: 'Company',
  individual: 'Individual',
}

export const vendorBillStatusLabel: Record<VendorBillStatus, string> = {
  paid: 'Paid',
  partially_paid: 'Partially Paid',
  pending: 'Pending',
  overdue: 'Overdue',
}

export const vendorBillStatusColor: Record<
  VendorBillStatus,
  'primary' | 'secondary' | 'error' | 'success' | 'warning' | 'info' | 'neutral'
> = {
  paid: 'success',
  partially_paid: 'warning',
  pending: 'info',
  overdue: 'error',
}

export const VENDOR_TYPE_OPTIONS = (Object.keys(vendorTypeLabel) as VendorType[]).map((value) => ({
  value,
  label: vendorTypeLabel[value],
}))

export const VENDOR_STATUS_OPTIONS = (Object.keys(vendorStatusLabel) as VendorStatus[]).map((value) => ({
  value,
  label: vendorStatusLabel[value],
}))

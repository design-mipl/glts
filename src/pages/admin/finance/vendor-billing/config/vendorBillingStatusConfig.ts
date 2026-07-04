import type { VendorBillWorkflowStatus } from '@/shared/types/vendorBilling'
import type { VendorBillStatus } from '@/shared/types/vendor'
import type { PaymentStatus } from '@/shared/types/invoice'
import type { BadgeColor } from '@/pages/admin/finance/invoices/config/invoiceStatusConfig'
import { paymentStatusBadgeColor, paymentStatusLabel } from '@/pages/admin/finance/invoices/config/invoiceStatusConfig'
import { vendorBillStatusColor, vendorBillStatusLabel } from '@/pages/admin/vendor-management/vendors/config/vendorStatusConfig'

export const vendorBillWorkflowStatusLabel: Record<VendorBillWorkflowStatus, string> = {
  pending_verification: 'Pending verification',
  verified: 'Verified',
  approved: 'Approved',
  rejected: 'Rejected',
}

export const vendorBillWorkflowStatusColor: Record<VendorBillWorkflowStatus, BadgeColor> = {
  pending_verification: 'warning',
  verified: 'info',
  approved: 'success',
  rejected: 'error',
}

export function getVendorBillDisplayStatus(bill: {
  workflowStatus: VendorBillWorkflowStatus
  paymentStatus: VendorBillStatus
}): { label: string; color: BadgeColor } {
  if (bill.workflowStatus === 'rejected') {
    return { label: vendorBillWorkflowStatusLabel.rejected, color: vendorBillWorkflowStatusColor.rejected }
  }
  return {
    label: vendorBillStatusLabel[bill.paymentStatus],
    color: vendorBillStatusColor[bill.paymentStatus],
  }
}

export function getVendorPaymentDisplayStatus(status: PaymentStatus): { label: string; color: BadgeColor } {
  return { label: paymentStatusLabel[status], color: paymentStatusBadgeColor(status) }
}

export const VENDOR_BILLING_BASE_PATH = '/admin/finance/vendor-billing'

export type VendorBillingDetailTab = 'awaiting-invoice' | 'bills' | 'payments' | 'ledger'

export const VENDOR_BILLING_DETAIL_TABS: { value: VendorBillingDetailTab; label: string }[] = [
  { value: 'awaiting-invoice', label: 'Awaiting Invoice' },
  { value: 'bills', label: 'Open Bills' },
  { value: 'payments', label: 'Payment History' },
  { value: 'ledger', label: 'Vendor Ledger' },
]

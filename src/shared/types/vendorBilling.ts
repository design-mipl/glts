import type { PaymentStatus } from '@/shared/types/invoice'
import type { VendorBillStatus, VendorStatus } from '@/shared/types/vendor'

export type VendorChargeBillingStatus = 'awaiting_invoice' | 'billed'

export type VendorBillWorkflowStatus =
  | 'pending_verification'
  | 'verified'
  | 'approved'
  | 'rejected'

export interface VendorCharge {
  id: string
  vendorId: string
  applicationId: string
  applicantName?: string
  companyName?: string
  serviceName: string
  serviceType: string
  amount: number
  gstAmount: number
  completedAt: string
  billingStatus: VendorChargeBillingStatus
  vendorBillId?: string
  chargeReference: string
}

export interface VendorBillingBill {
  id: string
  vendorId: string
  billNumber: string
  vendorInvoiceNumber: string
  invoiceDate: string
  dueDate: string
  invoiceAmount: number
  paidAmount: number
  workflowStatus: VendorBillWorkflowStatus
  paymentStatus: VendorBillStatus
  chargeIds: string[]
  remarks?: string
  invoiceFileName?: string
  gstAmount: number
  tdsAmount: number
  createdAt: string
  updatedAt: string
  verifiedAt?: string
  verifiedBy?: string
  approvedAt?: string
  approvedBy?: string
}

export interface VendorBillingPayment {
  id: string
  vendorId: string
  vendorBillId: string
  billNumber: string
  vendorInvoiceNumber: string
  paymentNumber: string
  paymentDate: string
  amount: number
  paymentMode: string
  transactionReference: string
  status: PaymentStatus
  tdsAmount: number
  netAmount: number
  remarks?: string
  createdAt: string
}

export interface VendorBillingSummaryRow {
  id: string
  vendorId: string
  vendorName: string
  awaitingInvoiceCount: number
  billsCount: number
  outstandingAmount: number
  lastInvoiceDate?: string
  lastPaymentDate?: string
  status: VendorStatus
}

export type VendorLedgerEntryType = 'opening' | 'bill' | 'payment'

export interface VendorLedgerEntry {
  id: string
  date: string
  type: VendorLedgerEntryType
  reference: string
  description: string
  debit: number
  credit: number
  runningBalance: number
}

export interface VendorLedgerSummary {
  openingBalance: number
  entries: VendorLedgerEntry[]
  closingBalance: number
}

export interface CreateVendorBillInput {
  vendorId: string
  chargeIds: string[]
  vendorInvoiceNumber: string
  invoiceDate: string
  dueDate: string
  invoiceFileName?: string
  remarks?: string
}

export interface UpdateVendorBillInput {
  vendorInvoiceNumber: string
  invoiceDate: string
  dueDate: string
  invoiceFileName?: string
  remarks?: string
}

export interface RecordVendorBillPaymentInput {
  vendorBillId: string
  amount: number
  paymentDate: string
  paymentMode: string
  transactionReference: string
  tdsAmount?: number
  netAmount: number
  remarks?: string
}

export interface VendorBillingListFilters {
  status?: VendorStatus | 'all'
  query?: string
}

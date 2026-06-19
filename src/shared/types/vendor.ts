export type VendorCategory =
  | 'ticketing_partner'
  | 'insurance_partner'
  | 'courier_partner'
  | 'vfs_partner'
  | 'embassy_agent'
  | 'translation_agency'
  | 'ground_ops_vendor'
  | 'documentation_vendor'
  | 'other'

export type VendorType = 'company' | 'individual'

export type VendorStatus = 'active' | 'inactive'

export type PaymentTerms =
  | 'immediate'
  | 'advance_payment'
  | '7_days'
  | '15_days'
  | '30_days'
  | '45_days'
  | '60_days'
  | 'custom'

export type SettlementType =
  | 'per_application'
  | 'per_passenger'
  | 'per_service'
  | 'monthly_consolidated'
  | 'on_invoice_basis'

export type VendorBillStatus = 'paid' | 'partially_paid' | 'pending' | 'overdue'

export type VendorDocumentType =
  | 'gst_certificate'
  | 'pan_card'
  | 'cancelled_cheque'
  | 'agreement_contract'
  | 'other'

export interface VendorServiceMapping {
  id: string
  serviceMasterId: string
  vendorRate: number
  clientBillingRate: number
  margin: number
  gstApplicable: boolean
  status: 'active' | 'inactive'
}

export interface VendorDocument {
  id: string
  documentName: string
  documentType: VendorDocumentType
  fileName?: string
  uploadedAt?: string
  uploadedBy?: string
}

export interface VendorBill {
  id: string
  invoiceNumber: string
  invoiceDate: string
  invoiceAmount: number
  dueDate: string
  status: VendorBillStatus
  paidAmount: number
}

export interface VendorPayment {
  id: string
  paymentReference: string
  paymentDate: string
  amount: number
  remarks: string
}

export interface VendorFinanceSummary {
  totalInvoiceValue: number
  totalPaid: number
  outstanding: number
  overdueAmount: number
  gstTotal: number
  tdsDeducted: number
  totalPayable: number
}

export interface VendorActivity {
  id: string
  timestamp: string
  actor: string
  action: string
  detail: string
}

export interface VendorBankDetails {
  accountHolderName: string
  bankName: string
  accountNumber: string
  ifscCode: string
  branchName: string
}

export interface VendorCommercialDetails {
  paymentTerms: PaymentTerms
  creditAllowed: boolean
  creditLimit: number | null
  advanceRequired: boolean
  advanceAmount: number | null
  advancePercentage: number | null
  settlementType: SettlementType
  tdsApplicable: boolean
  tdsPercentage: number | null
  notes: string
}

export interface Vendor {
  id: string
  vendorId: string
  vendorName: string
  vendorCategory: VendorCategory
  vendorType: VendorType
  contactPerson: string
  mobileNumber: string
  emailAddress: string
  address: string
  city: string
  state: string
  country: string
  panNumber: string
  gstApplicable: boolean
  gstNumber: string
  status: VendorStatus
  commercial: VendorCommercialDetails
  bank: VendorBankDetails
  serviceMappings: VendorServiceMapping[]
  documents: VendorDocument[]
  bills: VendorBill[]
  payments: VendorPayment[]
  finance: VendorFinanceSummary
  outstandingAmount: number
  activities: VendorActivity[]
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
}

export interface VendorFormData {
  vendorName: string
  vendorCategory: VendorCategory
  vendorType: VendorType
  contactPerson: string
  mobileNumber: string
  emailAddress: string
  address: string
  city: string
  state: string
  country: string
  panNumber: string
  gstApplicable: boolean
  gstNumber: string
  status: VendorStatus
  commercial: VendorCommercialDetails
  bank: VendorBankDetails
  serviceMappings: VendorServiceMapping[]
}

export interface VendorListFilters {
  category?: VendorCategory | 'all'
  vendorType?: VendorType | 'all'
  serviceMasterId?: string
  status?: VendorStatus | 'all'
  gstApplicable?: 'all' | 'yes' | 'no'
  paymentTerms?: PaymentTerms | 'all'
  dateFrom?: string
  dateTo?: string
  query?: string
}

export interface VendorListingAggregates {
  totalVendors: number
  activeVendors: number
  inactiveVendors: number
  totalOutstanding: number
  vendorsPendingPayment: number
}

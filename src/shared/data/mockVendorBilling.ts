import { getMockVendors } from '@/shared/data/mockVendors'
import type {
  VendorBillingBill,
  VendorBillingPayment,
  VendorCharge,
} from '@/shared/types/vendorBilling'

function daysAgo(days: number) {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString()
}

function charge(
  id: string,
  vendorId: string,
  applicationId: string,
  serviceName: string,
  serviceType: string,
  amount: number,
  daysCompleted: number,
  opts?: {
    applicantName?: string
    companyName?: string
    gstAmount?: number
    billingStatus?: VendorCharge['billingStatus']
    vendorBillId?: string
  },
): VendorCharge {
  const gstAmount = opts?.gstAmount ?? Math.round(amount * 0.18)
  return {
    id,
    vendorId,
    applicationId,
    applicantName: opts?.applicantName,
    companyName: opts?.companyName,
    serviceName,
    serviceType,
    amount,
    gstAmount,
    completedAt: daysAgo(daysCompleted),
    billingStatus: opts?.billingStatus ?? 'awaiting_invoice',
    vendorBillId: opts?.vendorBillId,
    chargeReference: `CHG-${id.toUpperCase()}`,
  }
}

function bill(
  id: string,
  vendorId: string,
  vendorInvoiceNumber: string,
  amount: number,
  chargeIds: string[],
  daysInvoice: number,
  daysDue: number,
  workflowStatus: VendorBillingBill['workflowStatus'],
  paymentStatus: VendorBillingBill['paymentStatus'],
  paidAmount = 0,
  opts?: Partial<Pick<VendorBillingBill, 'remarks' | 'invoiceFileName' | 'verifiedAt' | 'verifiedBy' | 'approvedAt' | 'approvedBy'>>,
): VendorBillingBill {
  const invoiceDate = daysAgo(daysInvoice).slice(0, 10)
  const dueDate = daysAgo(daysDue).slice(0, 10)
  const gstAmount = Math.round(amount * 0.18)
  const tdsAmount = workflowStatus === 'approved' ? Math.round(amount * 0.02) : 0
  return {
    id,
    vendorId,
    billNumber: `VB-${id.toUpperCase()}`,
    vendorInvoiceNumber,
    invoiceDate,
    dueDate,
    invoiceAmount: amount,
    paidAmount,
    workflowStatus,
    paymentStatus,
    chargeIds,
    gstAmount,
    tdsAmount,
    remarks: opts?.remarks,
    invoiceFileName: opts?.invoiceFileName,
    verifiedAt: opts?.verifiedAt,
    verifiedBy: opts?.verifiedBy,
    approvedAt: opts?.approvedAt,
    approvedBy: opts?.approvedBy,
    createdAt: daysAgo(daysInvoice),
    updatedAt: daysAgo(Math.max(1, daysInvoice - 2)),
  }
}

function payment(
  id: string,
  vendorId: string,
  vendorBillId: string,
  billNumber: string,
  vendorInvoiceNumber: string,
  amount: number,
  days: number,
  status: VendorBillingPayment['status'],
  opts?: Partial<Pick<VendorBillingPayment, 'paymentMode' | 'transactionReference' | 'remarks' | 'tdsAmount' | 'netAmount'>>,
): VendorBillingPayment {
  const tdsAmount = opts?.tdsAmount ?? Math.round(amount * 0.02)
  const netAmount = opts?.netAmount ?? amount - tdsAmount
  return {
    id,
    vendorId,
    vendorBillId,
    billNumber,
    vendorInvoiceNumber,
    paymentNumber: `VPAY-${id.toUpperCase()}`,
    paymentDate: daysAgo(days).slice(0, 10),
    amount,
    paymentMode: opts?.paymentMode ?? 'NEFT',
    transactionReference: opts?.transactionReference ?? `UTR${id.replace(/\D/g, '').slice(-8)}`,
    status,
    tdsAmount,
    netAmount,
    remarks: opts?.remarks,
    createdAt: daysAgo(days),
  }
}

const VND_001 = 'vnd-001'
const VND_002 = 'vnd-002'
const VND_003 = 'vnd-003'
const VND_004 = 'vnd-004'
const VND_005 = 'vnd-005'
const VND_006 = 'vnd-006'
const VND_008 = 'vnd-008'

export const SEED_VENDOR_CHARGES: VendorCharge[] = [
  charge('vc-001', VND_001, 'GLTS-MAR-1025', 'VFS Submission', 'vfs_booking_service', 2200, 3, {
    applicantName: 'Rajesh Kumar',
    companyName: 'Oceanic Shipping Ltd',
  }),
  charge('vc-002', VND_001, 'GLTS-MAR-1042', 'Marine Visa Processing', 'visa_processing_fee', 6500, 5, {
    applicantName: 'Anil Sharma',
    companyName: 'Blue Horizon Marine',
  }),
  charge('vc-003', VND_001, 'GLTS-MAR-1055', 'VFS Submission', 'vfs_booking_service', 2200, 8, {
    applicantName: 'Vikram Patel',
    companyName: 'Seafarer Crew Services',
  }),
  charge('vc-004', VND_002, 'GLTS-MAR-1025', 'Travel Insurance', 'travel_insurance', 2800, 4, {
    applicantName: 'Rajesh Kumar',
    companyName: 'Oceanic Shipping Ltd',
  }),
  charge('vc-005', VND_002, 'GLTS-CORP-2201', 'Corporate Travel Insurance', 'travel_insurance', 4200, 6, {
    companyName: 'Global Tech Solutions',
  }),
  charge('vc-006', VND_003, 'GLTS-MAR-1033', 'Document Courier', 'courier_service', 1200, 2, {
    applicantName: 'Sunil Menon',
    companyName: 'Pacific Fleet Management',
  }),
  charge('vc-007', VND_003, 'GLTS-MAR-1048', 'Passport Courier', 'courier_service', 650, 7, {
    applicantName: 'Deepak Singh',
    companyName: 'Atlantic Marine Crew',
  }),
  charge('vc-008', VND_004, 'GLTS-CORP-2188', 'Embassy Liaison', 'embassy_fee', 7500, 10, {
    companyName: 'Emirates Business Travel',
  }),
  charge('vc-009', VND_004, 'GLTS-CORP-2195', 'Embassy Handoff', 'embassy_fee', 9000, 12, {
    companyName: 'Gulf Connect Ltd',
  }),
  charge('vc-010', VND_005, 'GLTS-MAR-1060', 'Certified Translation', 'documentation_service', 2200, 3, {
    applicantName: 'Meera Iyer',
    companyName: 'Coastal Shipping Co',
  }),
  charge('vc-011', VND_005, 'GLTS-MAR-1062', 'Arabic Translation', 'documentation_service', 1800, 6, {
    applicantName: 'Arun Nambiar',
    companyName: 'Southern Marine Lines',
  }),
  charge('vc-012', VND_006, 'GLTS-MAR-1025', 'Port Transfer', 'ground_operation_service', 3200, 4, {
    applicantName: 'Rajesh Kumar',
    companyName: 'Oceanic Shipping Ltd',
  }),
  charge('vc-013', VND_006, 'GLTS-MAR-1038', 'CDC Coordination', 'ground_operation_service', 2400, 9, {
    applicantName: 'Harish Reddy',
    companyName: 'Eastern Fleet Services',
  }),
  charge('vc-014', VND_008, 'GLTS-MAR-1070', 'Marine Air Ticket', 'flight_ticket', 18500, 2, {
    applicantName: 'Karan Mehta',
    companyName: 'Starline Shipping',
  }),
  charge('vc-015', VND_008, 'GLTS-MAR-1072', 'Crew Air Ticket', 'flight_ticket', 16200, 5, {
    applicantName: 'Rohit Jain',
    companyName: 'Maritime Crew Solutions',
  }),
  charge('vc-016', VND_001, 'GLTS-MAR-0998', 'VFS Submission', 'vfs_booking_service', 2200, 50, {
    applicantName: 'Legacy Applicant',
    companyName: 'Oceanic Shipping Ltd',
    billingStatus: 'billed',
    vendorBillId: 'vb-bill-001',
  }),
  charge('vc-017', VND_001, 'GLTS-MAR-0999', 'Marine Visa Processing', 'visa_processing_fee', 6500, 48, {
    applicantName: 'Legacy Applicant 2',
    companyName: 'Blue Horizon Marine',
    billingStatus: 'billed',
    vendorBillId: 'vb-bill-001',
  }),
]

export const SEED_VENDOR_BILLING_BILLS: VendorBillingBill[] = [
  bill(
    'vb-bill-001',
    VND_001,
    'VFS-INV-2026-0142',
    85000,
    ['vc-016', 'vc-017'],
    12,
    -18,
    'approved',
    'pending',
    0,
    {
      invoiceFileName: 'vfs-inv-2026-0142.pdf',
      remarks: 'January VFS submissions batch',
      verifiedAt: daysAgo(10),
      verifiedBy: 'Accounts Team',
      approvedAt: daysAgo(8),
      approvedBy: 'Finance Manager',
    },
  ),
  bill(
    'vb-bill-002',
    VND_001,
    'VFS-INV-2026-0098',
    62000,
    [],
    45,
    15,
    'approved',
    'paid',
    62000,
    {
      invoiceFileName: 'vfs-inv-2026-0098.pdf',
      verifiedAt: daysAgo(40),
      verifiedBy: 'Accounts Team',
      approvedAt: daysAgo(38),
      approvedBy: 'Finance Manager',
    },
  ),
  bill(
    'vb-bill-003',
    VND_002,
    'CM-INV-4521',
    42000,
    [],
    20,
    -10,
    'approved',
    'partially_paid',
    25000,
    {
      invoiceFileName: 'cm-inv-4521.pdf',
      verifiedAt: daysAgo(18),
      verifiedBy: 'Accounts Team',
      approvedAt: daysAgo(16),
      approvedBy: 'Finance Manager',
    },
  ),
  bill(
    'vb-bill-004',
    VND_004,
    'ELS-INV-112',
    95000,
    [],
    35,
    5,
    'verified',
    'overdue',
    0,
    {
      invoiceFileName: 'els-inv-112.pdf',
      verifiedAt: daysAgo(30),
      verifiedBy: 'Accounts Team',
    },
  ),
  bill(
    'vb-bill-005',
    VND_005,
    'LB-INV-334',
    28000,
    [],
    8,
    -22,
    'pending_verification',
    'pending',
    0,
    { invoiceFileName: 'lb-inv-334.pdf' },
  ),
  bill(
    'vb-bill-006',
    VND_003,
    'BD-INV-8892',
    18500,
    [],
    25,
    18,
    'approved',
    'paid',
    18500,
    {
      invoiceFileName: 'bd-inv-8892.pdf',
      verifiedAt: daysAgo(22),
      verifiedBy: 'Accounts Team',
      approvedAt: daysAgo(20),
      approvedBy: 'Finance Manager',
    },
  ),
]

export const SEED_VENDOR_BILLING_PAYMENTS: VendorBillingPayment[] = [
  payment('vpay-001', VND_001, 'vb-bill-002', 'VB-VB-BILL-002', 'VFS-INV-2026-0098', 62000, 30, 'paid', {
    paymentMode: 'NEFT',
    transactionReference: 'UTR8821456701',
    remarks: 'Settlement for Jan submissions',
  }),
  payment('vpay-002', VND_002, 'vb-bill-003', 'VB-VB-BILL-003', 'CM-INV-4521', 25000, 15, 'paid', {
    paymentMode: 'RTGS',
    transactionReference: 'UTR7712345602',
    remarks: 'Partial settlement Q1 policies',
  }),
  payment('vpay-003', VND_003, 'vb-bill-006', 'VB-VB-BILL-006', 'BD-INV-8892', 18500, 20, 'paid', {
    paymentMode: 'NEFT',
    transactionReference: 'UTR6634981203',
    remarks: 'Feb courier settlements',
  }),
  payment('vpay-004', VND_006, 'vb-bill-legacy', 'VB-VB-BILL-LEGACY', 'MGO-INV-778', 70000, 10, 'paid', {
    paymentMode: 'NEFT',
    transactionReference: 'UTR4412876504',
    remarks: 'Jan ground ops settlement',
  }),
]

export function seedVendorBillingForActiveVendors(): void {
  const vendorIds = new Set(getMockVendors().map(v => v.id))
  for (const charge of SEED_VENDOR_CHARGES) {
    if (!vendorIds.has(charge.vendorId)) {
      charge.vendorId = getMockVendors()[0]?.id ?? charge.vendorId
    }
  }
  for (const row of SEED_VENDOR_BILLING_BILLS) {
    if (!vendorIds.has(row.vendorId)) {
      row.vendorId = getMockVendors()[0]?.id ?? row.vendorId
    }
  }
  for (const row of SEED_VENDOR_BILLING_PAYMENTS) {
    if (!vendorIds.has(row.vendorId)) {
      row.vendorId = getMockVendors()[0]?.id ?? row.vendorId
    }
  }
}

seedVendorBillingForActiveVendors()

let chargesStore: VendorCharge[] = [...SEED_VENDOR_CHARGES]
let billsStore: VendorBillingBill[] = [...SEED_VENDOR_BILLING_BILLS]
let paymentsStore: VendorBillingPayment[] = [...SEED_VENDOR_BILLING_PAYMENTS]

export function getVendorBillingChargesStore(): VendorCharge[] {
  return chargesStore
}

export function getVendorBillingBillsStore(): VendorBillingBill[] {
  return billsStore
}

export function getVendorBillingPaymentsStore(): VendorBillingPayment[] {
  return paymentsStore
}

export function setVendorBillingStores(next: {
  charges?: VendorCharge[]
  bills?: VendorBillingBill[]
  payments?: VendorBillingPayment[]
}) {
  if (next.charges) chargesStore = next.charges
  if (next.bills) billsStore = next.bills
  if (next.payments) paymentsStore = next.payments
}

export function resetVendorBillingStores() {
  chargesStore = [...SEED_VENDOR_CHARGES]
  billsStore = [...SEED_VENDOR_BILLING_BILLS]
  paymentsStore = [...SEED_VENDOR_BILLING_PAYMENTS]
}

import {
  getVendorBillingBillsStore,
  getVendorBillingChargesStore,
  getVendorBillingPaymentsStore,
  setVendorBillingStores,
} from '@/shared/data/mockVendorBilling'
import { vendorService } from '@/shared/services/vendorService'
import type { VendorBillStatus } from '@/shared/types/vendor'
import type {
  CreateVendorBillInput,
  RecordVendorBillPaymentInput,
  UpdateVendorBillInput,
  VendorBillingBill,
  VendorBillingListFilters,
  VendorBillingPayment,
  VendorBillingSummaryRow,
  VendorCharge,
  VendorLedgerSummary,
} from '@/shared/types/vendorBilling'
import type { PaymentStatus } from '@/shared/types/invoice'

const ADMIN_ACTOR = 'Accounts Team'
const FINANCE_ACTOR = 'Finance Manager'

function nowIso() {
  return new Date().toISOString()
}

function generateId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

function normalizeQuery(query?: string) {
  return query?.trim().toLowerCase() ?? ''
}

function computeBillPaymentStatus(bill: VendorBillingBill): VendorBillStatus {
  if (bill.paidAmount <= 0) {
    const due = new Date(bill.dueDate)
    if (due < new Date()) return 'overdue'
    return 'pending'
  }
  if (bill.paidAmount >= bill.invoiceAmount) return 'paid'
  return 'partially_paid'
}

function refreshBillPaymentStatus(bill: VendorBillingBill): VendorBillingBill {
  return { ...bill, paymentStatus: computeBillPaymentStatus(bill), updatedAt: nowIso() }
}

export function isVendorBillEditable(bill: VendorBillingBill): boolean {
  return bill.paidAmount <= 0
}

export function isVendorBillOpen(bill: VendorBillingBill): boolean {
  return bill.paidAmount < bill.invoiceAmount
}

function sumChargesAmount(chargeIds: string[]): { amount: number; gstAmount: number } {
  const charges = getVendorBillingChargesStore()
  const selected = charges.filter(c => chargeIds.includes(c.id))
  return {
    amount: selected.reduce((sum, c) => sum + c.amount, 0),
    gstAmount: selected.reduce((sum, c) => sum + c.gstAmount, 0),
  }
}

export const vendorBillingService = {
  listVendorSummaries(filters: VendorBillingListFilters = {}): VendorBillingSummaryRow[] {
    const { status = 'all', query } = filters
    const q = normalizeQuery(query)
    const vendors = vendorService.list({ status: status === 'all' ? 'all' : status })
    const charges = getVendorBillingChargesStore()
    const bills = getVendorBillingBillsStore()
    const payments = getVendorBillingPaymentsStore()

    return vendors
      .map(vendor => {
        const vendorCharges = charges.filter(c => c.vendorId === vendor.id)
        const vendorBills = bills.filter(b => b.vendorId === vendor.id)
        const openBills = vendorBills.filter(b => isVendorBillOpen(refreshBillPaymentStatus(b)))
        const vendorPayments = payments.filter(p => p.vendorId === vendor.id)
        const awaitingInvoiceCount = vendorCharges.filter(c => c.billingStatus === 'awaiting_invoice').length
        const outstandingAmount = vendorBills.reduce(
          (sum, b) => sum + Math.max(0, b.invoiceAmount - b.paidAmount),
          0,
        )
        const lastInvoiceDate = vendorBills
          .map(b => b.invoiceDate)
          .sort((a, b) => b.localeCompare(a))[0]
        const lastPaymentDate = vendorPayments
          .map(p => p.paymentDate)
          .sort((a, b) => b.localeCompare(a))[0]

        return {
          id: vendor.id,
          vendorId: vendor.vendorId,
          vendorName: vendor.vendorName,
          awaitingInvoiceCount,
          billsCount: openBills.length,
          outstandingAmount,
          lastInvoiceDate,
          lastPaymentDate,
          status: vendor.status,
        }
      })
      .filter(row => {
        if (!q) return true
        return (
          row.vendorName.toLowerCase().includes(q) ||
          row.vendorId.toLowerCase().includes(q) ||
          row.id.toLowerCase().includes(q)
        )
      })
      .sort((a, b) => b.outstandingAmount - a.outstandingAmount || a.vendorName.localeCompare(b.vendorName))
  },

  getVendorSummary(vendorId: string): VendorBillingSummaryRow | undefined {
    return this.listVendorSummaries().find(row => row.id === vendorId)
  },

  listCharges(vendorId: string, billingStatus?: VendorCharge['billingStatus'] | 'all'): VendorCharge[] {
    let rows = getVendorBillingChargesStore().filter(c => c.vendorId === vendorId)
    if (billingStatus && billingStatus !== 'all') {
      rows = rows.filter(c => c.billingStatus === billingStatus)
    }
    return rows.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
  },

  listBills(vendorId: string): VendorBillingBill[] {
    return getVendorBillingBillsStore()
      .filter(b => b.vendorId === vendorId)
      .map(refreshBillPaymentStatus)
      .sort((a, b) => new Date(b.invoiceDate).getTime() - new Date(a.invoiceDate).getTime())
  },

  listOpenBills(vendorId: string): VendorBillingBill[] {
    return this.listBills(vendorId).filter(isVendorBillOpen)
  },

  getBillById(billId: string): VendorBillingBill | undefined {
    const bill = getVendorBillingBillsStore().find(b => b.id === billId)
    return bill ? refreshBillPaymentStatus(bill) : undefined
  },

  listPayments(vendorId: string): VendorBillingPayment[] {
    return getVendorBillingPaymentsStore()
      .filter(p => p.vendorId === vendorId)
      .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())
  },

  getLedger(vendorId: string): VendorLedgerSummary {
    const bills = this.listBills(vendorId)
    const payments = this.listPayments(vendorId)
    const openingBalance = 0

    type RawEntry = {
      id: string
      date: string
      type: 'bill' | 'payment'
      reference: string
      description: string
      debit: number
      credit: number
    }

    const raw: RawEntry[] = [
      ...bills
        .filter(b => b.workflowStatus !== 'rejected')
        .map(b => ({
          id: `ledger-bill-${b.id}`,
          date: b.invoiceDate,
          type: 'bill' as const,
          reference: b.vendorInvoiceNumber,
          description: `Vendor bill · ${b.billNumber}`,
          debit: b.invoiceAmount,
          credit: 0,
        })),
      ...payments.map(p => ({
        id: `ledger-pay-${p.id}`,
        date: p.paymentDate,
        type: 'payment' as const,
        reference: p.paymentNumber,
        description: `Payment · ${p.vendorInvoiceNumber}`,
        debit: 0,
        credit: p.netAmount,
      })),
    ].sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id))

    let running = openingBalance
    const entries = raw.map(entry => {
      running += entry.debit - entry.credit
      return { ...entry, runningBalance: running }
    })

    return {
      openingBalance,
      entries: [
        {
          id: 'ledger-opening',
          date: entries[0]?.date ?? nowIso().slice(0, 10),
          type: 'opening',
          reference: 'OPENING',
          description: 'Opening balance',
          debit: 0,
          credit: 0,
          runningBalance: openingBalance,
        },
        ...entries,
      ],
      closingBalance: running,
    }
  },

  createVendorBill(input: CreateVendorBillInput): VendorBillingBill | undefined {
    const vendor = vendorService.getById(input.vendorId)
    if (!vendor) return undefined

    const charges = getVendorBillingChargesStore()
    const selected = charges.filter(
      c =>
        input.chargeIds.includes(c.id) &&
        c.vendorId === input.vendorId &&
        c.billingStatus === 'awaiting_invoice',
    )
    if (selected.length === 0) return undefined

    const totals = sumChargesAmount(selected.map(c => c.id))
    const billId = generateId('vb-bill')
    const bill: VendorBillingBill = {
      id: billId,
      vendorId: input.vendorId,
      billNumber: `VB-${billId.slice(-8).toUpperCase()}`,
      vendorInvoiceNumber: input.vendorInvoiceNumber.trim(),
      invoiceDate: input.invoiceDate,
      dueDate: input.dueDate,
      invoiceAmount: totals.amount,
      paidAmount: 0,
      workflowStatus: 'approved',
      paymentStatus: 'pending',
      chargeIds: selected.map(c => c.id),
      remarks: input.remarks?.trim() || undefined,
      invoiceFileName: input.invoiceFileName?.trim() || undefined,
      gstAmount: totals.gstAmount,
      tdsAmount: 0,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    }

    const nextCharges = charges.map(c =>
      selected.some(s => s.id === c.id)
        ? { ...c, billingStatus: 'billed' as const, vendorBillId: billId }
        : c,
    )

    setVendorBillingStores({
      charges: nextCharges,
      bills: [bill, ...getVendorBillingBillsStore()],
    })

    return bill
  },

  updateVendorBill(billId: string, input: UpdateVendorBillInput): VendorBillingBill | undefined {
    const bills = getVendorBillingBillsStore()
    const index = bills.findIndex(b => b.id === billId)
    if (index < 0) return undefined

    const existing = refreshBillPaymentStatus(bills[index])
    if (!isVendorBillEditable(existing)) return undefined

    const updated = refreshBillPaymentStatus({
      ...existing,
      vendorInvoiceNumber: input.vendorInvoiceNumber.trim(),
      invoiceDate: input.invoiceDate,
      dueDate: input.dueDate,
      invoiceFileName: input.invoiceFileName?.trim() || existing.invoiceFileName,
      remarks: input.remarks?.trim() || undefined,
      updatedAt: nowIso(),
    })

    const next = [...bills]
    next[index] = updated
    setVendorBillingStores({ bills: next })
    return updated
  },

  verifyBill(billId: string): VendorBillingBill | undefined {
    const bills = getVendorBillingBillsStore()
    const index = bills.findIndex(b => b.id === billId)
    if (index < 0) return undefined

    const existing = bills[index]
    if (existing.workflowStatus !== 'pending_verification') return undefined

    const updated: VendorBillingBill = {
      ...existing,
      workflowStatus: 'verified',
      verifiedAt: nowIso(),
      verifiedBy: ADMIN_ACTOR,
      updatedAt: nowIso(),
    }
    const next = [...bills]
    next[index] = updated
    setVendorBillingStores({ bills: next })
    return updated
  },

  approveBill(billId: string): VendorBillingBill | undefined {
    const bills = getVendorBillingBillsStore()
    const index = bills.findIndex(b => b.id === billId)
    if (index < 0) return undefined

    const existing = bills[index]
    if (existing.workflowStatus !== 'verified') return undefined

    const updated: VendorBillingBill = refreshBillPaymentStatus({
      ...existing,
      workflowStatus: 'approved',
      approvedAt: nowIso(),
      approvedBy: FINANCE_ACTOR,
      tdsAmount: Math.round(existing.invoiceAmount * 0.02),
      updatedAt: nowIso(),
    })
    const next = [...bills]
    next[index] = updated
    setVendorBillingStores({ bills: next })
    return updated
  },

  recordPayment(input: RecordVendorBillPaymentInput): VendorBillingPayment | undefined {
    const bills = getVendorBillingBillsStore()
    const index = bills.findIndex(b => b.id === input.vendorBillId)
    if (index < 0) return undefined

    const bill = bills[index]

    const paymentId = generateId('vpay')
    const tdsAmount = input.tdsAmount ?? 0
    const netAmount = input.netAmount
    // Settlement status is based on payable amount settled, not net transfer amount after TDS.
    const paymentStatus: PaymentStatus =
      bill.paidAmount + input.amount >= bill.invoiceAmount ? 'paid' : 'partial'

    const payment: VendorBillingPayment = {
      id: paymentId,
      vendorId: bill.vendorId,
      vendorBillId: bill.id,
      billNumber: bill.billNumber,
      vendorInvoiceNumber: bill.vendorInvoiceNumber,
      paymentNumber: `VPAY-${paymentId.slice(-8).toUpperCase()}`,
      paymentDate: input.paymentDate,
      amount: input.amount,
      paymentMode: input.paymentMode,
      transactionReference: input.transactionReference.trim(),
      status: paymentStatus,
      tdsAmount,
      netAmount,
      remarks: input.remarks?.trim() || undefined,
      createdAt: nowIso(),
    }

    const updatedBill = refreshBillPaymentStatus({
      ...bill,
      paidAmount: Math.min(bill.invoiceAmount, bill.paidAmount + input.amount),
      updatedAt: nowIso(),
    })

    const nextBills = [...bills]
    nextBills[index] = updatedBill

    setVendorBillingStores({
      bills: nextBills,
      payments: [payment, ...getVendorBillingPaymentsStore()],
    })

    return payment
  },
}

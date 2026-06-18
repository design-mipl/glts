import { loadSession } from '@/shared/auth/session'
import { isSuperAdmin } from '@/shared/auth/customerRoleAccess'
import type { Invoice, InvoicePaymentRecord } from '@/shared/types/invoice'
import { invoiceService } from '@/shared/services/invoiceService'
import { getMockInvoices, setMockInvoicesStore } from '@/shared/data/mockInvoices'
import { paymentStatusLabel } from '@/pages/admin/finance/invoices/config/invoiceStatusConfig'
import type {
  AgingBucket,
  CustomerPaymentRow,
  FinanceOverviewData,
  FinanceOverviewMetrics,
  StatementOfAccount,
} from '@/pages/customer/features/finance/types/customerFinance.types'
import {
  filterInvoicesBySession,
  invoiceMatchesApplication,
} from '@/pages/customer/features/finance/utils/financeAccessUtils'
import {
  buildInvoiceListingRow,
  getInvoiceOutstandingAmount,
  getInvoicePaidAmount,
  isInvoiceOverdue,
  isUpcomingDue,
} from '@/pages/customer/features/finance/utils/financeInvoiceUtils'
import {
  buildAgingSummary,
  buildStatementOfAccount,
  filterOutstandingInvoices,
} from '@/pages/customer/features/finance/utils/statementUtils'
import { buildFinanceExportCsv } from '@/pages/customer/features/finance/utils/financeListingUtils'

const PAYMENT_PROOF_KEY = 'glts:customer-payment-proofs'

function session() {
  return loadSession()
}

function listScopedInvoices(): Invoice[] {
  return filterInvoicesBySession(invoiceService.listCustomerVisibleInvoices(), session())
}

function flattenPayments(invoices: Invoice[]): CustomerPaymentRow[] {
  const rows: CustomerPaymentRow[] = []
  for (const invoice of invoices) {
    for (const payment of invoice.payments ?? []) {
      rows.push({
        id: payment.id,
        paymentDate: payment.date,
        receiptNumber: payment.receiptNumber ?? `RCP-${payment.id.toUpperCase()}`,
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceId,
        amount: payment.amount,
        paymentMode: payment.method,
        transactionReference: payment.reference,
        status: paymentStatusLabel[payment.status] ?? payment.status,
        verificationStatus: payment.verificationStatus ?? 'pending',
        invoice,
        payment,
      })
    }
  }
  return rows.sort((a, b) => b.paymentDate.localeCompare(a.paymentDate))
}

function computeMetrics(invoices: Invoice[]): FinanceOverviewMetrics {
  let totalInvoiced = 0
  let totalPaid = 0
  let outstanding = 0
  let overdue = 0
  let upcomingDue = 0

  for (const inv of invoices) {
    totalInvoiced += inv.totals.finalAmount
    totalPaid += getInvoicePaidAmount(inv)
    const bal = getInvoiceOutstandingAmount(inv)
    outstanding += bal
    if (isInvoiceOverdue(inv)) overdue += bal
    if (isUpcomingDue(inv)) upcomingDue += bal
  }

  return { totalInvoiced, totalPaid, outstanding, overdue, upcomingDue }
}

export const customerFinanceService = {
  listSessionInvoices(): Invoice[] {
    return listScopedInvoices()
  },

  getSessionInvoice(invoiceId: string): Invoice | undefined {
    const inv =
      invoiceService.getById(invoiceId) ??
      listScopedInvoices().find(i => i.invoiceId === invoiceId || i.id === invoiceId)
    if (!inv) return undefined
    return filterInvoicesBySession([inv], session())[0]
  },

  listSessionPayments(): CustomerPaymentRow[] {
    return flattenPayments(listScopedInvoices())
  },

  getSessionPayment(paymentId: string): CustomerPaymentRow | undefined {
    return this.listSessionPayments().find(p => p.id === paymentId)
  },

  getFinanceOverview(): FinanceOverviewData {
    const invoices = listScopedInvoices()
    const payments = flattenPayments(invoices)
    const metrics = computeMetrics(invoices)
    const recentInvoices = [...invoices]
      .sort((a, b) => b.invoiceDate.localeCompare(a.invoiceDate))
      .slice(0, 5)
    const recentPayments = payments.slice(0, 5)
    const quickOutstanding = invoices
      .filter(i => getInvoiceOutstandingAmount(i) > 0)
      .sort((a, b) => getInvoiceOutstandingAmount(b) - getInvoiceOutstandingAmount(a))
      .slice(0, 5)

    return { metrics, recentInvoices, recentPayments, quickOutstanding }
  },

  listOutstandingInvoices(overdueOnly = false) {
    return filterOutstandingInvoices(listScopedInvoices(), overdueOnly)
  },

  getStatementOfAccount(periodMonths = 6): StatementOfAccount {
    return buildStatementOfAccount(listScopedInvoices(), periodMonths)
  },

  getAgingSummary(): AgingBucket[] {
    return buildAgingSummary(listScopedInvoices())
  },

  getInvoicesForApplication(applicationId: string): Invoice[] {
    return listScopedInvoices().filter(inv => invoiceMatchesApplication(inv, applicationId))
  },

  uploadPaymentProof(paymentId: string, fileName: string): boolean {
    let updated = false
    const store = getMockInvoices().map(inv => {
      const payments = (inv.payments ?? []).map(p => {
        if (p.id !== paymentId) return p
        updated = true
        return {
          ...p,
          proofFileName: fileName,
          proofUploadedAt: new Date().toISOString(),
          verificationStatus: 'pending' as const,
        }
      })
      return payments !== inv.payments ? { ...inv, payments } : inv
    })
    if (updated) {
      setMockInvoicesStore(store)
      try {
        const proofs = JSON.parse(localStorage.getItem(PAYMENT_PROOF_KEY) ?? '{}') as Record<string, string>
        proofs[paymentId] = fileName
        localStorage.setItem(PAYMENT_PROOF_KEY, JSON.stringify(proofs))
      } catch {
        /* ignore */
      }
    }
    return updated
  },

  canExportFinanceData(): boolean {
    return isSuperAdmin(session()?.userRole)
  },

  exportFinanceData(): string {
    const invoices = listScopedInvoices().map(buildInvoiceListingRow)
    const payments = flattenPayments(listScopedInvoices())
    return buildFinanceExportCsv(invoices, payments)
  },

  getInvoiceListingRows() {
    return listScopedInvoices().map(buildInvoiceListingRow)
  },
}

export type { InvoicePaymentRecord }

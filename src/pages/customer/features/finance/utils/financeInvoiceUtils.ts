import type { Invoice } from '@/shared/types/invoice'
import { contactNameFromEmail } from '@/shared/auth/session'
import type { BulkBatchRow } from '@/pages/customer/features/applications/data/applicationFlowData'
import type { InvoiceLinkedApplicationRow, InvoiceListingRow } from '../types/customerFinance.types'
import { getInvoiceLinkedApplications } from './financeAccessUtils'

export function getInvoicePaidAmount(invoice: Invoice): number {
  const fromPayments = (invoice.payments ?? []).reduce((sum, p) => sum + p.amount, 0)
  if (fromPayments > 0) return fromPayments
  return Math.max(0, invoice.totals.finalAmount - invoice.totals.balancePayable)
}

export function getInvoiceOutstandingAmount(invoice: Invoice): number {
  return Math.max(0, invoice.totals.balancePayable)
}

export function isInvoiceOverdue(invoice: Invoice): boolean {
  if (getInvoiceOutstandingAmount(invoice) <= 0) return false
  const today = new Date().toISOString().slice(0, 10)
  return invoice.dueDate < today
}

export function getDaysOutstanding(invoice: Invoice): number {
  const due = new Date(invoice.dueDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  due.setHours(0, 0, 0, 0)
  const diff = today.getTime() - due.getTime()
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)))
}

export function isUpcomingDue(invoice: Invoice, withinDays = 30): boolean {
  const outstanding = getInvoiceOutstandingAmount(invoice)
  if (outstanding <= 0) return false
  const today = new Date()
  const due = new Date(invoice.dueDate)
  const limit = new Date(today)
  limit.setDate(limit.getDate() + withinDays)
  return due >= today && due <= limit
}

function lineItemAmountForApplication(invoice: Invoice, applicationId: string): number {
  return (invoice.lineItems ?? [])
    .filter(
      item =>
        item.applicationId === applicationId ||
        item.batchId === applicationId ||
        (item.included !== false),
    )
    .filter(item => item.applicationId === applicationId || item.batchId === applicationId)
    .reduce((sum, item) => sum + item.amount, 0)
}

export function buildLinkedApplicationRows(invoice: Invoice): InvoiceLinkedApplicationRow[] {
  const apps = getInvoiceLinkedApplications(invoice)
  return apps.map(app => {
    const isBulk = app.recordType === 'bulk'
    const bulk = isBulk ? (app as BulkBatchRow) : null
    const amount =
      lineItemAmountForApplication(invoice, app.id) ||
      (isBulk
        ? (invoice.lineItems ?? [])
            .filter(li => li.batchId === app.id)
            .reduce((s, li) => s + li.amount, 0)
        : (invoice.lineItems ?? [])
            .filter(li => li.applicationId === app.id)
            .reduce((s, li) => s + li.amount, 0))

    return {
      applicationId: app.id,
      applicationType: isBulk ? 'bulk' : 'single',
      bookerName: contactNameFromEmail(app.createdByEmail),
      passengerCrewCount: isBulk ? bulk!.totalApplicants : 1,
      country: app.country,
      visaType: app.visaType,
      amount,
    }
  })
}

export function buildInvoiceListingRow(invoice: Invoice): InvoiceListingRow {
  const apps = getInvoiceLinkedApplications(invoice)
  const bookers = [...new Set(apps.map(a => contactNameFromEmail(a.createdByEmail)))]
  const passengerCrewCount = apps.reduce(
    (sum, app) => sum + (app.recordType === 'bulk' ? app.totalApplicants : 1),
    0,
  )

  return {
    id: invoice.id,
    invoice,
    linkedApplicationsCount: apps.length || invoice.totalApplications,
    bookers,
    passengerCrewCount,
    paidAmount: getInvoicePaidAmount(invoice),
    outstandingAmount: getInvoiceOutstandingAmount(invoice),
  }
}

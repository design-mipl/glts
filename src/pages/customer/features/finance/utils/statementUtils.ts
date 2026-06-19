import type { Invoice } from '@/shared/types/invoice'
import type { AgingBucket, StatementLineItem, StatementOfAccount } from '../types/customerFinance.types'
import {
  getDaysOutstanding,
  getInvoiceOutstandingAmount,
  getInvoicePaidAmount,
  isInvoiceOverdue,
} from './financeInvoiceUtils'

export function buildAgingSummary(invoices: Invoice[]): AgingBucket[] {
  const buckets: AgingBucket[] = [
    { label: '0–30 Days', range: '0-30', amount: 0, invoiceCount: 0 },
    { label: '31–60 Days', range: '31-60', amount: 0, invoiceCount: 0 },
    { label: '61–90 Days', range: '61-90', amount: 0, invoiceCount: 0 },
    { label: '90+ Days', range: '90+', amount: 0, invoiceCount: 0 },
  ]

  for (const invoice of invoices) {
    const outstanding = getInvoiceOutstandingAmount(invoice)
    if (outstanding <= 0) continue
    const days = getDaysOutstanding(invoice)
    let idx = 0
    if (days <= 30) idx = 0
    else if (days <= 60) idx = 1
    else if (days <= 90) idx = 2
    else idx = 3
    buckets[idx].amount += outstanding
    buckets[idx].invoiceCount += 1
  }

  return buckets
}

export function buildStatementOfAccount(invoices: Invoice[], periodMonths = 6): StatementOfAccount {
  const cutoff = new Date()
  cutoff.setMonth(cutoff.getMonth() - periodMonths)
  const cutoffStr = cutoff.toISOString().slice(0, 10)

  const periodInvoices = invoices.filter(i => i.invoiceDate >= cutoffStr)
  const invoicesRaised = periodInvoices
    .filter(i => i.invoiceType !== 'credit_note')
    .reduce((s, i) => s + i.totals.finalAmount, 0)
  const creditNotes = periodInvoices
    .filter(i => i.invoiceType === 'credit_note')
    .reduce((s, i) => s + Math.abs(i.totals.finalAmount), 0)
  const paymentsReceived = periodInvoices.reduce((s, i) => s + getInvoicePaidAmount(i), 0)
  const openingBalance = 0
  const closingBalance = invoices.reduce((s, i) => s + getInvoiceOutstandingAmount(i), 0)

  const lineItems: StatementLineItem[] = [
    {
      id: 'opening',
      date: cutoffStr,
      type: 'opening',
      reference: '—',
      description: 'Opening balance',
      debit: 0,
      credit: 0,
      balance: openingBalance,
    },
  ]

  const events: { date: string; sortKey: string; item: StatementLineItem }[] = []

  for (const inv of periodInvoices) {
    if (inv.invoiceType !== 'credit_note') {
      events.push({
        date: inv.invoiceDate,
        sortKey: `${inv.invoiceDate}-inv-${inv.id}`,
        item: {
          id: `inv-${inv.id}`,
          date: inv.invoiceDate,
          type: 'invoice',
          reference: inv.invoiceId,
          description: `Invoice raised — ${inv.invoiceId}`,
          debit: inv.totals.finalAmount,
          credit: 0,
          balance: 0,
        },
      })
    } else {
      events.push({
        date: inv.invoiceDate,
        sortKey: `${inv.invoiceDate}-cn-${inv.id}`,
        item: {
          id: `cn-${inv.id}`,
          date: inv.invoiceDate,
          type: 'credit_note',
          reference: inv.invoiceId,
          description: `Credit note — ${inv.invoiceId}`,
          debit: 0,
          credit: Math.abs(inv.totals.finalAmount),
          balance: 0,
        },
      })
    }

    for (const pay of inv.payments ?? []) {
      events.push({
        date: pay.date,
        sortKey: `${pay.date}-pay-${pay.id}`,
        item: {
          id: `pay-${pay.id}`,
          date: pay.date,
          type: 'payment',
          reference: pay.receiptNumber ?? pay.reference,
          description: `Payment received — ${inv.invoiceId}`,
          debit: 0,
          credit: pay.amount,
          balance: 0,
        },
      })
    }
  }

  events.sort((a, b) => a.sortKey.localeCompare(b.sortKey))
  let running = openingBalance
  for (const e of events) {
    running = running + e.item.debit - e.item.credit
    e.item.balance = running
    lineItems.push(e.item)
  }

  lineItems.push({
    id: 'closing',
    date: new Date().toISOString().slice(0, 10),
    type: 'closing',
    reference: '—',
    description: 'Closing balance',
    debit: 0,
    credit: 0,
    balance: closingBalance,
  })

  return {
    periodLabel: `Last ${periodMonths} months`,
    openingBalance,
    invoicesRaised,
    paymentsReceived,
    creditNotes,
    closingBalance,
    lineItems,
  }
}

export function filterOutstandingInvoices(
  invoices: Invoice[],
  overdueOnly: boolean,
): { invoice: Invoice; outstandingAmount: number; daysOutstanding: number; isOverdue: boolean }[] {
  return invoices
    .map(invoice => ({
      invoice,
      outstandingAmount: getInvoiceOutstandingAmount(invoice),
      daysOutstanding: getDaysOutstanding(invoice),
      isOverdue: isInvoiceOverdue(invoice),
    }))
    .filter(row => row.outstandingAmount > 0 && (!overdueOnly || row.isOverdue))
    .sort((a, b) => b.daysOutstanding - a.daysOutstanding)
}

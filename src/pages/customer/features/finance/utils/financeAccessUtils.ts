import type { AuthSession } from '@/shared/auth/session'
import type { Invoice } from '@/shared/types/invoice'
import {
  mockBulkBatches,
  mockSingleApplications,
  type BulkBatchRow,
  type SingleApplicationRow,
} from '@/pages/customer/features/applications/data/applicationFlowData'
import {
  canViewApplication,
  type ApplicationAccessMeta,
} from '@/pages/customer/features/applications/utils/applicationAccessUtils'

type ApplicationRow = SingleApplicationRow | BulkBatchRow

function findApplicationById(id: string): ApplicationRow | undefined {
  return (
    mockSingleApplications.find(row => row.id === id) ??
    mockBulkBatches.find(row => row.id === id)
  )
}

export function collectInvoiceApplicationRefs(invoice: Invoice): string[] {
  const refs = new Set<string>()
  for (const ref of invoice.gltsReferences ?? []) refs.add(ref)
  for (const batchId of invoice.batchIds ?? []) refs.add(batchId)
  for (const item of invoice.lineItems ?? []) {
    if (item.applicationId) refs.add(item.applicationId)
    if (item.batchId) refs.add(item.batchId)
  }
  return [...refs]
}

export function getInvoiceLinkedApplications(invoice: Invoice): ApplicationRow[] {
  const refs = collectInvoiceApplicationRefs(invoice)
  return refs.map(findApplicationById).filter((row): row is ApplicationRow => row != null)
}

export function canViewInvoice(invoice: Invoice, session: AuthSession | null): boolean {
  if (!session?.email) return false
  const role = session.userRole ?? 'booker'

  if (role === 'super_admin') return true

  const linked = getInvoiceLinkedApplications(invoice)
  if (linked.length === 0) return false

  return linked.some(app => canViewApplication(app as ApplicationAccessMeta, session))
}

export function filterInvoicesBySession(invoices: Invoice[], session: AuthSession | null): Invoice[] {
  return invoices.filter(invoice => canViewInvoice(invoice, session))
}

export function invoiceMatchesApplication(invoice: Invoice, applicationId: string): boolean {
  const refs = collectInvoiceApplicationRefs(invoice)
  return refs.some(ref => ref === applicationId || ref.includes(applicationId))
}

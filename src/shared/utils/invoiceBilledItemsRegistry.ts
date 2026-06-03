import { getMockInvoices } from '@/shared/data/mockInvoices'
import type { InvoiceStatus } from '@/shared/types/invoice'

const LOCKED_STATUSES: InvoiceStatus[] = [
  'submitted',
  'shared',
  'partially_paid',
  'paid',
  'overdue',
]

function billedKey(applicationId?: string, batchId?: string, serviceType?: string): string {
  return `${applicationId ?? ''}::${batchId ?? ''}::${serviceType ?? ''}`
}

export function getBilledItemsRegistry(): Set<string> {
  const registry = new Set<string>()
  for (const inv of getMockInvoices()) {
    if (inv.invoiceStatus === 'cancelled' || inv.invoiceStatus === 'draft') continue
    if (!LOCKED_STATUSES.includes(inv.invoiceStatus)) continue
    for (const li of inv.lineItems) {
      if (li.included === false) continue
      registry.add(billedKey(li.applicationId, li.batchId, li.serviceType))
    }
  }
  return registry
}

export function isServiceAlreadyBilled(
  registry: Set<string>,
  applicationId?: string,
  batchId?: string,
  serviceType?: string,
): boolean {
  return registry.has(billedKey(applicationId, batchId, serviceType))
}

export function getExistingChargesForApplication(applicationId: string): string[] {
  const services: string[] = []
  const registry = getBilledItemsRegistry()
  for (const key of registry) {
    const [appId, , serviceType] = key.split('::')
    if (appId === applicationId && serviceType) services.push(serviceType)
  }
  return [...new Set(services)]
}

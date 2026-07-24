import {
  mockBulkBatches,
  mockSingleApplications,
} from '@/pages/customer/features/applications/data/applicationFlowData'
import type { Invoice, InvoiceLineItem } from '@/shared/types/invoice'
import { resolveApplicationDisplayName } from '@/shared/utils/invoiceBillingEngine'
import { roundMoney } from '@/shared/utils/invoiceCalculations'
import { listBulkBatchApplicants } from './invoiceFeeCompositionUtils'

export interface InvoiceDetailPassengerGroup {
  key: string
  applicantName: string
  passportNumber: string
  lines: InvoiceLineItem[]
}

export interface InvoiceDetailApplicationGroup {
  id: string
  typeLabel: 'Single' | 'Bulk'
  displayName: string
  country: string
  visaType: string
  vessel: string
  /** Passenger-scoped lines (bulk with applicantName, or single with applicant). */
  passengers: InvoiceDetailPassengerGroup[]
  /** Lines billed at application/batch level without a passenger. */
  sharedLines: InvoiceLineItem[]
}

function lineAmount(line: InvoiceLineItem): number {
  return roundMoney(line.amount ?? line.quantity * line.unitPrice)
}

export function sumInvoiceDetailLines(lines: InvoiceLineItem[]): number {
  return roundMoney(lines.reduce((sum, line) => sum + lineAmount(line), 0))
}

function resolveGroupMeta(
  id: string,
  invoice: Invoice,
  typeLabel: 'Single' | 'Bulk',
): Pick<InvoiceDetailApplicationGroup, 'displayName' | 'country' | 'visaType' | 'vessel'> {
  if (typeLabel === 'Single') {
    const single = mockSingleApplications.find(r => r.id === id)
    if (single) {
      return {
        displayName: resolveApplicationDisplayName(single),
        country: single.country,
        visaType: single.visaType,
        vessel: single.vesselName ?? invoice.vesselName ?? '—',
      }
    }
  } else {
    const bulk = mockBulkBatches.find(r => r.id === id)
    if (bulk) {
      return {
        displayName: resolveApplicationDisplayName(bulk),
        country: bulk.country,
        visaType: bulk.visaType,
        vessel: bulk.vesselName ?? invoice.vesselName ?? '—',
      }
    }
  }

  const sample = invoice.lineItems.find(
    li => li.applicationId === id || li.batchId === id,
  )
  return {
    displayName: sample?.applicantName?.trim() || id,
    country: invoice.country ?? '—',
    visaType: invoice.visaType ?? '—',
    vessel: invoice.vesselName ?? '—',
  }
}

function groupPassengerLines(
  lines: InvoiceLineItem[],
  passportByName?: Map<string, string>,
): {
  passengers: InvoiceDetailPassengerGroup[]
  sharedLines: InvoiceLineItem[]
} {
  const byPassenger = new Map<string, InvoiceLineItem[]>()
  const sharedLines: InvoiceLineItem[] = []

  for (const line of lines) {
    const name = line.applicantName?.trim()
    if (!name) {
      sharedLines.push(line)
      continue
    }
    const key = name.toLowerCase()
    const list = byPassenger.get(key) ?? []
    list.push(line)
    byPassenger.set(key, list)
  }

  const passengers: InvoiceDetailPassengerGroup[] = [...byPassenger.entries()].map(
    ([key, passengerLines]) => {
      const applicantName = passengerLines[0]?.applicantName?.trim() || key
      return {
        key,
        applicantName,
        passportNumber: passportByName?.get(key) ?? '',
        lines: passengerLines,
      }
    },
  )

  return { passengers, sharedLines }
}

/**
 * Group invoice line items application-wise (single / bulk), then passenger-wise when present.
 */
export function buildInvoiceDetailApplicationGroups(
  invoice: Invoice,
): InvoiceDetailApplicationGroup[] {
  const batchIds = new Set(invoice.batchIds ?? [])
  const buckets = new Map<string, { typeLabel: 'Single' | 'Bulk'; lines: InvoiceLineItem[] }>()

  for (const line of invoice.lineItems) {
    const batchId = line.batchId?.trim()
    const applicationId = line.applicationId?.trim()
    let id: string
    let typeLabel: 'Single' | 'Bulk'

    if (batchId && (batchIds.has(batchId) || !applicationId)) {
      id = batchId
      typeLabel = 'Bulk'
    } else if (applicationId && batchIds.has(applicationId)) {
      id = applicationId
      typeLabel = 'Bulk'
    } else if (applicationId) {
      id = applicationId
      typeLabel = 'Single'
    } else if (batchId) {
      id = batchId
      typeLabel = 'Bulk'
    } else {
      id = invoice.id
      typeLabel = 'Single'
    }

    const bucket = buckets.get(id) ?? { typeLabel, lines: [] }
    bucket.lines.push(line)
    buckets.set(id, bucket)
  }

  // Preserve invoice reference order when possible.
  const orderedIds: string[] = []
  for (const ref of invoice.gltsReferences ?? []) {
    if (buckets.has(ref) && !orderedIds.includes(ref)) orderedIds.push(ref)
  }
  for (const batchId of invoice.batchIds ?? []) {
    if (buckets.has(batchId) && !orderedIds.includes(batchId)) orderedIds.push(batchId)
  }
  for (const id of buckets.keys()) {
    if (!orderedIds.includes(id)) orderedIds.push(id)
  }

  return orderedIds.map(id => {
    const bucket = buckets.get(id)!
    const meta = resolveGroupMeta(id, invoice, bucket.typeLabel)
    const bulk = bucket.typeLabel === 'Bulk' ? mockBulkBatches.find(r => r.id === id) : undefined
    const passportByName = new Map<string, string>()
    if (bulk) {
      for (const applicant of listBulkBatchApplicants(bulk)) {
        passportByName.set(applicant.applicantName.toLowerCase(), applicant.passportNumber)
      }
    }
    const { passengers, sharedLines } = groupPassengerLines(bucket.lines, passportByName)

    // Single apps: if everything is under one applicant name matching display, keep as shared under the app.
    if (bucket.typeLabel === 'Single' && passengers.length === 1 && sharedLines.length === 0) {
      const only = passengers[0]
      if (
        only.applicantName.toLowerCase() === meta.displayName.toLowerCase() ||
        !only.applicantName
      ) {
        return {
          id,
          typeLabel: bucket.typeLabel,
          ...meta,
          passengers: [],
          sharedLines: only.lines,
        }
      }
    }

    return {
      id,
      typeLabel: bucket.typeLabel,
      ...meta,
      passengers,
      sharedLines,
    }
  })
}

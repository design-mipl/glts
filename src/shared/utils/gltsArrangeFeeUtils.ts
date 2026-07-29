import { serviceMasterService } from '@/shared/services/serviceMasterService'

type ArrangeDocumentId = 'travel-ticket' | 'insurance'

/** GLTS fees master service IDs for arrange-by-GLTS workflows. */
export const GLTS_ARRANGE_SERVICE_MASTER_IDS: Record<ArrangeDocumentId, string> = {
  'travel-ticket': 'svc-e-ticket',
  insurance: 'svc-travel-insurance',
}

export interface GltsArrangeFeeQuote {
  serviceId: string
  serviceName: string
  amount: number
  amountLabel: string
}

export function formatGltsArrangeAmountLabel(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`
}

/** Resolves e-ticket / travel insurance fee from the GLTS fees (service) master. */
export function resolveGltsArrangeFee(documentId: ArrangeDocumentId): GltsArrangeFeeQuote | null {
  const serviceId = GLTS_ARRANGE_SERVICE_MASTER_IDS[documentId]
  const service = serviceMasterService.getById(serviceId)
  if (!service || service.status !== 'active' || service.defaultPrice == null) return null
  if (Number.isNaN(service.defaultPrice) || service.defaultPrice < 0) return null

  return {
    serviceId: service.id,
    serviceName: service.serviceName,
    amount: service.defaultPrice,
    amountLabel: formatGltsArrangeAmountLabel(service.defaultPrice),
  }
}

export function gltsArrangeFeeAmountString(documentId: ArrangeDocumentId): string {
  const quote = resolveGltsArrangeFee(documentId)
  return quote ? String(quote.amount) : ''
}

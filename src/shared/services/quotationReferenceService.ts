import { quotationService } from '@/shared/services/quotationService'
import type { QuotationReference, QuotationReferenceListFilters } from '@/shared/types/quotationReference'

function normalizeQuery(query?: string) {
  return query?.trim().toLowerCase() ?? ''
}

export const quotationReferenceService = {
  list(filters: QuotationReferenceListFilters = {}): QuotationReference[] {
    const q = normalizeQuery(filters.query)
    let rows = quotationService.listReferences()
    if (q) {
      rows = rows.filter(
        (r) =>
          r.quotationId.toLowerCase().includes(q) ||
          r.companyName.toLowerCase().includes(q) ||
          r.gstNumber.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q),
      )
    }
    return rows.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  },

  getById(id: string): QuotationReference | undefined {
    return quotationService.toReference(id)
  },

  getSelectOptions(): { value: string; label: string; gstNumber: string; quotationId: string }[] {
    return quotationService.getConvertibleSelectOptions()
  },

  search(query: string): QuotationReference[] {
    return this.list({ query })
  },
}

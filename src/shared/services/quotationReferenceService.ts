import { SEED_QUOTATION_REFERENCES } from '@/shared/data/mockQuotationReferences'
import type { QuotationReference, QuotationReferenceListFilters } from '@/shared/types/quotationReference'

function normalizeQuery(query?: string) {
  return query?.trim().toLowerCase() ?? ''
}

export const quotationReferenceService = {
  list(filters: QuotationReferenceListFilters = {}): QuotationReference[] {
    const q = normalizeQuery(filters.query)
    let rows = [...SEED_QUOTATION_REFERENCES]
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
    return SEED_QUOTATION_REFERENCES.find((r) => r.id === id)
  },

  getSelectOptions(): { value: string; label: string; gstNumber: string; quotationId: string }[] {
    return SEED_QUOTATION_REFERENCES.map((r) => ({
      value: r.id,
      label: r.companyName,
      gstNumber: r.gstNumber,
      quotationId: r.quotationId,
    }))
  },

  search(query: string): QuotationReference[] {
    return this.list({ query })
  },
}

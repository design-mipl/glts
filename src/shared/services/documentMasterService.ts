import { getMockCountryMasters } from '@/shared/data/mockCountryMasters'
import { SEED_DOCUMENT_MASTERS } from '@/shared/data/mockDocumentMasters'
import type {
  DocumentMaster,
  DocumentMasterDeleteResult,
  DocumentMasterFormData,
  DocumentMasterKpiCounts,
  DocumentMasterListFilters,
  DocumentMasterStatus,
} from '@/shared/types/documentMaster'

function nowIso() {
  return new Date().toISOString()
}

function generateDocumentId(): string {
  const suffix = Math.floor(10000 + Math.random() * 90000)
  return `DOC-${suffix}`
}

let documentStore: DocumentMaster[] = [...SEED_DOCUMENT_MASTERS]

function normalizeQuery(query?: string) {
  return query?.trim().toLowerCase() ?? ''
}

export const documentMasterService = {
  list(filters: DocumentMasterListFilters = {}): DocumentMaster[] {
    const { status = 'all', query } = filters
    const q = normalizeQuery(query)
    let rows = [...documentStore]

    if (status !== 'all') {
      rows = rows.filter((row) => row.status === status)
    }

    if (q) {
      rows = rows.filter(
        (row) =>
          row.id.toLowerCase().includes(q) ||
          row.documentType.toLowerCase().includes(q) ||
          row.description.toLowerCase().includes(q),
      )
    }

    return rows.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
  },

  getById(id: string): DocumentMaster | undefined {
    return documentStore.find((row) => row.id === id)
  },

  create(data: DocumentMasterFormData): DocumentMaster {
    const timestamp = nowIso()
    const record: DocumentMaster = {
      id: generateDocumentId(),
      documentType: data.documentType.trim(),
      description: data.description.trim(),
      status: data.status,
      createdAt: timestamp,
      updatedAt: timestamp,
    }
    documentStore = [record, ...documentStore]
    return record
  },

  update(id: string, data: DocumentMasterFormData): DocumentMaster | undefined {
    const index = documentStore.findIndex((row) => row.id === id)
    if (index < 0) return undefined

    const updated: DocumentMaster = {
      ...documentStore[index],
      documentType: data.documentType.trim(),
      description: data.description.trim(),
      status: data.status,
      updatedAt: nowIso(),
    }
    documentStore = [...documentStore.slice(0, index), updated, ...documentStore.slice(index + 1)]
    return updated
  },

  setStatus(id: string, status: DocumentMasterStatus): DocumentMaster | undefined {
    const existing = documentStore.find((row) => row.id === id)
    if (!existing) return undefined
    return this.update(id, {
      documentType: existing.documentType,
      description: existing.description,
      status,
    })
  },

  remove(id: string): DocumentMasterDeleteResult {
    const existing = documentStore.find((row) => row.id === id)
    if (!existing) return { ok: false, reason: 'not_found' }
    if (this.isDocumentInUse(id)) return { ok: false, reason: 'in_use' }
    documentStore = documentStore.filter((row) => row.id !== id)
    return { ok: true }
  },

  isDocumentInUse(id: string): boolean {
    return this.getUsageCount(id) > 0
  },

  getUsageCount(id: string): number {
    const countries = getMockCountryMasters()
    let count = 0
    for (const country of countries) {
      const inUse = country.segments.some((seg) => {
        const inCommon = (seg.commonDocuments ?? []).some((doc) => doc.documentId === id)
        const inApplication = seg.visaTypes.some((vt) =>
          (vt.applicationDocuments ?? []).some((doc) => doc.documentId === id),
        )
        return inCommon || inApplication
      })
      if (inUse) count += 1
    }
    return count
  },

  getKpiCounts(): DocumentMasterKpiCounts {
    const total = documentStore.length
    const active = documentStore.filter((row) => row.status === 'active').length
    return { total, active, inactive: total - active }
  },
}

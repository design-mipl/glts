/**
 * Customer Stored Documents — reusable identity docs for retail visa applications.
 * Prototype persistence via localStorage (no backend yet).
 */

export type StoredDocumentType = 'aadhaar' | 'pan' | 'passport' | 'photo' | 'other'

/**
 * Grouping used by the retail account documents grid. Categories exist so the list stays
 * scannable as a customer accumulates 15–20 reusable documents; without them the grid is
 * just an undifferentiated wall of cards.
 */
export type StoredDocumentCategory = 'travel' | 'identity' | 'supporting'

export type StoredDocumentStatus = 'ready' | 'expired' | 'pending'

export interface StoredDocument {
  id: string
  type: StoredDocumentType
  label: string
  fileName: string
  /** Object URL or data URL for mock preview/reuse */
  fileUrl?: string
  uploadedAt: string
  status: StoredDocumentStatus
  notes?: string
}

const STORAGE_KEY = 'glts:retail-stored-documents'

const TYPE_LABELS: Record<StoredDocumentType, string> = {
  aadhaar: 'Aadhaar Card',
  pan: 'PAN Card',
  passport: 'Passport',
  photo: 'Passport Photo',
  other: 'Other document',
}

const TYPE_CATEGORY: Record<StoredDocumentType, StoredDocumentCategory> = {
  passport: 'travel',
  photo: 'travel',
  aadhaar: 'identity',
  pan: 'identity',
  other: 'supporting',
}

export const STORED_DOCUMENT_CATEGORY_LABELS: Record<StoredDocumentCategory, string> = {
  travel: 'Travel documents',
  identity: 'Identity proof',
  supporting: 'Supporting documents',
}

/** Display order for category sections — most reused first. */
export const STORED_DOCUMENT_CATEGORY_ORDER: StoredDocumentCategory[] = [
  'travel',
  'identity',
  'supporting',
]

export function storedDocumentTypeLabel(type: StoredDocumentType): string {
  return TYPE_LABELS[type]
}

export function storedDocumentCategory(type: StoredDocumentType): StoredDocumentCategory {
  return TYPE_CATEGORY[type]
}

const SEED: StoredDocument[] = [
  {
    id: 'doc-passport-1',
    type: 'passport',
    label: 'Passport',
    fileName: 'passport-bio-page.pdf',
    uploadedAt: '2026-05-12T10:00:00.000Z',
    status: 'ready',
  },
  {
    id: 'doc-aadhaar-1',
    type: 'aadhaar',
    label: 'Aadhaar Card',
    fileName: 'aadhaar-front.pdf',
    uploadedAt: '2026-04-02T08:30:00.000Z',
    status: 'ready',
  },
]

function readStore(): StoredDocument[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      writeStore(SEED)
      return [...SEED]
    }
    const parsed = JSON.parse(raw) as StoredDocument[]
    return Array.isArray(parsed) ? parsed : [...SEED]
  } catch {
    return [...SEED]
  }
}

function writeStore(docs: StoredDocument[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(docs))
  } catch {
    // ignore quota
  }
}

export function listStoredDocuments(): StoredDocument[] {
  return readStore().slice().sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt))
}

export function getStoredDocument(id: string): StoredDocument | undefined {
  return readStore().find(d => d.id === id)
}

export function getStoredDocumentByType(type: StoredDocumentType): StoredDocument | undefined {
  return readStore().find(d => d.type === type && d.status === 'ready')
}

export function upsertStoredDocument(input: {
  id?: string
  type: StoredDocumentType
  label?: string
  fileName: string
  fileUrl?: string
  notes?: string
  status?: StoredDocumentStatus
}): StoredDocument {
  const docs = readStore()
  const now = new Date().toISOString()
  const label = input.label?.trim() || TYPE_LABELS[input.type]

  if (input.id) {
    const idx = docs.findIndex(d => d.id === input.id)
    if (idx >= 0) {
      const next: StoredDocument = {
        ...docs[idx],
        type: input.type,
        label,
        fileName: input.fileName,
        fileUrl: input.fileUrl ?? docs[idx].fileUrl,
        notes: input.notes,
        status: input.status ?? 'ready',
        uploadedAt: now,
      }
      docs[idx] = next
      writeStore(docs)
      return next
    }
  }

  // One slot per typed doc (except other) — replace existing of same type
  if (input.type !== 'other') {
    const existingIdx = docs.findIndex(d => d.type === input.type)
    if (existingIdx >= 0) {
      const next: StoredDocument = {
        ...docs[existingIdx],
        label,
        fileName: input.fileName,
        fileUrl: input.fileUrl,
        notes: input.notes,
        status: input.status ?? 'ready',
        uploadedAt: now,
      }
      docs[existingIdx] = next
      writeStore(docs)
      return next
    }
  }

  const created: StoredDocument = {
    id: `doc-${Date.now().toString(36)}`,
    type: input.type,
    label,
    fileName: input.fileName,
    fileUrl: input.fileUrl,
    notes: input.notes,
    uploadedAt: now,
    status: input.status ?? 'ready',
  }
  writeStore([created, ...docs])
  return created
}

export function removeStoredDocument(id: string): boolean {
  const docs = readStore()
  const next = docs.filter(d => d.id !== id)
  if (next.length === docs.length) return false
  writeStore(next)
  return true
}

/** Admin Document master — standard document types for platform checklists. */

export type DocumentMasterStatus = 'active' | 'inactive'

export interface DocumentMaster {
  /** Slug for seeded records (e.g. passport); DOC-xxxxx for user-created records. */
  id: string
  documentType: string
  description: string
  status: DocumentMasterStatus
  createdAt: string
  updatedAt: string
}

export interface DocumentMasterFormData {
  documentType: string
  description: string
  status: DocumentMasterStatus
}

export interface DocumentMasterListFilters {
  status?: DocumentMasterStatus | 'all'
  query?: string
}

export interface DocumentMasterKpiCounts {
  total: number
  active: number
  inactive: number
}

export type DocumentMasterDeleteResult =
  | { ok: true }
  | { ok: false; reason: 'not_found' | 'in_use' }

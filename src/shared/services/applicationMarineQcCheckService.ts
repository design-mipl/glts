import type { CountryQcChecklistTemplate } from '@/shared/types/countryMaster'
import {
  countEnabledQcChecklistItems,
  getExecutableQcChecklistSections,
} from '@/shared/utils/countryQcChecklistUtils'
import { applyDocsQcOutcomeToListing } from '@/shared/utils/applicationQueueStatus'

export type MarineDocsQcOutcome = 'ready' | 'correction' | 'blocked' | ''

export interface MarineDocsQcCheckRecord {
  applicationId: string
  travelerRowId: string
  checked: Record<string, boolean>
  outcome: MarineDocsQcOutcome
  completedAt?: string
  submittedAt?: string
}

const MARINE_DOCS_QC_STORAGE_KEY = 'glts:marine-docs-qc-check'

type MarineDocsQcCheckStore = Record<string, MarineDocsQcCheckRecord>

function recordKey(applicationId: string, travelerRowId: string): string {
  return `${applicationId}::${travelerRowId}`
}

function readStore(): MarineDocsQcCheckStore {
  try {
    const raw = localStorage.getItem(MARINE_DOCS_QC_STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as MarineDocsQcCheckStore
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function writeStore(store: MarineDocsQcCheckStore) {
  try {
    localStorage.setItem(MARINE_DOCS_QC_STORAGE_KEY, JSON.stringify(store))
  } catch {
    // ignore storage failures in mock mode
  }
}

function emptyRecord(applicationId: string, travelerRowId: string): MarineDocsQcCheckRecord {
  return {
    applicationId,
    travelerRowId,
    checked: {},
    outcome: '',
  }
}

export function buildCompletedDocsQcCheckedState(
  template: CountryQcChecklistTemplate,
): Record<string, boolean> {
  const checked: Record<string, boolean> = {}
  for (const section of getExecutableQcChecklistSections(template)) {
    for (const item of section.items) {
      checked[item.id] = true
    }
  }
  return checked
}

function areAllQcChecklistItemsChecked(
  template: CountryQcChecklistTemplate,
  record: MarineDocsQcCheckRecord,
): boolean {
  const sections = getExecutableQcChecklistSections(template)
  for (const section of sections) {
    for (const item of section.items) {
      if (!record.checked[item.id]) return false
    }
  }

  return countEnabledQcChecklistItems(template) > 0
}

/** Ready-for-submission path: all checklist items confirmed + Verified & ready. */
export function isMarineDocsQcCheckComplete(
  template: CountryQcChecklistTemplate,
  record: MarineDocsQcCheckRecord,
): boolean {
  if (record.outcome !== 'ready') return false
  return areAllQcChecklistItemsChecked(template, record)
}

/**
 * Any QC outcome can be submitted:
 * - ready → checklist must be fully confirmed
 * - correction / blocked → outcome alone is enough (sends back to Ops)
 */
export function canSubmitMarineDocsQc(
  template: CountryQcChecklistTemplate,
  record: MarineDocsQcCheckRecord,
): boolean {
  if (record.outcome === 'correction' || record.outcome === 'blocked') return true
  return isMarineDocsQcCheckComplete(template, record)
}

/** Form view unlocks only after a successful Verified & ready QC submit. */
export function isMarineDocsQcReadySubmitted(record: MarineDocsQcCheckRecord): boolean {
  return Boolean(record.submittedAt) && record.outcome === 'ready'
}

function withCompletionTimestamp(
  template: CountryQcChecklistTemplate,
  record: MarineDocsQcCheckRecord,
): MarineDocsQcCheckRecord {
  if (isMarineDocsQcCheckComplete(template, record)) {
    return {
      ...record,
      completedAt: record.completedAt ?? new Date().toISOString(),
    }
  }
  const { completedAt: _removed, ...rest } = record
  return rest
}

function withSubmitTimestamp(record: MarineDocsQcCheckRecord): MarineDocsQcCheckRecord {
  return {
    ...record,
    submittedAt: record.submittedAt ?? new Date().toISOString(),
  }
}

export const applicationMarineQcCheckService = {
  getRecord(applicationId: string, travelerRowId: string): MarineDocsQcCheckRecord {
    const store = readStore()
    return store[recordKey(applicationId, travelerRowId)] ?? emptyRecord(applicationId, travelerRowId)
  },

  ensureRecord(
    applicationId: string,
    travelerRowId: string,
    options?: { seedCompleted?: boolean; template?: CountryQcChecklistTemplate },
  ): MarineDocsQcCheckRecord {
    const existing = this.getRecord(applicationId, travelerRowId)
    const hasProgress =
      existing.outcome !== '' || Object.values(existing.checked).some(Boolean)

    if (hasProgress || !options?.seedCompleted || !options.template) {
      return existing
    }

    const seeded: MarineDocsQcCheckRecord = {
      applicationId,
      travelerRowId,
      checked: buildCompletedDocsQcCheckedState(options.template),
      outcome: 'ready',
      completedAt: new Date().toISOString(),
      submittedAt: new Date().toISOString(),
    }
    this.saveRecord(seeded)
    return seeded
  },

  saveRecord(record: MarineDocsQcCheckRecord) {
    const store = readStore()
    store[recordKey(record.applicationId, record.travelerRowId)] = record
    writeStore(store)
  },

  updateChecked(
    applicationId: string,
    travelerRowId: string,
    itemId: string,
    value: boolean,
    template: CountryQcChecklistTemplate,
  ): MarineDocsQcCheckRecord {
    const record = this.getRecord(applicationId, travelerRowId)
    const next = withCompletionTimestamp(template, {
      ...record,
      checked: { ...record.checked, [itemId]: value },
      submittedAt: undefined,
    })
    this.saveRecord(next)
    return next
  },

  updateOutcome(
    applicationId: string,
    travelerRowId: string,
    outcome: MarineDocsQcOutcome,
    template: CountryQcChecklistTemplate,
  ): MarineDocsQcCheckRecord {
    const record = this.getRecord(applicationId, travelerRowId)
    const next = withCompletionTimestamp(template, {
      ...record,
      outcome,
      submittedAt: undefined,
    })
    this.saveRecord(next)
    return next
  },

  isComplete(template: CountryQcChecklistTemplate, record: MarineDocsQcCheckRecord): boolean {
    return isMarineDocsQcCheckComplete(template, record)
  },

  canSubmit(template: CountryQcChecklistTemplate, record: MarineDocsQcCheckRecord): boolean {
    return canSubmitMarineDocsQc(template, record)
  },

  isSubmitted(record: MarineDocsQcCheckRecord): boolean {
    return Boolean(record.submittedAt)
  },

  isReadySubmitted(record: MarineDocsQcCheckRecord): boolean {
    return isMarineDocsQcReadySubmitted(record)
  },

  submit(
    applicationId: string,
    travelerRowId: string,
    template: CountryQcChecklistTemplate,
  ): MarineDocsQcCheckRecord | null {
    const record = this.getRecord(applicationId, travelerRowId)
    if (!this.canSubmit(template, record)) return null
    const next = withSubmitTimestamp(record)
    this.saveRecord(next)
    if (next.outcome === 'ready' || next.outcome === 'correction' || next.outcome === 'blocked') {
      applyDocsQcOutcomeToListing(applicationId, next.outcome)
    }
    return next
  },
}

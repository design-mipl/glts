import { SEED_CLIENT_DOCUMENT_MASTERS } from '@/shared/data/mockClientDocumentMasters'
import type {
  ClientDocumentMaster,
  ClientDocumentMasterFormData,
  ClientDocumentMasterListFilters,
} from '@/shared/types/clientDocumentMaster'
import type { MasterApplicability, MasterRecordStatus } from '@/shared/types/masterCommon'
import { MASTER_APPLICABILITY_OPTIONS } from '@/shared/types/masterCommon'
import { getMasterActor } from '@/shared/utils/masterActor'

function nowIso() {
  return new Date().toISOString()
}

function generateClientDocumentId(): string {
  const suffix = Math.floor(10000 + Math.random() * 90000)
  return `CDOC-${suffix}`
}

let clientDocumentStore: ClientDocumentMaster[] = [...SEED_CLIENT_DOCUMENT_MASTERS]

export function getApplicabilityLabel(value: MasterApplicability): string {
  return MASTER_APPLICABILITY_OPTIONS.find((o) => o.value === value)?.label ?? value
}

export function formatApplicabilityLabels(values: MasterApplicability[]): string {
  if (values.length === 0) return '—'
  return values.map(getApplicabilityLabel).join(', ')
}

export const clientDocumentMasterService = {
  list(filters: ClientDocumentMasterListFilters = {}): ClientDocumentMaster[] {
    const { status = 'all', applicability = 'all' } = filters
    let rows = [...clientDocumentStore]

    if (status !== 'all') {
      rows = rows.filter((row) => row.status === status)
    }

    if (applicability !== 'all') {
      rows = rows.filter((row) => row.applicableFor.includes(applicability))
    }

    return rows.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
  },

  getById(id: string): ClientDocumentMaster | undefined {
    return clientDocumentStore.find((row) => row.id === id)
  },

  create(data: ClientDocumentMasterFormData): ClientDocumentMaster {
    const actor = getMasterActor()
    const timestamp = nowIso()
    const record: ClientDocumentMaster = {
      id: generateClientDocumentId(),
      documentType: data.documentType.trim(),
      description: data.description.trim(),
      applicableFor: [...data.applicableFor],
      isMandatory: data.isMandatory,
      status: data.status,
      createdBy: actor,
      updatedBy: actor,
      createdAt: timestamp,
      updatedAt: timestamp,
    }
    clientDocumentStore = [record, ...clientDocumentStore]
    return record
  },

  update(id: string, data: ClientDocumentMasterFormData): ClientDocumentMaster | undefined {
    const index = clientDocumentStore.findIndex((row) => row.id === id)
    if (index < 0) return undefined

    const updated: ClientDocumentMaster = {
      ...clientDocumentStore[index],
      documentType: data.documentType.trim(),
      description: data.description.trim(),
      applicableFor: [...data.applicableFor],
      isMandatory: data.isMandatory,
      status: data.status,
      updatedBy: getMasterActor(),
      updatedAt: nowIso(),
    }
    clientDocumentStore = [
      ...clientDocumentStore.slice(0, index),
      updated,
      ...clientDocumentStore.slice(index + 1),
    ]
    return updated
  },

  setStatus(id: string, status: MasterRecordStatus): ClientDocumentMaster | undefined {
    const existing = clientDocumentStore.find((row) => row.id === id)
    if (!existing) return undefined
    return this.update(id, {
      documentType: existing.documentType,
      description: existing.description,
      applicableFor: existing.applicableFor,
      isMandatory: existing.isMandatory,
      status,
    })
  },
}

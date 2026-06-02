import { SEED_GST_RATES, SEED_TDS_SECTIONS } from '@/shared/data/mockTaxMasters'
import { getMasterActor } from '@/shared/utils/masterActor'
import type {
  GstRate,
  GstRateFormData,
  SelectOption,
  TaxMasterListFilters,
  TdsApplicableOn,
  TdsSection,
  TdsSectionFormData,
} from '@/shared/types/taxMaster'
import type { MasterRecordStatus } from '@/shared/types/masterCommon'

function nowIso() {
  return new Date().toISOString()
}

function generateGstId(): string {
  return `gst-${Math.floor(1000 + Math.random() * 9000)}`
}

function generateTdsId(): string {
  return `tds-${Math.floor(1000 + Math.random() * 9000)}`
}

let gstStore: GstRate[] = [...SEED_GST_RATES]
let tdsStore: TdsSection[] = [...SEED_TDS_SECTIONS]

function parsePercent(value: string): number | null {
  const trimmed = value.trim()
  if (!trimmed) return null
  const num = Number(trimmed)
  if (Number.isNaN(num) || num < 0 || num > 100) return null
  return num
}

function parseThreshold(value: string): number | null {
  const trimmed = value.trim()
  if (!trimmed) return null
  const num = Number(trimmed)
  if (Number.isNaN(num) || num < 0) return null
  return num
}

export const taxMasterService = {
  listGst(filters: TaxMasterListFilters = {}): GstRate[] {
    const { status = 'all' } = filters
    let rows = [...gstStore]
    if (status !== 'all') {
      rows = rows.filter((row) => row.status === status)
    }
    return rows.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
  },

  listTds(filters: TaxMasterListFilters = {}): TdsSection[] {
    const { status = 'all', applicableOn = 'all' } = filters
    let rows = [...tdsStore]
    if (status !== 'all') {
      rows = rows.filter((row) => row.status === status)
    }
    if (applicableOn !== 'all') {
      rows = rows.filter(
        (row) =>
          row.applicableOn === applicableOn ||
          (applicableOn !== 'both' && row.applicableOn === 'both'),
      )
    }
    return rows.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
  },

  getGstById(id: string): GstRate | undefined {
    return gstStore.find((row) => row.id === id)
  },

  getTdsById(id: string): TdsSection | undefined {
    return tdsStore.find((row) => row.id === id)
  },

  listActiveGstOptions(): SelectOption[] {
    return gstStore
      .filter((row) => row.status === 'active')
      .sort((a, b) => a.ratePercent - b.ratePercent)
      .map((row) => ({
        value: row.id,
        label: `${row.slabName} (${row.ratePercent}%)`,
      }))
  },

  listActiveTdsOptions(): SelectOption[] {
    return tdsStore
      .filter((row) => row.status === 'active')
      .sort((a, b) => a.sectionCode.localeCompare(b.sectionCode))
      .map((row) => ({
        value: row.id,
        label: `${row.sectionCode} (${row.ratePercent}%)`,
      }))
  },

  getGstLabel(id: string | null | undefined): string {
    if (!id) return '—'
    const row = gstStore.find((r) => r.id === id)
    return row ? `${row.slabName}` : '—'
  },

  getGstPercent(id: string | null | undefined): number | null {
    if (!id) return null
    return gstStore.find((r) => r.id === id)?.ratePercent ?? null
  },

  getTdsLabel(id: string | null | undefined): string {
    if (!id) return '—'
    const row = tdsStore.find((r) => r.id === id)
    return row ? row.sectionCode : '—'
  },

  getTdsPercent(id: string | null | undefined): number | null {
    if (!id) return null
    return tdsStore.find((r) => r.id === id)?.ratePercent ?? null
  },

  createGst(data: GstRateFormData): GstRate {
    const actor = getMasterActor()
    const timestamp = nowIso()
    const ratePercent = parsePercent(data.ratePercent) ?? 0
    const record: GstRate = {
      id: generateGstId(),
      slabName: data.slabName.trim(),
      ratePercent,
      description: data.description.trim(),
      status: data.status,
      createdBy: actor,
      updatedBy: actor,
      createdAt: timestamp,
      updatedAt: timestamp,
    }
    gstStore = [record, ...gstStore]
    return record
  },

  updateGst(id: string, data: GstRateFormData): GstRate | undefined {
    const index = gstStore.findIndex((row) => row.id === id)
    if (index < 0) return undefined
    const ratePercent = parsePercent(data.ratePercent) ?? gstStore[index].ratePercent
    const updated: GstRate = {
      ...gstStore[index],
      slabName: data.slabName.trim(),
      ratePercent,
      description: data.description.trim(),
      status: data.status,
      updatedBy: getMasterActor(),
      updatedAt: nowIso(),
    }
    gstStore = [...gstStore.slice(0, index), updated, ...gstStore.slice(index + 1)]
    return updated
  },

  setGstStatus(id: string, status: MasterRecordStatus): GstRate | undefined {
    const existing = gstStore.find((row) => row.id === id)
    if (!existing) return undefined
    return this.updateGst(id, {
      slabName: existing.slabName,
      ratePercent: String(existing.ratePercent),
      description: existing.description,
      status,
    })
  },

  createTds(data: TdsSectionFormData): TdsSection {
    const actor = getMasterActor()
    const timestamp = nowIso()
    const ratePercent = parsePercent(data.ratePercent) ?? 0
    const record: TdsSection = {
      id: generateTdsId(),
      sectionCode: data.sectionCode.trim().toUpperCase(),
      ratePercent,
      applicableOn: data.applicableOn,
      thresholdLimit: parseThreshold(data.thresholdLimit),
      description: data.description.trim(),
      status: data.status,
      createdBy: actor,
      updatedBy: actor,
      createdAt: timestamp,
      updatedAt: timestamp,
    }
    tdsStore = [record, ...tdsStore]
    return record
  },

  updateTds(id: string, data: TdsSectionFormData): TdsSection | undefined {
    const index = tdsStore.findIndex((row) => row.id === id)
    if (index < 0) return undefined
    const ratePercent = parsePercent(data.ratePercent) ?? tdsStore[index].ratePercent
    const updated: TdsSection = {
      ...tdsStore[index],
      sectionCode: data.sectionCode.trim().toUpperCase(),
      ratePercent,
      applicableOn: data.applicableOn,
      thresholdLimit: parseThreshold(data.thresholdLimit),
      description: data.description.trim(),
      status: data.status,
      updatedBy: getMasterActor(),
      updatedAt: nowIso(),
    }
    tdsStore = [...tdsStore.slice(0, index), updated, ...tdsStore.slice(index + 1)]
    return updated
  },

  setTdsStatus(id: string, status: MasterRecordStatus): TdsSection | undefined {
    const existing = tdsStore.find((row) => row.id === id)
    if (!existing) return undefined
    return this.updateTds(id, {
      sectionCode: existing.sectionCode,
      ratePercent: String(existing.ratePercent),
      applicableOn: existing.applicableOn,
      thresholdLimit:
        existing.thresholdLimit != null ? String(existing.thresholdLimit) : '',
      description: existing.description,
      status,
    })
  },
}

export const TDS_APPLICABLE_ON_OPTIONS: { value: TdsApplicableOn; label: string }[] = [
  { value: 'customer_invoice', label: 'Customer Invoice' },
  { value: 'vendor_payment', label: 'Vendor Payment' },
  { value: 'both', label: 'Both' },
]

export function getTdsApplicableOnLabel(value: TdsApplicableOn): string {
  return TDS_APPLICABLE_ON_OPTIONS.find((o) => o.value === value)?.label ?? value
}

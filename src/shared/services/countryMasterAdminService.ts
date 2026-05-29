import {
  getMockCountryMasters,
  resetMockCountryMastersCache,
  setMockCountryMastersStore,
} from '@/shared/data/mockCountryMasters'
import { syncVisaOfferingsFromSegments } from '@/shared/data/countryMasterDefaults'
import type {
  BusinessSegment,
  CountryMaster,
  CountryMasterFormData,
  CountryMasterKpiCounts,
  CountryMasterListFilters,
  CountryMasterStatus,
  CountrySegmentAggregates,
  CountrySegmentConfig,
} from '@/shared/types/countryMaster'

function nowIso() {
  return new Date().toISOString()
}

function getStore(): CountryMaster[] {
  return getMockCountryMasters()
}

function persist(rows: CountryMaster[]) {
  setMockCountryMastersStore(rows)
}

function normalizeQuery(query?: string) {
  return query?.trim().toLowerCase() ?? ''
}

function withSyncedOfferings(
  master: Omit<CountryMaster, 'visaOfferings' | 'updatedAt'> & { updatedAt?: string },
): CountryMaster {
  const updatedAt = master.updatedAt ?? nowIso()
  return {
    ...master,
    updatedAt,
    visaOfferings: syncVisaOfferingsFromSegments(master.segments),
  }
}

function generateCountryId(): string {
  const suffix = Math.floor(100 + Math.random() * 900)
  return `CNT-${suffix}`
}

function generateActivityId(): string {
  return `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

export const countryMasterAdminService = {
  list(filters: CountryMasterListFilters = {}): CountryMaster[] {
    const { status = 'all', segment = 'all', processingType = 'all', query } = filters
    const q = normalizeQuery(query)
    let rows = [...getStore()]

    if (status !== 'all') {
      rows = rows.filter((row) => row.status === status)
    }

    if (processingType !== 'all') {
      rows = rows.filter((row) => row.processingType === processingType)
    }

    if (segment !== 'all') {
      rows = rows.filter((row) =>
        row.segments.some((s) => s.segment === segment && s.enabled),
      )
    }

    if (q) {
      rows = rows.filter(
        (row) =>
          row.name.toLowerCase().includes(q) ||
          row.code.toLowerCase().includes(q) ||
          row.region.toLowerCase().includes(q) ||
          row.cities.toLowerCase().includes(q) ||
          (row.embassyNotes?.toLowerCase().includes(q) ?? false) ||
          (row.internalNotes?.toLowerCase().includes(q) ?? false),
      )
    }

    return rows.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
  },

  getById(id: string): CountryMaster | undefined {
    return getStore().find((row) => row.id === id)
  },

  getSegmentConfig(
    countryId: string,
    segment: BusinessSegment,
  ): CountrySegmentConfig | undefined {
    const master = this.getById(countryId)
    return master?.segments.find((s) => s.segment === segment)
  },

  getAggregates(country: CountryMaster, segment?: BusinessSegment): CountrySegmentAggregates {
    const configs = segment
      ? country.segments.filter((s) => s.segment === segment && s.enabled)
      : country.segments.filter((s) => s.enabled)

    let visaTypeCount = 0
    let checklistCount = 0
    for (const cfg of configs) {
      visaTypeCount += cfg.visaTypes.length
      for (const vt of cfg.visaTypes) {
        checklistCount += vt.checklist.length
      }
    }
    return { visaTypeCount, checklistCount }
  },

  getEnabledSegments(country: CountryMaster): BusinessSegment[] {
    return country.segments.filter((s) => s.enabled).map((s) => s.segment)
  },

  getKpiCounts(): CountryMasterKpiCounts {
    const rows = getStore()
    const active = rows.filter((r) => r.status === 'active').length
    const inactive = rows.filter((r) => r.status === 'inactive').length
    const draft = rows.filter((r) => r.status === 'draft').length
    return { total: rows.length, active, inactive, draft }
  },

  isCodeTaken(code: string, excludeId?: string): boolean {
    const normalized = code.trim().toUpperCase()
    return getStore().some(
      (row) => row.code.toUpperCase() === normalized && row.id !== excludeId,
    )
  },

  create(data: CountryMasterFormData): CountryMaster {
    const timestamp = nowIso()
    const record = withSyncedOfferings({
      id: generateCountryId(),
      ...data,
      createdAt: timestamp,
      updatedAt: timestamp,
      activities: [
        {
          id: generateActivityId(),
          timestamp,
          actor: 'Admin User',
          action: 'Country created',
          detail: data.status === 'draft' ? 'Saved as draft' : 'Submitted',
        },
      ],
    })
    persist([record, ...getStore()])
    return record
  },

  update(id: string, data: CountryMasterFormData): CountryMaster | undefined {
    const index = getStore().findIndex((row) => row.id === id)
    if (index < 0) return undefined

    const existing = getStore()[index]
    const timestamp = nowIso()
    const updated = withSyncedOfferings({
      ...existing,
      ...data,
      id: existing.id,
      createdAt: existing.createdAt,
      activities: [
        {
          id: generateActivityId(),
          timestamp,
          actor: 'Admin User',
          action: 'Country updated',
          detail: data.status === 'draft' ? 'Draft saved' : 'Configuration submitted',
        },
        ...existing.activities,
      ],
    })

    const rows = [...getStore()]
    rows[index] = updated
    persist(rows)
    return updated
  },

  saveDraft(id: string | undefined, data: CountryMasterFormData): CountryMaster {
    const draftData = { ...data, status: 'draft' as const }
    if (id) {
      const updated = this.update(id, draftData)
      if (updated) return updated
    }
    return this.create(draftData)
  },

  submit(id: string | undefined, data: CountryMasterFormData): CountryMaster {
    const submitData = {
      ...data,
      status: data.status === 'inactive' ? ('inactive' as const) : ('active' as const),
    }
    if (id) {
      const updated = this.update(id, submitData)
      if (updated) return updated
    }
    return this.create(submitData)
  },

  setStatus(id: string, status: CountryMasterStatus): CountryMaster | undefined {
    const existing = this.getById(id)
    if (!existing) return undefined
    return this.update(id, {
      code: existing.code,
      name: existing.name,
      flag: existing.flag,
      region: existing.region,
      status,
      processingType: existing.processingType,
      embassyNotes: existing.embassyNotes ?? '',
      internalNotes: existing.internalNotes ?? '',
      cities: existing.cities,
      heroPhotoId: existing.heroPhotoId,
      processingTime: existing.processingTime,
      price: existing.price,
      rating: existing.rating,
      trending: existing.trending,
      trendingPercent: existing.trendingPercent,
      visaCategory: existing.visaCategory,
      validity: existing.validity,
      fastMinutes: existing.fastMinutes,
      segments: existing.segments,
    })
  },

  resetStore(): void {
    resetMockCountryMastersCache()
  },
}

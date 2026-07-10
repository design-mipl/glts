import {
  getMockCountryMasters,
  resetMockCountryMastersCache,
  setMockCountryMastersStore,
} from '@/shared/data/mockCountryMasters'
import {
  DEFAULT_JURISDICTION_PROCESSING_RULES,
  generateDocumentRuleId,
  generateJurisdictionId,
} from '@/shared/data/countryJurisdictionDefaults'
import { DEFAULT_TRAVEL_DATE_RISK_THRESHOLDS } from '@/shared/constants/travelDateFeasibility'
import {
  ensureAllSegments,
  emptySegment,
  enrichVisaOfferingsApproxCost,
  syncVisaOfferingsFromSegments,
} from '@/shared/data/countryMasterDefaults'
import { getCountryConfigSummary } from '@/shared/utils/countryConfigValidation'
import type {
  BusinessSegment,
  CountryConfigSummary,
  CountryJurisdictionDocumentRule,
  CountryMaster,
  CountryMasterFormData,
  CountryMasterKpiCounts,
  CountryMasterListFilters,
  CountryMasterStatus,
  CountrySegmentAggregates,
  CountrySegmentConfig,
  CountryVisaJurisdiction,
  CountryVisaType,
  CountryQcChecklistKind,
  CountryQcChecklistTemplate,
  CountryVfsServiceRate,
  JurisdictionDocumentGroup,
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
    visaOfferings: enrichVisaOfferingsApproxCost(
      syncVisaOfferingsFromSegments(master.segments),
      master.price,
    ),
  }
}

function generateCountryId(): string {
  const suffix = Math.floor(100 + Math.random() * 900)
  return `CNT-${suffix}`
}

function generateActivityId(): string {
  return `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

function generateVisaTypeId(): string {
  return `vt-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

function masterToFormData(master: CountryMaster): CountryMasterFormData {
  return {
    code: master.code,
    name: master.name,
    flag: master.flag,
    region: master.region,
    status: master.status,
    processingType: master.processingType,
    embassyNotes: master.embassyNotes ?? '',
    internalNotes: master.internalNotes ?? '',
    cities: master.cities,
    heroPhotoId: master.heroPhotoId,
    processingTime: master.processingTime,
    price: master.price,
    rating: master.rating,
    trending: master.trending,
    trendingPercent: master.trendingPercent,
    visaCategory: master.visaCategory,
    validity: master.validity,
    fastMinutes: master.fastMinutes,
    visaApplicationWindow:
      master.visaApplicationWindow ?? { unit: 'days' as const, value: 30 },
    travelDateRiskThresholds:
      master.travelDateRiskThresholds ?? { ...DEFAULT_TRAVEL_DATE_RISK_THRESHOLDS },
    applicationTrackingUrl: master.applicationTrackingUrl ?? '',
    passportIssueLocations: master.passportIssueLocations ?? [],
    segments: master.segments,
  }
}

function updateMaster(
  id: string,
  updater: (existing: CountryMaster) => CountryMaster,
): CountryMaster | undefined {
  const index = getStore().findIndex((row) => row.id === id)
  if (index < 0) return undefined
  const existing = getStore()[index]
  const timestamp = nowIso()
  const updated = withSyncedOfferings({
    ...updater(existing),
    updatedAt: timestamp,
    activities: [
      {
        id: generateActivityId(),
        timestamp,
        actor: 'Admin User',
        action: 'Configuration updated',
      },
      ...existing.activities,
    ],
  })
  const rows = [...getStore()]
  rows[index] = updated
  persist(rows)
  return updated
}

function mapSegments(
  country: CountryMaster,
  mapper: (segments: CountrySegmentConfig[]) => CountrySegmentConfig[],
): CountryMaster {
  return { ...country, segments: mapper(country.segments) }
}

export const countryMasterAdminService = {
  list(filters: CountryMasterListFilters = {}): CountryMaster[] {
    const { status = 'all', segment = 'all', processingType = 'all', region = 'all', query } = filters
    const q = normalizeQuery(query)
    let rows = [...getStore()]

    if (status !== 'all') {
      rows = rows.filter((row) => row.status === status)
    }

    if (processingType !== 'all') {
      rows = rows.filter((row) => row.processingType === processingType)
    }

    if (region !== 'all' && region) {
      rows = rows.filter((row) => row.region === region)
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
      checklistCount += cfg.commonDocuments?.length ?? 0
      visaTypeCount += cfg.visaTypes.length
      for (const vt of cfg.visaTypes) {
        checklistCount += vt.applicationDocuments?.length ?? 0
        for (const jur of vt.jurisdictions ?? []) {
          checklistCount += jur.documents?.length ?? 0
        }
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

  getValidationWarnings(countryId: string): CountryConfigSummary {
    const country = this.getById(countryId)
    if (!country) {
      return { totalSegments: 0, totalVisaTypes: 0, totalJurisdictions: 0, totalDocuments: 0, warnings: [] }
    }
    return getCountryConfigSummary(country)
  },

  getDistinctRegions(): string[] {
    const regions = new Set(getStore().map((r) => r.region).filter(Boolean))
    return [...regions].sort()
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
      segments: ensureAllSegments(data.segments),
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
      segments: ensureAllSegments(data.segments),
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

  publish(id: string): CountryMaster | undefined {
    const existing = this.getById(id)
    if (!existing) return undefined
    return this.submit(id, { ...masterToFormData(existing), status: 'active' })
  },

  setStatus(id: string, status: CountryMasterStatus): CountryMaster | undefined {
    const existing = this.getById(id)
    if (!existing) return undefined
    return this.update(id, { ...masterToFormData(existing), status })
  },

  duplicate(id: string): CountryMaster | undefined {
    const existing = this.getById(id)
    if (!existing) return undefined
    const timestamp = nowIso()
    const copy = withSyncedOfferings({
      ...existing,
      id: generateCountryId(),
      code: `${existing.code}-COPY`,
      name: `${existing.name} (Copy)`,
      status: 'draft',
      createdAt: timestamp,
      updatedAt: timestamp,
      activities: [
        {
          id: generateActivityId(),
          timestamp,
          actor: 'Admin User',
          action: 'Country duplicated',
          detail: `Duplicated from ${existing.name}`,
        },
      ],
    })
    persist([copy, ...getStore()])
    return copy
  },

  archive(id: string): CountryMaster | undefined {
    const existing = this.getById(id)
    if (!existing) return undefined
    return updateMaster(id, (master) => ({
      ...master,
      status: 'inactive',
      activities: [
        {
          id: generateActivityId(),
          timestamp: nowIso(),
          actor: 'Admin User',
          action: 'Country archived',
        },
        ...master.activities,
      ],
    }))
  },

  toggleSegment(countryId: string, segment: BusinessSegment, enabled: boolean): CountryMaster | undefined {
    return updateMaster(countryId, (master) =>
      mapSegments(master, (segments) =>
        segments.map((s) => (s.segment === segment ? { ...s, enabled } : s)),
      ),
    )
  },

  addVisaType(
    countryId: string,
    segment: BusinessSegment,
    data: Omit<CountryVisaType, 'id' | 'jurisdictions' | 'applicationDocuments' | 'prioritySupport'> & {
      applicationDocuments?: CountryVisaType['applicationDocuments']
    },
  ): CountryMaster | undefined {
    const newVisa: CountryVisaType = {
      id: generateVisaTypeId(),
      prioritySupport: false,
      jurisdictions: [],
      documents: data.documents ?? [],
      applicationDocuments: data.applicationDocuments ?? [],
      ...data,
    }
    return updateMaster(countryId, (master) =>
      mapSegments(master, (segments) =>
        segments.map((s) =>
          s.segment === segment ? { ...s, visaTypes: [...s.visaTypes, newVisa] } : s,
        ),
      ),
    )
  },

  updateVisaType(
    countryId: string,
    segment: BusinessSegment,
    visaTypeId: string,
    data: Partial<CountryVisaType>,
  ): CountryMaster | undefined {
    return updateMaster(countryId, (master) =>
      mapSegments(master, (segments) =>
        segments.map((s) =>
          s.segment === segment
            ? {
                ...s,
                visaTypes: s.visaTypes.map((vt) =>
                  vt.id === visaTypeId ? { ...vt, ...data, id: vt.id } : vt,
                ),
              }
            : s,
        ),
      ),
    )
  },

  removeVisaType(
    countryId: string,
    segment: BusinessSegment,
    visaTypeId: string,
  ): CountryMaster | undefined {
    return updateMaster(countryId, (master) =>
      mapSegments(master, (segments) =>
        segments.map((s) =>
          s.segment === segment
            ? { ...s, visaTypes: s.visaTypes.filter((vt) => vt.id !== visaTypeId) }
            : s,
        ),
      ),
    )
  },

  addJurisdiction(
    countryId: string,
    segment: BusinessSegment,
    visaTypeId: string,
    data: Omit<CountryVisaJurisdiction, 'id' | 'documents' | 'processingRules'> & {
      documents?: CountryVisaJurisdiction['documents']
      processingRules?: CountryVisaJurisdiction['processingRules']
    },
  ): CountryMaster | undefined {
    const newJur: CountryVisaJurisdiction = {
      id: generateJurisdictionId(),
      documents: data.documents ?? [],
      processingRules: data.processingRules ?? { ...DEFAULT_JURISDICTION_PROCESSING_RULES },
      ...data,
    }
    return updateMaster(countryId, (master) =>
      mapSegments(master, (segments) =>
        segments.map((s) =>
          s.segment === segment
            ? {
                ...s,
                visaTypes: s.visaTypes.map((vt) =>
                  vt.id === visaTypeId
                    ? { ...vt, jurisdictions: [...(vt.jurisdictions ?? []), newJur] }
                    : vt,
                ),
              }
            : s,
        ),
      ),
    )
  },

  updateJurisdiction(
    countryId: string,
    segment: BusinessSegment,
    visaTypeId: string,
    jurisdictionId: string,
    data: Partial<CountryVisaJurisdiction>,
  ): CountryMaster | undefined {
    return updateMaster(countryId, (master) =>
      mapSegments(master, (segments) =>
        segments.map((s) =>
          s.segment === segment
            ? {
                ...s,
                visaTypes: s.visaTypes.map((vt) =>
                  vt.id === visaTypeId
                    ? {
                        ...vt,
                        jurisdictions: (vt.jurisdictions ?? []).map((j) =>
                          j.id === jurisdictionId ? { ...j, ...data, id: j.id } : j,
                        ),
                      }
                    : vt,
                ),
              }
            : s,
        ),
      ),
    )
  },

  removeJurisdiction(
    countryId: string,
    segment: BusinessSegment,
    visaTypeId: string,
    jurisdictionId: string,
  ): CountryMaster | undefined {
    return updateMaster(countryId, (master) =>
      mapSegments(master, (segments) =>
        segments.map((s) =>
          s.segment === segment
            ? {
                ...s,
                visaTypes: s.visaTypes.map((vt) =>
                  vt.id === visaTypeId
                    ? {
                        ...vt,
                        jurisdictions: (vt.jurisdictions ?? []).filter((j) => j.id !== jurisdictionId),
                      }
                    : vt,
                ),
              }
            : s,
        ),
      ),
    )
  },

  upsertJurisdictionDocument(
    countryId: string,
    segment: BusinessSegment,
    visaTypeId: string,
    jurisdictionId: string,
    rule: CountryJurisdictionDocumentRule,
  ): CountryMaster | undefined {
    return updateMaster(countryId, (master) =>
      mapSegments(master, (segments) =>
        segments.map((s) =>
          s.segment === segment
            ? {
                ...s,
                visaTypes: s.visaTypes.map((vt) =>
                  vt.id === visaTypeId
                    ? {
                        ...vt,
                        jurisdictions: (vt.jurisdictions ?? []).map((j) => {
                          if (j.id !== jurisdictionId) return j
                          const exists = j.documents.some((d) => d.id === rule.id)
                          const documents = exists
                            ? j.documents.map((d) => (d.id === rule.id ? rule : d))
                            : [...j.documents, rule]
                          return { ...j, documents }
                        }),
                      }
                    : vt,
                ),
              }
            : s,
        ),
      ),
    )
  },

  addJurisdictionDocumentFromMaster(
    countryId: string,
    segment: BusinessSegment,
    visaTypeId: string,
    jurisdictionId: string,
    documentId: string,
    group: JurisdictionDocumentGroup,
    description?: string,
    ownerType?: CountryJurisdictionDocumentRule['ownerType'],
    sampleDocument?: { fileName: string; url: string },
  ): CountryMaster | undefined {
    const rule: CountryJurisdictionDocumentRule = {
      id: generateDocumentRuleId(),
      documentId,
      group,
      mandatory: group !== 'optional',
      ocrEnabled: documentId === 'passport',
      multipleUpload: false,
      commonDocument: group === 'common',
      originalDocument: false,
      ownerType,
      description: description?.trim() || undefined,
      hasSample: Boolean(sampleDocument?.url),
      sampleDocumentName: sampleDocument?.fileName,
      sampleDocumentUrl: sampleDocument?.url,
      acceptedFormats: ['PDF', 'JPG', 'PNG'],
      sortOrder: 0,
    }
    return updateMaster(countryId, (master) =>
      mapSegments(master, (segments) =>
        segments.map((s) =>
          s.segment === segment
            ? {
                ...s,
                visaTypes: s.visaTypes.map((vt) =>
                  vt.id === visaTypeId
                    ? {
                        ...vt,
                        jurisdictions: (vt.jurisdictions ?? []).map((j) => {
                          if (j.id !== jurisdictionId) return j
                          return {
                            ...j,
                            documents: [
                              ...j.documents,
                              { ...rule, sortOrder: j.documents.length },
                            ],
                          }
                        }),
                      }
                    : vt,
                ),
              }
            : s,
        ),
      ),
    )
  },

  reorderJurisdictionDocuments(
    countryId: string,
    segment: BusinessSegment,
    visaTypeId: string,
    jurisdictionId: string,
    documentIds: string[],
  ): CountryMaster | undefined {
    return updateMaster(countryId, (master) =>
      mapSegments(master, (segments) =>
        segments.map((s) =>
          s.segment === segment
            ? {
                ...s,
                visaTypes: s.visaTypes.map((vt) =>
                  vt.id === visaTypeId
                    ? {
                        ...vt,
                        jurisdictions: (vt.jurisdictions ?? []).map((j) => {
                          if (j.id !== jurisdictionId) return j
                          const byId = new Map(j.documents.map((d) => [d.id, d]))
                          const reordered = documentIds
                            .map((id, index) => {
                              const doc = byId.get(id)
                              return doc ? { ...doc, sortOrder: index } : null
                            })
                            .filter((d): d is CountryJurisdictionDocumentRule => d !== null)
                          return { ...j, documents: reordered }
                        }),
                      }
                    : vt,
                ),
              }
            : s,
        ),
      ),
    )
  },

  removeJurisdictionDocument(
    countryId: string,
    segment: BusinessSegment,
    visaTypeId: string,
    jurisdictionId: string,
    documentRuleId: string,
  ): CountryMaster | undefined {
    return updateMaster(countryId, (master) =>
      mapSegments(master, (segments) =>
        segments.map((s) =>
          s.segment === segment
            ? {
                ...s,
                visaTypes: s.visaTypes.map((vt) =>
                  vt.id === visaTypeId
                    ? {
                        ...vt,
                        jurisdictions: (vt.jurisdictions ?? []).map((j) =>
                          j.id === jurisdictionId
                            ? {
                                ...j,
                                documents: j.documents.filter((d) => d.id !== documentRuleId),
                              }
                            : j,
                        ),
                      }
                    : vt,
                ),
              }
            : s,
        ),
      ),
    )
  },

  upsertVisaTypeDocument(
    countryId: string,
    segment: BusinessSegment,
    visaTypeId: string,
    rule: CountryJurisdictionDocumentRule,
  ): CountryMaster | undefined {
    return updateMaster(countryId, (master) =>
      mapSegments(master, (segments) =>
        segments.map((s) =>
          s.segment === segment
            ? {
                ...s,
                visaTypes: s.visaTypes.map((vt) => {
                  if (vt.id !== visaTypeId) return vt
                  const documents = vt.documents ?? []
                  const exists = documents.some((d) => d.id === rule.id)
                  return {
                    ...vt,
                    documents: exists
                      ? documents.map((d) => (d.id === rule.id ? rule : d))
                      : [...documents, rule],
                  }
                }),
              }
            : s,
        ),
      ),
    )
  },

  addVisaTypeDocumentFromMaster(
    countryId: string,
    segment: BusinessSegment,
    visaTypeId: string,
    documentId: string,
    group: JurisdictionDocumentGroup,
    description?: string,
    ownerType?: CountryJurisdictionDocumentRule['ownerType'],
    sampleDocument?: { fileName: string; url: string },
  ): CountryMaster | undefined {
    const rule: CountryJurisdictionDocumentRule = {
      id: generateDocumentRuleId(),
      documentId,
      group,
      mandatory: group !== 'optional',
      ocrEnabled: documentId === 'passport',
      multipleUpload: false,
      commonDocument: group === 'common',
      originalDocument: false,
      ownerType,
      description: description?.trim() || undefined,
      hasSample: Boolean(sampleDocument?.url),
      sampleDocumentName: sampleDocument?.fileName,
      sampleDocumentUrl: sampleDocument?.url,
      acceptedFormats: ['PDF', 'JPG', 'PNG'],
      sortOrder: 0,
    }
    return updateMaster(countryId, (master) =>
      mapSegments(master, (segments) =>
        segments.map((s) =>
          s.segment === segment
            ? {
                ...s,
                visaTypes: s.visaTypes.map((vt) => {
                  if (vt.id !== visaTypeId) return vt
                  const documents = vt.documents ?? []
                  return {
                    ...vt,
                    documents: [...documents, { ...rule, sortOrder: documents.length }],
                  }
                }),
              }
            : s,
        ),
      ),
    )
  },

  reorderVisaTypeDocuments(
    countryId: string,
    segment: BusinessSegment,
    visaTypeId: string,
    documentIds: string[],
  ): CountryMaster | undefined {
    return updateMaster(countryId, (master) =>
      mapSegments(master, (segments) =>
        segments.map((s) =>
          s.segment === segment
            ? {
                ...s,
                visaTypes: s.visaTypes.map((vt) => {
                  if (vt.id !== visaTypeId) return vt
                  const documents = vt.documents ?? []
                  const byId = new Map(documents.map((d) => [d.id, d]))
                  const reordered = documentIds
                    .map((id, index) => {
                      const doc = byId.get(id)
                      return doc ? { ...doc, sortOrder: index } : null
                    })
                    .filter((d): d is CountryJurisdictionDocumentRule => d !== null)
                  return { ...vt, documents: reordered }
                }),
              }
            : s,
        ),
      ),
    )
  },

  removeVisaTypeDocument(
    countryId: string,
    segment: BusinessSegment,
    visaTypeId: string,
    documentRuleId: string,
  ): CountryMaster | undefined {
    return updateMaster(countryId, (master) =>
      mapSegments(master, (segments) =>
        segments.map((s) =>
          s.segment === segment
            ? {
                ...s,
                visaTypes: s.visaTypes.map((vt) =>
                  vt.id === visaTypeId
                    ? {
                        ...vt,
                        documents: (vt.documents ?? []).filter((d) => d.id !== documentRuleId),
                      }
                    : vt,
                ),
              }
            : s,
        ),
      ),
    )
  },

  createEmptyCountryFormData(name: string, code: string, region: string): CountryMasterFormData {
    return {
      code,
      name,
      flag: '🏳️',
      region,
      status: 'draft',
      processingType: 'embassy',
      embassyNotes: '',
      internalNotes: '',
      cities: '',
      heroPhotoId: 'default',
      processingTime: 'TBD',
      price: 0,
      rating: 0,
      trending: false,
      trendingPercent: 0,
      visaCategory: 'Tourism',
      validity: '30 days',
      visaApplicationWindow: { unit: 'days', value: 30 },
      travelDateRiskThresholds: { ...DEFAULT_TRAVEL_DATE_RISK_THRESHOLDS },
      applicationTrackingUrl: '',
      passportIssueLocations: [],
      segments: ensureAllSegments([
        emptySegment('retail', true),
        emptySegment('corporate', false),
        emptySegment('marine', false),
        emptySegment('b2bAgents', false),
      ]),
    }
  },

  resetStore(): void {
    resetMockCountryMastersCache()
  },

  saveQcChecklistTemplate(
    countryId: string,
    segment: BusinessSegment,
    visaTypeId: string,
    kind: CountryQcChecklistKind,
    template: CountryQcChecklistTemplate,
    jurisdictionId?: string,
  ): CountryMaster | undefined {
    const field = kind === 'ops' ? 'opsQcChecklist' : 'docsQcChecklist'
    if (jurisdictionId) {
      return this.updateJurisdiction(countryId, segment, visaTypeId, jurisdictionId, {
        [field]: template,
      })
    }
    return this.updateVisaType(countryId, segment, visaTypeId, { [field]: template })
  },

  saveVfsServiceRates(
    countryId: string,
    segment: BusinessSegment,
    visaTypeId: string,
    rates: CountryVfsServiceRate[],
    jurisdictionId?: string,
  ): CountryMaster | undefined {
    if (jurisdictionId) {
      return this.updateJurisdiction(countryId, segment, visaTypeId, jurisdictionId, {
        vfsServiceRates: rates,
      })
    }
    return this.updateVisaType(countryId, segment, visaTypeId, { vfsServiceRates: rates })
  },
}

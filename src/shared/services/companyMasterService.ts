import {
  getMockCompanies,
  setMockCompaniesStore,
} from '@/shared/data/mockCompanies'
import type {
  CompanyActivity,
  CompanyMaster,
  CompanyMasterFormData,
  CompanyMasterListFilters,
} from '@/shared/types/companyMaster'

const ADMIN_ACTOR = 'Admin User'

function nowIso() {
  return new Date().toISOString()
}

function getStore(): CompanyMaster[] {
  return getMockCompanies()
}

function persist(rows: CompanyMaster[]) {
  setMockCompaniesStore(rows)
}

function normalizeQuery(query?: string) {
  return query?.trim().toLowerCase() ?? ''
}

function generateCompanyId(): string {
  const suffix = Math.floor(1000 + Math.random() * 9000)
  return `CMP-${suffix}`
}

function generateActivityId(): string {
  return `cmp-act-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

function makeActivity(action: string, detail: string): CompanyActivity {
  return {
    id: generateActivityId(),
    timestamp: nowIso(),
    actor: ADMIN_ACTOR,
    action,
    detail,
  }
}

function formToCompany(data: CompanyMasterFormData): Omit<CompanyMaster, 'id' | 'createdAt' | 'updatedAt' | 'activities'> {
  return {
    companyName: data.companyName.trim(),
    companyType: data.companyType,
    industryType: data.industryType.trim(),
    contactPersonName: data.contactPersonName.trim(),
    contactNumber: data.contactNumber.trim(),
    emailAddress: data.emailAddress.trim(),
    companyAddress: data.companyAddress.trim(),
    billingEntityName: data.billingEntityName.trim() || data.companyName.trim(),
    billingAddress: data.billingAddress.trim() || data.companyAddress.trim(),
    gstNumber: data.gstNumber.trim(),
    panNumber: data.panNumber.trim(),
  }
}

export const companyMasterService = {
  list(filters: CompanyMasterListFilters = {}): CompanyMaster[] {
    const { query, industryType } = filters
    const q = normalizeQuery(query)
    let rows = [...getStore()]

    if (industryType) {
      rows = rows.filter((r) => r.industryType === industryType)
    }

    if (q) {
      rows = rows.filter(
        (r) =>
          r.companyName.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q) ||
          r.gstNumber.toLowerCase().includes(q) ||
          r.panNumber.toLowerCase().includes(q),
      )
    }

    return rows.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  },

  getById(id: string): CompanyMaster | undefined {
    return getStore().find((r) => r.id === id)
  },

  create(data: CompanyMasterFormData): CompanyMaster {
    const ts = nowIso()
    const record: CompanyMaster = {
      id: generateCompanyId(),
      ...formToCompany(data),
      createdAt: ts,
      updatedAt: ts,
      activities: [makeActivity('Created', `Company ${data.companyName} created`)],
    }
    persist([record, ...getStore()])
    return record
  },

  update(id: string, data: CompanyMasterFormData): CompanyMaster | undefined {
    const store = getStore()
    const idx = store.findIndex((r) => r.id === id)
    if (idx < 0) return undefined
    const updated: CompanyMaster = {
      ...store[idx],
      ...formToCompany(data),
      updatedAt: nowIso(),
      activities: [
        makeActivity('Updated', `Company ${data.companyName} updated`),
        ...store[idx].activities,
      ],
    }
    const next = [...store]
    next[idx] = updated
    persist(next)
    return updated
  },

  getSelectOptions(): { value: string; label: string; gstNumber: string }[] {
    return this.list().map((c) => ({
      value: c.id,
      label: `${c.companyName} (${c.id})`,
      gstNumber: c.gstNumber,
    }))
  },
}

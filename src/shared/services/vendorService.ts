import { getMockVendors, setMockVendorsStore } from '@/shared/data/mockVendors'
import type {
  Vendor,
  VendorActivity,
  VendorDocument,
  VendorFormData,
  VendorListFilters,
  VendorListingAggregates,
  VendorServiceMapping,
  VendorStatus,
} from '@/shared/types/vendor'

const ADMIN_ACTOR = 'Admin User'

function nowIso() {
  return new Date().toISOString()
}

function getStore(): Vendor[] {
  return getMockVendors()
}

function persist(rows: Vendor[]) {
  setMockVendorsStore(rows)
}

function normalizeQuery(query?: string) {
  return query?.trim().toLowerCase() ?? ''
}

function generateVendorId(): string {
  const nums = getStore().map((v) => parseInt(v.vendorId.replace('VND-', ''), 10)).filter((n) => !Number.isNaN(n))
  const next = nums.length > 0 ? Math.max(...nums) + 1 : 1
  return `VND-${String(next).padStart(3, '0')}`
}

function generateInternalId(): string {
  return `vnd-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

function generateActivityId(): string {
  return `vnd-act-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

function generateMappingId(): string {
  return `vsm-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

function generateDocumentId(): string {
  return `vd-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

function computeMargin(vendorRate: number, clientBillingRate: number): number {
  return clientBillingRate - vendorRate
}

function normalizeMapping(mapping: Omit<VendorServiceMapping, 'margin'> & { margin?: number }): VendorServiceMapping {
  return {
    ...mapping,
    margin: computeMargin(mapping.vendorRate, mapping.clientBillingRate),
  }
}

function makeActivity(action: string, detail: string, actor = ADMIN_ACTOR): VendorActivity {
  return {
    id: generateActivityId(),
    timestamp: nowIso(),
    actor,
    action,
    detail,
  }
}

function formToVendorBase(data: VendorFormData): Omit<Vendor, 'id' | 'vendorId' | 'createdAt' | 'updatedAt' | 'activities' | 'documents' | 'bills' | 'payments' | 'finance' | 'outstandingAmount' | 'createdBy' | 'updatedBy'> {
  return {
    vendorName: data.vendorName.trim(),
    vendorCategory: data.vendorCategory,
    vendorType: data.vendorType,
    contactPerson: data.contactPerson.trim(),
    mobileNumber: data.mobileNumber.trim(),
    emailAddress: data.emailAddress.trim(),
    address: data.address.trim(),
    city: data.city.trim(),
    state: data.state.trim(),
    country: data.country.trim(),
    serviceCountry: data.serviceCountry.trim(),
    visaType: data.visaType.trim(),
    panNumber: data.panNumber.trim(),
    gstApplicable: data.gstApplicable,
    gstNumber: data.gstNumber.trim(),
    status: data.status,
    commercial: { ...data.commercial },
    bank: { ...data.bank },
    serviceMappings: data.serviceMappings.map((m) => normalizeMapping(m)),
  }
}

function computeOutstanding(vendor: Pick<Vendor, 'bills'>): number {
  return vendor.bills.reduce((sum, b) => sum + (b.invoiceAmount - b.paidAmount), 0)
}

export const vendorService = {
  list(filters: VendorListFilters = {}): Vendor[] {
    const {
      category = 'all',
      vendorType = 'all',
      serviceMasterId,
      status = 'all',
      gstApplicable = 'all',
      paymentTerms = 'all',
      dateFrom,
      dateTo,
      query,
    } = filters
    const q = normalizeQuery(query)
    let rows = [...getStore()]

    if (category !== 'all') rows = rows.filter((r) => r.vendorCategory === category)
    if (vendorType !== 'all') rows = rows.filter((r) => r.vendorType === vendorType)
    if (status !== 'all') rows = rows.filter((r) => r.status === status)
    if (gstApplicable === 'yes') rows = rows.filter((r) => r.gstApplicable)
    if (gstApplicable === 'no') rows = rows.filter((r) => !r.gstApplicable)
    if (paymentTerms !== 'all') rows = rows.filter((r) => r.commercial.paymentTerms === paymentTerms)
    if (serviceMasterId) {
      rows = rows.filter((r) => r.serviceMappings.some((m) => m.serviceMasterId === serviceMasterId))
    }
    if (dateFrom) rows = rows.filter((r) => r.updatedAt.slice(0, 10) >= dateFrom)
    if (dateTo) rows = rows.filter((r) => r.updatedAt.slice(0, 10) <= dateTo)

    if (q) {
      rows = rows.filter(
        (r) =>
          r.vendorName.toLowerCase().includes(q) ||
          r.vendorId.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q) ||
          r.contactPerson.toLowerCase().includes(q) ||
          r.emailAddress.toLowerCase().includes(q),
      )
    }

    return rows.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  },

  getById(id: string): Vendor | undefined {
    return getStore().find((r) => r.id === id)
  },

  getListingAggregates(vendors?: Vendor[]): VendorListingAggregates {
    const rows = vendors ?? getStore()
    const active = rows.filter((r) => r.status === 'active')
    const inactive = rows.filter((r) => r.status === 'inactive')
    const totalOutstanding = rows.reduce((sum, r) => sum + r.outstandingAmount, 0)
    const vendorsPendingPayment = rows.filter(
      (r) => r.bills.some((b) => b.status === 'pending' || b.status === 'overdue' || b.status === 'partially_paid'),
    ).length

    return {
      totalVendors: rows.length,
      activeVendors: active.length,
      inactiveVendors: inactive.length,
      totalOutstanding,
      vendorsPendingPayment,
    }
  },

  vendorToFormData(vendor: Vendor): VendorFormData {
    return {
      vendorName: vendor.vendorName,
      vendorCategory: vendor.vendorCategory,
      vendorType: vendor.vendorType,
      contactPerson: vendor.contactPerson,
      mobileNumber: vendor.mobileNumber,
      emailAddress: vendor.emailAddress,
      address: vendor.address,
      city: vendor.city,
      state: vendor.state,
      country: vendor.country,
      serviceCountry: vendor.serviceCountry,
      visaType: vendor.visaType,
      panNumber: vendor.panNumber,
      gstApplicable: vendor.gstApplicable,
      gstNumber: vendor.gstNumber,
      status: vendor.status,
      commercial: { ...vendor.commercial },
      bank: { ...vendor.bank },
      serviceMappings: vendor.serviceMappings.map((m) => ({ ...m })),
    }
  },

  create(data: VendorFormData): Vendor {
    const id = generateInternalId()
    const vendorId = generateVendorId()
    const ts = nowIso()
    const base = formToVendorBase(data)
    const vendor: Vendor = {
      id,
      vendorId,
      ...base,
      documents: [],
      bills: [],
      payments: [],
      finance: {
        totalInvoiceValue: 0,
        totalPaid: 0,
        outstanding: 0,
        overdueAmount: 0,
        gstTotal: 0,
        tdsDeducted: 0,
        totalPayable: 0,
      },
      outstandingAmount: 0,
      activities: [makeActivity('Vendor Created', `${data.vendorName} onboarded as vendor.`)],
      createdAt: ts,
      updatedAt: ts,
      createdBy: ADMIN_ACTOR,
      updatedBy: ADMIN_ACTOR,
    }
    persist([vendor, ...getStore()])
    return vendor
  },

  update(id: string, data: VendorFormData): Vendor | undefined {
    const rows = getStore()
    const index = rows.findIndex((r) => r.id === id)
    if (index < 0) return undefined

    const existing = rows[index]
    const base = formToVendorBase(data)
    const updated: Vendor = {
      ...existing,
      ...base,
      updatedAt: nowIso(),
      updatedBy: ADMIN_ACTOR,
      activities: [
        makeActivity('Commercial Details Updated', 'Vendor profile and commercial details saved.'),
        ...existing.activities,
      ],
    }
    updated.outstandingAmount = computeOutstanding(updated)
    const next = [...rows]
    next[index] = updated
    persist(next)
    return updated
  },

  setStatus(id: string, status: VendorStatus): Vendor | undefined {
    const rows = getStore()
    const index = rows.findIndex((r) => r.id === id)
    if (index < 0) return undefined

    const existing = rows[index]
    const action = status === 'active' ? 'Vendor Activated' : 'Vendor Deactivated'
    const updated: Vendor = {
      ...existing,
      status,
      updatedAt: nowIso(),
      updatedBy: ADMIN_ACTOR,
      activities: [makeActivity(action, `${existing.vendorName} status set to ${status}.`), ...existing.activities],
    }
    const next = [...rows]
    next[index] = updated
    persist(next)
    return updated
  },

  addServiceMapping(vendorId: string, mapping: Omit<VendorServiceMapping, 'id' | 'margin'>): VendorServiceMapping | undefined {
    const rows = getStore()
    const index = rows.findIndex((r) => r.id === vendorId)
    if (index < 0) return undefined

    const normalized = normalizeMapping({ ...mapping, id: generateMappingId() })
    const existing = rows[index]
    const updated: Vendor = {
      ...existing,
      serviceMappings: [...existing.serviceMappings, normalized],
      updatedAt: nowIso(),
      updatedBy: ADMIN_ACTOR,
      activities: [makeActivity('Service Added', `Service mapping added (rate ₹${normalized.vendorRate}).`), ...existing.activities],
    }
    const next = [...rows]
    next[index] = updated
    persist(next)
    return normalized
  },

  updateServiceMapping(
    vendorId: string,
    mappingId: string,
    patch: Partial<Omit<VendorServiceMapping, 'id' | 'margin'>>,
  ): VendorServiceMapping | undefined {
    const rows = getStore()
    const index = rows.findIndex((r) => r.id === vendorId)
    if (index < 0) return undefined

    const existing = rows[index]
    const mapIndex = existing.serviceMappings.findIndex((m) => m.id === mappingId)
    if (mapIndex < 0) return undefined

    const current = existing.serviceMappings[mapIndex]
    const merged = normalizeMapping({ ...current, ...patch })
    const mappings = [...existing.serviceMappings]
    mappings[mapIndex] = merged

    const updated: Vendor = {
      ...existing,
      serviceMappings: mappings,
      updatedAt: nowIso(),
      updatedBy: ADMIN_ACTOR,
      activities: [makeActivity('Service Updated', 'Service rate mapping updated.'), ...existing.activities],
    }
    const next = [...rows]
    next[index] = updated
    persist(next)
    return merged
  },

  removeServiceMapping(vendorId: string, mappingId: string): boolean {
    const rows = getStore()
    const index = rows.findIndex((r) => r.id === vendorId)
    if (index < 0) return false

    const existing = rows[index]
    const updated: Vendor = {
      ...existing,
      serviceMappings: existing.serviceMappings.filter((m) => m.id !== mappingId),
      updatedAt: nowIso(),
      updatedBy: ADMIN_ACTOR,
    }
    const next = [...rows]
    next[index] = updated
    persist(next)
    return true
  },

  addDocument(
    vendorId: string,
    doc: Omit<VendorDocument, 'id' | 'uploadedAt' | 'uploadedBy'>,
  ): VendorDocument | undefined {
    const rows = getStore()
    const index = rows.findIndex((r) => r.id === vendorId)
    if (index < 0) return undefined

    const newDoc: VendorDocument = {
      ...doc,
      id: generateDocumentId(),
      uploadedAt: nowIso(),
      uploadedBy: ADMIN_ACTOR,
    }
    const existing = rows[index]
    const updated: Vendor = {
      ...existing,
      documents: [...existing.documents, newDoc],
      updatedAt: nowIso(),
      updatedBy: ADMIN_ACTOR,
      activities: [makeActivity('Document Uploaded', `${doc.documentName} uploaded.`), ...existing.activities],
    }
    const next = [...rows]
    next[index] = updated
    persist(next)
    return newDoc
  },

  replaceDocument(
    vendorId: string,
    documentId: string,
    patch: Partial<Pick<VendorDocument, 'fileName' | 'documentName' | 'documentType'>>,
  ): VendorDocument | undefined {
    const rows = getStore()
    const index = rows.findIndex((r) => r.id === vendorId)
    if (index < 0) return undefined

    const existing = rows[index]
    const docIndex = existing.documents.findIndex((d) => d.id === documentId)
    if (docIndex < 0) return undefined

    const docs = [...existing.documents]
    docs[docIndex] = {
      ...docs[docIndex],
      ...patch,
      uploadedAt: nowIso(),
      uploadedBy: ADMIN_ACTOR,
    }
    const updated: Vendor = {
      ...existing,
      documents: docs,
      updatedAt: nowIso(),
      updatedBy: ADMIN_ACTOR,
      activities: [makeActivity('Document Uploaded', `${docs[docIndex].documentName} replaced.`), ...existing.activities],
    }
    const next = [...rows]
    next[index] = updated
    persist(next)
    return docs[docIndex]
  },
}

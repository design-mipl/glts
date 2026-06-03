import { getMockInvoices, setMockInvoicesStore } from '@/shared/data/mockInvoices'
import type {
  BillingReportData,
  BillingReportFilters,
  CreditNoteAdjustment,
  Invoice,
  InvoiceActivity,
  InvoiceListFilters,
  InvoiceStatus,
  InvoiceWorkspaceState,
  ShareInvoicePayload,
} from '@/shared/types/invoice'
import { findAgreementForCompany, buildLineItems } from '@/shared/utils/invoiceBillingEngine'
import {
  computeInvoiceBillingAdjustment,
  mergeTotalsWithAdjustment,
} from '@/shared/utils/invoiceBillingAdjustment'
import { getBilledItemsRegistry } from '@/shared/utils/invoiceBilledItemsRegistry'
import {
  computeInvoiceTotals,
  recalculateLineItems,
} from '@/shared/utils/invoiceCalculations'

const ADMIN_ACTOR = 'Finance Admin'

const CUSTOMER_VISIBLE_STATUSES: InvoiceStatus[] = [
  'submitted',
  'shared',
  'partially_paid',
  'paid',
  'overdue',
]

function nowIso() {
  return new Date().toISOString()
}

function todayDate() {
  return nowIso().slice(0, 10)
}

function dueDateFromTerms(days = 30) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

function getStore(): Invoice[] {
  return getMockInvoices()
}

function persist(rows: Invoice[]) {
  setMockInvoicesStore(rows)
}

function generateInvoiceId(): string {
  const suffix = Math.floor(8800 + Math.random() * 200)
  return `GLTS-INV-${suffix}`
}

function generateInternalId(): string {
  return `INV-${Math.floor(100 + Math.random() * 900)}`
}

function generateActivityId(): string {
  return `inv-act-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

function makeActivity(action: string, detail: string): InvoiceActivity {
  return {
    id: generateActivityId(),
    timestamp: nowIso(),
    actor: ADMIN_ACTOR,
    action,
    detail,
  }
}

function lockLineItems(workspace: InvoiceWorkspaceState, lock: boolean) {
  return workspace.lineItems.map(li => ({
    ...li,
    billingStatus: lock && li.included !== false ? ('billed' as const) : li.billingStatus,
  }))
}

function buildTotalsWithAdjustment(workspace: InvoiceWorkspaceState, agreementId?: string) {
  const lineItems = recalculateLineItems(workspace.lineItems, workspace.taxConfig)
  const baseTotals = computeInvoiceTotals(lineItems, workspace.taxConfig, workspace.additionalCharges)
  const agreement =
    findAgreementForCompany(workspace.selection.companyName) ??
    (agreementId ? undefined : undefined)
  const adjustment = computeInvoiceBillingAdjustment(agreement, baseTotals.finalAmount)
  return {
    lineItems,
    totals: mergeTotalsWithAdjustment(baseTotals, adjustment),
    billingAdjustment: adjustment.snapshot,
    agreementId: agreement?.id ?? agreementId,
  }
}

function workspaceToInvoice(
  workspace: InvoiceWorkspaceState,
  status: InvoiceStatus,
  existing?: Invoice,
  lockItems = false,
): Invoice {
  const processedLineItems = lockItems ? lockLineItems(workspace, true) : workspace.lineItems
  const processedWorkspace = { ...workspace, lineItems: processedLineItems }
  const { lineItems, totals, billingAdjustment, agreementId } = buildTotalsWithAdjustment(
    { ...processedWorkspace, lineItems: recalculateLineItems(processedLineItems, workspace.taxConfig) },
    existing?.agreementId ?? workspace.agreementId,
  )
  const billingEntity = workspace.selection.billingEntityOverride || workspace.selection.billingEntity
  const gltsRefs = [
    ...new Set(lineItems.map(li => li.applicationId).filter(Boolean) as string[]),
  ]
  const batchIds = [
    ...new Set([
      ...workspace.selection.batchIds,
      ...lineItems.map(li => li.batchId).filter(Boolean) as string[],
    ]),
  ]

  const base: Invoice = {
    id: existing?.id ?? generateInternalId(),
    invoiceId: existing?.invoiceId ?? generateInvoiceId(),
    invoiceType: workspace.selection.invoiceType,
    billingMode: workspace.selection.billingMode,
    companyId: workspace.selection.companyId,
    companyName: workspace.selection.companyName,
    billingEntity,
    vesselId: workspace.selection.vesselId,
    vesselName: workspace.selection.vesselName,
    agreementId: agreementId ?? existing?.agreementId,
    poReference: workspace.selection.poReference ?? existing?.poReference,
    gltsReferences: gltsRefs.length ? gltsRefs : workspace.selection.applicationIds,
    batchIds,
    totalApplications: Math.max(
      gltsRefs.length,
      workspace.selection.applicationIds.length,
      batchIds.length ? 1 : 0,
    ),
    lineItems,
    taxConfig: workspace.taxConfig,
    totals,
    billingAdjustment,
    invoiceStatus: status,
    paymentStatus: existing?.paymentStatus ?? 'pending',
    invoiceDate: existing?.invoiceDate ?? todayDate(),
    dueDate: workspace.dueDate || existing?.dueDate || dueDateFromTerms(30),
    paymentTerms: workspace.paymentTerms || existing?.paymentTerms,
    lastUpdated: nowIso(),
    createdAt: existing?.createdAt ?? nowIso(),
    sourceInvoiceId: workspace.sourceInvoiceId ?? existing?.sourceInvoiceId,
    sharedAt: existing?.sharedAt,
    sharedToEmail: existing?.sharedToEmail,
    activities: existing?.activities ?? [],
    attachments: existing?.attachments ?? [],
    payments: existing?.payments ?? [],
  }

  return base
}

function matchesFilters(invoice: Invoice, filters?: InvoiceListFilters): boolean {
  if (!filters) return true
  const q = filters.query?.trim().toLowerCase()
  if (q) {
    const haystack = [
      invoice.invoiceId,
      invoice.companyName,
      invoice.billingEntity,
      invoice.vesselName ?? '',
      invoice.poReference ?? '',
      ...invoice.gltsReferences,
      ...invoice.batchIds,
    ]
      .join(' ')
      .toLowerCase()
    if (!haystack.includes(q)) return false
  }
  if (filters.company && !invoice.companyName.toLowerCase().includes(filters.company.toLowerCase())) return false
  if (filters.billingEntity && !invoice.billingEntity.toLowerCase().includes(filters.billingEntity.toLowerCase()))
    return false
  if (filters.vessel && !(invoice.vesselName ?? '').toLowerCase().includes(filters.vessel.toLowerCase())) return false
  if (filters.billingMode && filters.billingMode !== 'all' && invoice.billingMode !== filters.billingMode)
    return false
  if (filters.applicationId && !invoice.gltsReferences.some(r => r.includes(filters.applicationId!))) return false
  if (filters.batchId && !invoice.batchIds.some(b => b.includes(filters.batchId!))) return false
  if (filters.invoiceType && filters.invoiceType !== 'all' && invoice.invoiceType !== filters.invoiceType) return false
  if (filters.invoiceStatus && filters.invoiceStatus !== 'all' && invoice.invoiceStatus !== filters.invoiceStatus)
    return false
  if (filters.paymentStatus && filters.paymentStatus !== 'all' && invoice.paymentStatus !== filters.paymentStatus)
    return false
  if (filters.country && !(invoice.country ?? '').toLowerCase().includes(filters.country.toLowerCase())) return false
  if (filters.visaType && !(invoice.visaType ?? '').toLowerCase().includes(filters.visaType.toLowerCase())) return false
  if (filters.dateFrom && invoice.invoiceDate < filters.dateFrom) return false
  if (filters.dateTo && invoice.invoiceDate > filters.dateTo) return false
  return true
}

function mergeWorkspace(workspace: InvoiceWorkspaceState) {
  const built = buildLineItems(workspace.selection)
  return {
    ...workspace,
    lineItems: workspace.lineItems.length ? workspace.lineItems : built.lineItems,
    taxConfig: workspace.taxConfig.gstPercentage ? workspace.taxConfig : built.taxConfig,
    agreementId: built.agreementId ?? workspace.agreementId,
  }
}

export const invoiceService = {
  list(filters?: InvoiceListFilters): Invoice[] {
    return getStore().filter(inv => matchesFilters(inv, filters))
  },

  getById(id: string): Invoice | undefined {
    return getStore().find(inv => inv.id === id || inv.invoiceId === id)
  },

  getBilledItemsRegistry(): Set<string> {
    return getBilledItemsRegistry()
  },

  getExistingChargesForApplication(applicationId: string): string[] {
    const services: string[] = []
    for (const key of getBilledItemsRegistry()) {
      const [appId, , serviceType] = key.split('::')
      if (appId === applicationId && serviceType) services.push(serviceType)
    }
    return [...new Set(services)]
  },

  saveDraft(workspace: InvoiceWorkspaceState): Invoice {
    const store = getStore()
    const existing = workspace.draftInvoiceId ? store.find(i => i.id === workspace.draftInvoiceId) : undefined
    const merged = mergeWorkspace(workspace)
    const invoice = workspaceToInvoice(merged, 'draft', existing)
    if (!existing) {
      invoice.activities = [makeActivity('Draft saved', `Draft invoice ${invoice.invoiceId} saved`)]
    } else {
      invoice.activities = [...existing.activities, makeActivity('Draft updated', 'Workspace changes saved')]
    }
    const next = existing ? store.map(i => (i.id === existing.id ? invoice : i)) : [...store, invoice]
    persist(next)
    return invoice
  },

  submit(workspace: InvoiceWorkspaceState): Invoice {
    const store = getStore()
    const existing = workspace.draftInvoiceId ? store.find(i => i.id === workspace.draftInvoiceId) : undefined
    const merged = mergeWorkspace(workspace)
    const invoice = workspaceToInvoice(merged, 'submitted', existing, true)
    invoice.activities = [
      ...(existing?.activities ?? []),
      makeActivity('Invoice submitted', `Invoice ${invoice.invoiceId} submitted to customer portal`),
    ]
    invoice.attachments = [
      ...invoice.attachments,
      {
        id: `att-${Date.now()}`,
        name: `${invoice.invoiceId}.pdf`,
        type: 'invoice_pdf' as const,
        uploadedAt: nowIso(),
      },
    ]
    const next = existing ? store.map(i => (i.id === existing.id ? invoice : i)) : [...store, invoice]
    persist(next)
    return invoice
  },

  /** @deprecated Use submit() */
  generate(workspace: InvoiceWorkspaceState): Invoice {
    return this.submit(workspace)
  },

  deleteDraft(id: string): boolean {
    const store = getStore()
    const target = store.find(i => i.id === id || i.invoiceId === id)
    if (!target || target.invoiceStatus !== 'draft') return false
    persist(store.filter(i => i.id !== target.id))
    return true
  },

  share(id: string, payload: ShareInvoicePayload): Invoice | undefined {
    const store = getStore()
    const idx = store.findIndex(i => i.id === id || i.invoiceId === id)
    if (idx < 0) return undefined
    const current = store[idx]
    if (current.invoiceStatus === 'draft' || current.invoiceStatus === 'cancelled') return undefined

    const updated: Invoice = {
      ...current,
      invoiceStatus: 'shared',
      paymentTerms: payload.paymentTerms,
      dueDate: payload.dueDate,
      sharedAt: nowIso(),
      sharedToEmail: payload.email,
      lastUpdated: nowIso(),
      activities: [...current.activities, makeActivity('Invoice shared', `Sent to ${payload.email}`)],
      attachments: current.attachments.some(a => a.type === 'invoice_pdf')
        ? current.attachments
        : [
            ...current.attachments,
            {
              id: `att-${Date.now()}`,
              name: `${current.invoiceId}.pdf`,
              type: 'invoice_pdf' as const,
              uploadedAt: nowIso(),
            },
          ],
    }
    const next = [...store]
    next[idx] = updated
    persist(next)
    return updated
  },

  cancel(id: string): Invoice | undefined {
    const store = getStore()
    const idx = store.findIndex(i => i.id === id || i.invoiceId === id)
    if (idx < 0) return undefined
    const updated: Invoice = {
      ...store[idx],
      invoiceStatus: 'cancelled',
      lastUpdated: nowIso(),
      activities: [...store[idx].activities, makeActivity('Invoice cancelled', 'Invoice marked as cancelled')],
    }
    const next = [...store]
    next[idx] = updated
    persist(next)
    return updated
  },

  createCreditNote(sourceInvoiceId: string, adjustment: CreditNoteAdjustment): Invoice | undefined {
    const source = this.getById(sourceInvoiceId)
    if (!source) return undefined

    const lineItems =
      adjustment.mode === 'full'
        ? source.lineItems.map(li => ({
            ...li,
            id: `cn-${li.id}`,
            unitPrice: -Math.abs(li.unitPrice),
            gstAmount: -Math.abs(li.gstAmount),
            amount: -Math.abs(li.amount),
            description: `Credit: ${li.description}`,
            billingStatus: 'unbilled' as const,
          }))
        : source.lineItems
            .filter(li => adjustment.lineItemIds?.includes(li.id))
            .map(li => ({
              ...li,
              id: `cn-${li.id}`,
              unitPrice: -Math.abs(li.unitPrice),
              gstAmount: -Math.abs(li.gstAmount),
              amount: -Math.abs(li.amount),
              description: `Credit: ${li.description}`,
              billingStatus: 'unbilled' as const,
            }))

    const workspace: InvoiceWorkspaceState = {
      selection: {
        billingMode: 'application_wise',
        applicationSelectionMode: 'single',
        invoiceType: 'credit_note',
        companyId: source.companyId,
        companyName: source.companyName,
        billingEntity: source.billingEntity,
        vesselId: source.vesselId,
        vesselName: source.vesselName,
        applicationIds: source.gltsReferences,
        batchIds: source.batchIds,
        servicePresetIds: [],
      },
      lineItems,
      taxConfig: source.taxConfig,
      additionalCharges: 0,
      paymentTerms: source.paymentTerms ?? 'Net 30',
      dueDate: dueDateFromTerms(30),
      sourceInvoiceId: source.id,
      agreementId: source.agreementId,
    }

    const invoice = workspaceToInvoice(workspace, 'submitted')
    invoice.invoiceType = 'credit_note'
    invoice.activities = [
      makeActivity('Credit note created', `${adjustment.mode} adjustment — ${adjustment.reason}`),
    ]
    persist([...getStore(), invoice])
    return invoice
  },

  listCreditNotes(): Invoice[] {
    return getStore().filter(i => i.invoiceType === 'credit_note')
  },

  listSubmittedInvoices(): Invoice[] {
    return getStore().filter(i => i.invoiceStatus === 'submitted' || i.invoiceStatus === 'shared')
  },

  listCustomerVisibleInvoices(): Invoice[] {
    return getStore().filter(i => CUSTOMER_VISIBLE_STATUSES.includes(i.invoiceStatus))
  },

  getBillingReport(filters?: BillingReportFilters): BillingReportData {
    let rows = getStore().filter(i => i.invoiceStatus !== 'cancelled' && i.invoiceStatus !== 'draft')
    if (filters?.company) {
      rows = rows.filter(r => r.companyName.toLowerCase().includes(filters.company!.toLowerCase()))
    }
    if (filters?.dateFrom) rows = rows.filter(r => r.invoiceDate >= filters.dateFrom!)
    if (filters?.dateTo) rows = rows.filter(r => r.invoiceDate <= filters.dateTo!)
    if (filters?.invoiceType && filters.invoiceType !== 'all') {
      rows = rows.filter(r => r.invoiceType === filters.invoiceType)
    }

    const totalBilled = rows.reduce((s, r) => s + r.totals.finalAmount, 0)
    const totalCollected = rows.reduce(
      (s, r) => s + r.payments.reduce((ps, p) => ps + p.amount, 0),
      0,
    )
    const outstanding = totalBilled - totalCollected
    const overdueCount = rows.filter(r => r.invoiceStatus === 'overdue').length

    const byKey = new Map<
      string,
      { companyName: string; billingEntity: string; invoiceCount: number; totalBilled: number; totalCollected: number }
    >()
    for (const inv of rows) {
      const key = `${inv.companyName}::${inv.billingEntity}`
      const cur = byKey.get(key) ?? {
        companyName: inv.companyName,
        billingEntity: inv.billingEntity,
        invoiceCount: 0,
        totalBilled: 0,
        totalCollected: 0,
      }
      cur.invoiceCount += 1
      cur.totalBilled += inv.totals.finalAmount
      cur.totalCollected += inv.payments.reduce((s, p) => s + p.amount, 0)
      byKey.set(key, cur)
    }

    return {
      totalBilled,
      totalCollected,
      outstanding,
      overdueCount,
      rows: [...byKey.values()].map(r => ({
        ...r,
        outstanding: r.totalBilled - r.totalCollected,
      })),
    }
  },

  buildWorkspaceFromSelection(workspace: InvoiceWorkspaceState): InvoiceWorkspaceState {
    const built = buildLineItems(workspace.selection)
    const lineItems = recalculateLineItems(
      workspace.lineItems.length ? workspace.lineItems : built.lineItems,
      built.taxConfig,
    )
    return {
      ...workspace,
      lineItems,
      taxConfig: workspace.taxConfig.gstPercentage ? workspace.taxConfig : built.taxConfig,
      agreementId: built.agreementId,
    }
  },
}

import { getMockInvoices, setMockInvoicesStore } from '@/shared/data/mockInvoices'
import type {
  BillingReportData,
  BillingReportFilters,
  CreditNoteAdjustment,
  Invoice,
  InvoiceActivity,
  InvoiceListFilters,
  InvoiceRefundAppliedVia,
  InvoiceStatus,
  InvoiceWorkspaceState,
  RecordPaymentPayload,
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
  formatInr,
  getInvoiceApplicationCount,
  recalculateLineItems,
} from '@/shared/utils/invoiceCalculations'
import { extractAppliedRefundsFromLineItems } from '@/shared/utils/invoiceConsulateRefundUtils'

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

function resolveRefundAppliedVia(
  workspace: InvoiceWorkspaceState,
  existing?: Invoice,
): InvoiceRefundAppliedVia {
  if (workspace.selection.invoiceType === 'credit_note') return 'credit_note'
  if (existing && existing.invoiceStatus !== 'draft') return 'modify'
  return 'generate'
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

  const id = existing?.id ?? generateInternalId()
  const invoiceId = existing?.invoiceId ?? generateInvoiceId()
  const appliedVia = resolveRefundAppliedVia(workspace, existing)
  const extractedRefunds =
    status === 'draft'
      ? []
      : extractAppliedRefundsFromLineItems(lineItems, id, invoiceId, appliedVia)
  const appliedRefunds =
    extractedRefunds.length > 0
      ? [...(existing?.appliedRefunds ?? []).filter(r => !extractedRefunds.some(e => e.caseId === r.caseId)), ...extractedRefunds]
      : existing?.appliedRefunds

  const base: Invoice = {
    id,
    invoiceId,
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
    totalApplications: getInvoiceApplicationCount({
      gltsReferences: gltsRefs.length ? gltsRefs : workspace.selection.applicationIds,
      batchIds,
    }),
    lineItems,
    taxConfig: workspace.taxConfig,
    totals,
    billingAdjustment,
    invoiceStatus: status,
    paymentStatus: existing?.paymentStatus ?? 'pending',
    invoiceDate: workspace.invoiceDate || existing?.invoiceDate || todayDate(),
    dueDate: workspace.dueDate || existing?.dueDate || dueDateFromTerms(30),
    paymentTerms: workspace.paymentTerms || existing?.paymentTerms,
    lastUpdated: nowIso(),
    createdAt: existing?.createdAt ?? nowIso(),
    sourceInvoiceId: workspace.sourceInvoiceId ?? existing?.sourceInvoiceId,
    gstFiledAt: existing?.gstFiledAt,
    sharedAt: existing?.sharedAt,
    sharedToEmail: existing?.sharedToEmail,
    activities: existing?.activities ?? [],
    attachments: existing?.attachments ?? [],
    payments: existing?.payments ?? [],
    appliedRefunds,
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

  submitDraft(id: string): Invoice | undefined {
    const store = getStore()
    const idx = store.findIndex(i => i.id === id || i.invoiceId === id)
    if (idx < 0) return undefined
    const current = store[idx]
    if (current.invoiceStatus !== 'draft') return undefined

    const lockedLineItems = current.lineItems.map(li => ({
      ...li,
      billingStatus: li.included !== false ? ('billed' as const) : li.billingStatus,
    }))
    const updated: Invoice = {
      ...current,
      lineItems: lockedLineItems,
      invoiceStatus: 'submitted',
      lastUpdated: nowIso(),
      activities: [
        ...current.activities,
        makeActivity('Invoice submitted', `Invoice ${current.invoiceId} submitted to customer portal`),
      ],
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

  sendReminder(id: string): Invoice | undefined {
    const store = getStore()
    const idx = store.findIndex(i => i.id === id || i.invoiceId === id)
    if (idx < 0) return undefined
    const current = store[idx]
    if (current.invoiceStatus !== 'overdue') return undefined

    const updated: Invoice = {
      ...current,
      lastUpdated: nowIso(),
      activities: [
        ...current.activities,
        makeActivity('Payment reminder sent', `Reminder sent for overdue invoice ${current.invoiceId}`),
      ],
    }
    const next = [...store]
    next[idx] = updated
    persist(next)
    return updated
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
    const current = store[idx]
    if (current.invoiceStatus === 'cancelled' || current.invoiceType === 'credit_note') return undefined
    if (current.gstFiledAt) return undefined
    if (
      current.paymentStatus === 'partial' ||
      current.paymentStatus === 'paid' ||
      current.invoiceStatus === 'partially_paid' ||
      current.invoiceStatus === 'paid' ||
      current.payments.some(p => p.amount > 0)
    ) {
      return undefined
    }
    const updated: Invoice = {
      ...current,
      invoiceStatus: 'cancelled',
      lastUpdated: nowIso(),
      activities: [...current.activities, makeActivity('Invoice cancelled', 'Invoice marked as cancelled')],
    }
    const next = [...store]
    next[idx] = updated
    persist(next)
    return updated
  },

  /** Mark GST filing date (drives post-GST correction rules). */
  markGstFiled(id: string, filedAt = todayDate()): Invoice | undefined {
    const store = getStore()
    const idx = store.findIndex(i => i.id === id || i.invoiceId === id)
    if (idx < 0) return undefined
    const current = store[idx]
    if (current.invoiceStatus === 'draft' || current.invoiceStatus === 'cancelled') return undefined
    const updated: Invoice = {
      ...current,
      gstFiledAt: filedAt,
      lastUpdated: nowIso(),
      activities: [...current.activities, makeActivity('GST filed', `Filing date ${filedAt}`)],
    }
    const next = [...store]
    next[idx] = updated
    persist(next)
    return updated
  },

  /**
   * Active replacement invoice for a cancelled/credited source.
   * Blocks creating a duplicate revised invoice.
   */
  findReplacementInvoice(sourceInvoiceId: string): Invoice | undefined {
    return getStore().find(
      i =>
        i.sourceInvoiceId === sourceInvoiceId &&
        i.invoiceType !== 'credit_note' &&
        i.invoiceStatus !== 'cancelled',
    )
  },

  /**
   * Draft revised invoice linked to a cancelled invoice or to the original behind a credit note.
   * Number reuse is deferred to backend integration.
   */
  createRevisedInvoiceDraft(
    sourceInvoiceId: string,
    workspaceOverride?: InvoiceWorkspaceState,
  ): Invoice | undefined {
    const source = this.getById(sourceInvoiceId)
    if (!source) return undefined

    const originId =
      source.invoiceType === 'credit_note' ? source.sourceInvoiceId ?? source.id : source.id
    const origin = this.getById(originId) ?? source

    const existing = this.findReplacementInvoice(originId)
    if (existing) return existing

    if (source.invoiceType !== 'credit_note' && source.invoiceStatus !== 'cancelled') {
      return undefined
    }

    const workspace: InvoiceWorkspaceState = workspaceOverride ?? {
      selection: {
        billingMode: origin.billingMode,
        applicationSelectionMode: 'single',
        invoiceType:
          origin.invoiceType === 'credit_note' || origin.invoiceType === 'additional_expense'
            ? 'single_invoice'
            : origin.invoiceType,
        companyId: origin.companyId,
        companyName: origin.companyName,
        billingEntity: origin.billingEntity,
        vesselId: origin.vesselId,
        vesselName: origin.vesselName,
        applicationIds: [...origin.gltsReferences],
        batchIds: [...origin.batchIds],
        servicePresetIds: [],
        poReference: origin.poReference,
      },
      lineItems: origin.lineItems.map(li => ({
        ...li,
        id: `rev-${li.id}`,
        billingStatus: 'unbilled' as const,
        unitPrice: Math.abs(li.unitPrice),
        gstAmount: Math.abs(li.gstAmount),
        amount: Math.abs(li.amount),
        description: li.description.replace(/^Credit:\s*/i, ''),
      })),
      taxConfig: { ...origin.taxConfig },
      additionalCharges: 0,
      paymentTerms: origin.paymentTerms ?? 'Net 30',
      dueDate: dueDateFromTerms(30),
      sourceInvoiceId: originId,
      agreementId: origin.agreementId,
    }

    if (!workspace.sourceInvoiceId) {
      workspace.sourceInvoiceId = originId
    }

    const invoice = workspaceToInvoice(workspace, 'draft')
    const revisedType =
      origin.invoiceType === 'credit_note' || origin.invoiceType === 'additional_expense'
        ? ('single_invoice' as const)
        : origin.invoiceType
    invoice.invoiceType = revisedType
    invoice.activities = [
      makeActivity('Revised invoice draft created', `Linked to ${origin.invoiceId}`),
    ]
    persist([...getStore(), invoice])
    return invoice
  },

  recordPayment(id: string, payload: RecordPaymentPayload): Invoice | undefined {
    const store = getStore()
    const idx = store.findIndex(i => i.id === id || i.invoiceId === id)
    if (idx < 0) return undefined
    const current = store[idx]
    if (
      current.invoiceStatus === 'draft' ||
      current.invoiceStatus === 'cancelled' ||
      current.invoiceType === 'credit_note'
    ) {
      return undefined
    }

    const amount = Math.max(0, payload.amount)
    if (amount <= 0) return undefined

    const collectedBefore = current.payments.reduce((sum, p) => sum + p.amount, 0)
    const outstanding = Math.max(0, current.totals.finalAmount - collectedBefore)
    const appliedAmount = Math.min(amount, outstanding)
    if (appliedAmount <= 0) return undefined

    const tdsPercentage = Math.max(0, payload.tdsPercentage ?? 0)
    const tdsAmount = Math.max(0, payload.tdsAmount ?? 0)

    const payment = {
      id: `pay-${Date.now()}`,
      date: payload.date || todayDate(),
      amount: appliedAmount,
      method: payload.method.trim() || 'Bank transfer',
      reference: payload.reference.trim(),
      status: 'partial' as const,
      ...(tdsPercentage > 0 || tdsAmount > 0 ? { tdsPercentage, tdsAmount } : {}),
    }

    const payments = [...current.payments, payment]
    const collected = payments.reduce((sum, p) => sum + p.amount, 0)
    const balancePayable = Math.max(0, current.totals.finalAmount - collected)
    const fullyPaid = balancePayable <= 0

    const paymentStatus = fullyPaid ? ('paid' as const) : ('partial' as const)
    const invoiceStatus = fullyPaid
      ? ('paid' as const)
      : collected > 0
        ? ('partially_paid' as const)
        : current.invoiceStatus

    const updated: Invoice = {
      ...current,
      invoiceStatus,
      paymentStatus,
      totals: { ...current.totals, balancePayable },
      payments: payments.map(p => ({
        ...p,
        status: fullyPaid ? ('paid' as const) : ('partial' as const),
      })),
      lastUpdated: nowIso(),
      activities: [
        ...current.activities,
        makeActivity(
          'Payment recorded',
          [
            `${formatInr(appliedAmount)} via ${payment.method}`,
            payment.reference ? `Ref: ${payment.reference}` : '',
            tdsAmount > 0
              ? `TDS ${tdsPercentage > 0 ? `${tdsPercentage}% · ` : ''}${formatInr(tdsAmount)}`
              : '',
          ]
            .filter(Boolean)
            .join(' · '),
        ),
      ],
    }

    const next = [...store]
    next[idx] = updated
    persist(next)
    return updated
  },

  createSecondaryInvoice(sourceInvoiceId: string): Invoice | undefined {
    const source = this.getById(sourceInvoiceId)
    if (!source) return undefined
    if (
      source.invoiceStatus === 'draft' ||
      source.invoiceStatus === 'cancelled' ||
      source.invoiceType === 'credit_note'
    ) {
      return undefined
    }

    const workspace: InvoiceWorkspaceState = {
      selection: {
        billingMode: source.billingMode,
        applicationSelectionMode: 'single',
        invoiceType: 'additional_expense',
        companyId: source.companyId,
        companyName: source.companyName,
        billingEntity: source.billingEntity,
        vesselId: source.vesselId,
        vesselName: source.vesselName,
        applicationIds: [...source.gltsReferences],
        batchIds: [...source.batchIds],
        servicePresetIds: [],
        poReference: source.poReference,
      },
      lineItems: [],
      taxConfig: { ...source.taxConfig },
      additionalCharges: 0,
      paymentTerms: source.paymentTerms ?? 'Net 30',
      dueDate: dueDateFromTerms(30),
      sourceInvoiceId: source.id,
      agreementId: source.agreementId,
    }

    const invoice = workspaceToInvoice(workspace, 'draft')
    invoice.invoiceType = 'additional_expense'
    invoice.activities = [
      makeActivity('Secondary invoice created', `Linked to primary invoice ${source.invoiceId}`),
    ]
    persist([...getStore(), invoice])
    return invoice
  },

  /**
   * Credit note from fee composition: remaining (kept) service lines become credit lines.
   */
  createCreditNoteFromComposition(
    sourceInvoiceId: string,
    workspace: InvoiceWorkspaceState,
    reason: string,
  ): Invoice | undefined {
    const source = this.getById(sourceInvoiceId)
    if (!source) return undefined
    if (source.invoiceType === 'credit_note' || source.invoiceStatus === 'draft' || source.invoiceStatus === 'cancelled') {
      return undefined
    }

    const composed = workspace.lineItems.filter(li => li.included !== false && Math.abs(li.unitPrice) > 0)
    if (composed.length === 0) return undefined

    const lineItems = composed.map(li => ({
      ...li,
      id: `cn-${li.id}`,
      unitPrice: -Math.abs(li.unitPrice),
      gstAmount: -Math.abs(li.gstAmount),
      amount: -Math.abs(li.amount),
      description: li.description.startsWith('Credit:') ? li.description : `Credit: ${li.description}`,
      billingStatus: 'unbilled' as const,
    }))

    const cnWorkspace: InvoiceWorkspaceState = {
      selection: {
        ...workspace.selection,
        invoiceType: 'credit_note',
        companyId: source.companyId,
        companyName: source.companyName,
        billingEntity: workspace.selection.billingEntity || source.billingEntity,
        vesselId: source.vesselId,
        vesselName: source.vesselName,
        applicationIds: source.gltsReferences,
        batchIds: source.batchIds,
      },
      lineItems,
      taxConfig: source.taxConfig,
      additionalCharges: 0,
      paymentTerms: source.paymentTerms ?? 'Net 30',
      dueDate: dueDateFromTerms(30),
      sourceInvoiceId: source.id,
      agreementId: source.agreementId,
    }

    const invoice = workspaceToInvoice(cnWorkspace, 'submitted')
    invoice.invoiceType = 'credit_note'
    invoice.activities = [makeActivity('Credit note created', reason)]
    persist([...getStore(), invoice])
    return invoice
  },

  createCreditNote(sourceInvoiceId: string, adjustment: CreditNoteAdjustment): Invoice | undefined {
    const source = this.getById(sourceInvoiceId)
    if (!source) return undefined
    if (source.invoiceType === 'credit_note' || source.invoiceStatus === 'draft' || source.invoiceStatus === 'cancelled') {
      return undefined
    }

    let lineItems = source.lineItems
    if (adjustment.mode === 'line' || (adjustment.mode === 'partial' && adjustment.lineItemIds?.length)) {
      const ids = new Set(adjustment.lineItemIds ?? [])
      lineItems = source.lineItems.filter(li => ids.has(li.id))
      if (lineItems.length === 0) return undefined
    } else if (adjustment.mode === 'partial' && adjustment.partialAmount && adjustment.partialAmount > 0) {
      const creditBase = Math.min(adjustment.partialAmount, source.totals.subtotal || source.totals.finalAmount)
      const gstPct = source.taxConfig.gstApplicable ? source.taxConfig.gstPercentage : 0
      const gstAmount = source.taxConfig.gstApplicable ? Math.round((creditBase * gstPct) / 100) : 0
      lineItems = [
        {
          id: `cn-partial-${Date.now()}`,
          applicationId: source.gltsReferences[0],
          batchId: source.batchIds[0],
          serviceType: 'Credit adjustment',
          description: `Partial credit: ${adjustment.reason}`,
          quantity: 1,
          unitPrice: -Math.abs(creditBase),
          gstApplicable: source.taxConfig.gstApplicable,
          gstAmount: -Math.abs(gstAmount),
          amount: -(Math.abs(creditBase) + Math.abs(gstAmount)),
          included: true,
          billingStatus: 'unbilled',
          isAdditionalExpense: false,
        },
      ]
    }

    const negated =
      adjustment.mode === 'partial' && adjustment.partialAmount && !adjustment.lineItemIds?.length
        ? lineItems
        : lineItems.map(li => ({
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
      lineItems: negated,
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

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Stack } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Button, useToast } from '@/design-system/UIComponents'
import type { AdminFullPageFormSection } from '@/pages/admin/components/AdminFullPageFormShell'
import { invoiceService } from '@/shared/services/invoiceService'
import {
  computeInvoiceBillingAdjustment,
  mergeTotalsWithAdjustment,
} from '@/shared/utils/invoiceBillingAdjustment'
import { computeInvoiceTotals } from '@/shared/utils/invoiceCalculations'
import { findAgreementForCompany } from '@/shared/utils/invoiceBillingEngine'
import {
  InvoiceApplicationFeeAccordion,
  InvoiceApplicationFeeAccordionList,
} from '../components/composition/InvoiceApplicationFeeAccordion'
import {
  BulkApplicationFeeCardView,
  InvoiceCompositionSelectionSummary,
  SingleApplicationFeeCardView,
} from '../components/composition/InvoiceCompositionCards'
import {
  InvoiceCompositionBillingPanel,
  InvoiceCompositionTotalsPanel,
} from '../components/composition/InvoiceCompositionSummaryPanels'
import type { InvoiceFeeCompositionState } from '../types/invoiceFeeComposition.types'
import {
  billingTypeLabel,
  buildCompositionFromSourceInvoice,
  buildInitialFeeComposition,
  compositionToWorkspaceState,
  computeCompositionSummary,
  listCompositionBillingEntityOptions,
} from '../utils/invoiceFeeCompositionUtils'
import { listCompositionApplicationIds } from '../utils/generateInvoiceFlowUtils'

const LISTING_PATH = '/admin/finance/invoices'

export interface UseGenerateInvoiceCompositionParams {
  applicationIds: string[]
  batchIds: string[]
  draftId?: string
  enabled: boolean
  /** When set, composition is a credit note seeded from this invoice. */
  creditNoteSourceId?: string
}

export function useGenerateInvoiceComposition({
  applicationIds,
  batchIds,
  draftId,
  enabled,
  creditNoteSourceId,
}: UseGenerateInvoiceCompositionParams) {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const isCreditNote = Boolean(creditNoteSourceId)

  const draft = useMemo(
    () => (draftId ? invoiceService.getById(draftId) : undefined),
    [draftId],
  )

  const creditSource = useMemo(
    () => (creditNoteSourceId ? invoiceService.getById(creditNoteSourceId) : undefined),
    [creditNoteSourceId],
  )

  /** Avoid `?? []` — a new array each render re-triggers composition init and wipes fee edits. */
  const resolvedApplicationIds = useMemo(() => {
    if (applicationIds.length > 0) return applicationIds
    if (creditSource?.gltsReferences && creditSource.gltsReferences.length > 0) {
      return creditSource.gltsReferences.filter(id => !creditSource.batchIds.includes(id))
    }
    if (draft?.gltsReferences && draft.gltsReferences.length > 0) return draft.gltsReferences
    return applicationIds
  }, [applicationIds, draft?.gltsReferences, creditSource])

  const resolvedBatchIds = useMemo(() => {
    if (batchIds.length > 0) return batchIds
    if (creditSource?.batchIds && creditSource.batchIds.length > 0) return creditSource.batchIds
    if (draft?.batchIds && draft.batchIds.length > 0) return draft.batchIds
    return batchIds
  }, [batchIds, draft?.batchIds, creditSource])

  const [composition, setComposition] = useState<InvoiceFeeCompositionState | null>(null)
  const [expandedFeeApps, setExpandedFeeApps] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!enabled) return
    if (creditSource) {
      const next = buildCompositionFromSourceInvoice(creditSource)
      setComposition(next)
      const ids = listCompositionApplicationIds(next)
      setExpandedFeeApps(ids.length > 0 ? [ids[0]] : [])
      return
    }
    if (resolvedApplicationIds.length === 0 && resolvedBatchIds.length === 0 && !draftId) {
      return
    }
    const next = buildInitialFeeComposition(resolvedApplicationIds, resolvedBatchIds, draft)
    setComposition(next)
    const ids = listCompositionApplicationIds(next)
    setExpandedFeeApps(ids.length > 0 ? [ids[0]] : [])
  }, [resolvedApplicationIds, resolvedBatchIds, draft, draftId, enabled, creditSource])

  const agreement = useMemo(
    () => findAgreementForCompany(composition?.companyName ?? ''),
    [composition?.companyName],
  )

  const categoryTotals = useMemo(
    () => (composition ? computeCompositionSummary(composition) : null),
    [composition],
  )

  const workspacePreview = useMemo(
    () => (composition ? compositionToWorkspaceState(composition) : null),
    [composition],
  )

  const baseTotals = useMemo(() => {
    if (!workspacePreview) return null
    return computeInvoiceTotals(
      workspacePreview.lineItems,
      workspacePreview.taxConfig,
      workspacePreview.additionalCharges,
    )
  }, [workspacePreview])

  const adjustment = useMemo(() => {
    if (!baseTotals) return null
    return computeInvoiceBillingAdjustment(agreement, baseTotals.finalAmount)
  }, [agreement, baseTotals])

  const mergedTotals = useMemo(() => {
    if (!baseTotals || !adjustment) return null
    return mergeTotalsWithAdjustment(baseTotals, adjustment)
  }, [baseTotals, adjustment])

  const allFeeAppIds = useMemo(
    () => (composition ? listCompositionApplicationIds(composition) : []),
    [composition],
  )

  const setAppExpanded = useCallback((id: string, open: boolean) => {
    setExpandedFeeApps(prev => (open ? [...prev.filter(x => x !== id), id] : prev.filter(x => x !== id)))
  }, [])

  const expandAllFeeApps = () => setExpandedFeeApps(allFeeAppIds)
  const collapseAllFeeApps = () => setExpandedFeeApps([])

  const updateSingle = useCallback((applicationId: string, next: InvoiceFeeCompositionState['singles'][0]) => {
    setComposition(prev =>
      prev
        ? { ...prev, singles: prev.singles.map(s => (s.applicationId === applicationId ? next : s)) }
        : prev,
    )
  }, [])

  const updateBulk = useCallback((batchId: string, next: InvoiceFeeCompositionState['bulks'][0]) => {
    setComposition(prev =>
      prev ? { ...prev, bulks: prev.bulks.map(b => (b.batchId === batchId ? next : b)) } : prev,
    )
  }, [])

  const updateBillingEntity = useCallback((billingEntity: string) => {
    setComposition(prev => (prev ? { ...prev, billingEntity } : prev))
  }, [])

  const billingEntityOptions = useMemo(
    () => (composition ? listCompositionBillingEntityOptions(composition) : []),
    [composition],
  )

  const handleSaveDraft = () => {
    if (!composition || !workspacePreview) return
    setSaving(true)
    const saved = invoiceService.saveDraft(workspacePreview)
    setComposition({ ...composition, draftInvoiceId: saved.id })
    setSaving(false)
    showToast({ title: 'Draft saved', description: saved.invoiceId, variant: 'success' })
  }

  const handleSubmit = (): ReturnType<typeof invoiceService.createCreditNoteFromComposition> | void => {
    if (!composition || !workspacePreview) return
    setSaving(true)

    if (isCreditNote && creditNoteSourceId) {
      const creditNote = invoiceService.createCreditNoteFromComposition(
        creditNoteSourceId,
        workspacePreview,
        'Credit note from composition',
      )
      setSaving(false)
      if (!creditNote) {
        showToast({ title: 'Unable to create credit note', variant: 'error' })
        return undefined
      }
      showToast({ title: 'Credit note submitted', description: creditNote.invoiceId, variant: 'success' })
      return creditNote
    }

    const merged = {
      ...workspacePreview,
      draftInvoiceId: composition.draftInvoiceId ?? workspacePreview.draftInvoiceId,
    }
    const invoice = invoiceService.submit(merged)
    setSaving(false)
    showToast({ title: 'Invoice submitted', description: invoice.invoiceId, variant: 'success' })
    navigate(`${LISTING_PATH}/${invoice.id}`)
  }

  const handleDownloadPreview = () => {
    if (!workspacePreview) return
    showToast({
      title: 'Download preview started',
      description: 'Invoice PDF preview will be available in a future release.',
      variant: 'info',
    })
  }

  const ready =
    enabled &&
    Boolean(composition && categoryTotals && mergedTotals && adjustment && workspacePreview)

  const sections: AdminFullPageFormSection[] = useMemo(() => {
    if (!ready || !composition || !categoryTotals || !mergedTotals || !adjustment || !workspacePreview) {
      return []
    }

    const dueDate = workspacePreview.dueDate

    const feeAccordionToolbar = (
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        <Button label="Expand all" size="sm" variant="outlined" onClick={expandAllFeeApps} />
        <Button label="Collapse all" size="sm" variant="outlined" onClick={collapseAllFeeApps} />
      </Stack>
    )

    const applicationFeeAccordions = (
      <InvoiceApplicationFeeAccordionList headerAction={feeAccordionToolbar}>
        {composition.singles.map(single => (
          <InvoiceApplicationFeeAccordion
            key={single.applicationId}
            id={single.applicationId}
            applicationName={single.applicationName}
            typeLabel="Single"
            subtitle={single.companyName}
            meta={[
              { label: 'Country', value: single.country },
              { label: 'Visa', value: single.visaType },
              { label: 'Billing entity', value: single.billingEntity },
              { label: 'Vessel', value: single.vessel },
            ]}
            expanded={expandedFeeApps.includes(single.applicationId)}
            onExpandedChange={open => setAppExpanded(single.applicationId, open)}
          >
            <SingleApplicationFeeCardView
              embedded
              card={single}
              agreement={agreement}
              allowAddServices={!isCreditNote}
              onChange={next => updateSingle(single.applicationId, next)}
            />
          </InvoiceApplicationFeeAccordion>
        ))}
        {composition.bulks.map(bulk => (
          <InvoiceApplicationFeeAccordion
            key={bulk.batchId}
            id={bulk.batchId}
            applicationName={bulk.applicationName}
            typeLabel="Bulk"
            subtitle={`${bulk.totalApplicants} applicants`}
            meta={[
              { label: 'Country', value: bulk.country },
              { label: 'Visa', value: bulk.visaType },
              { label: 'Billing entity', value: bulk.billingEntity },
              { label: 'Vessel', value: bulk.vessel },
            ]}
            expanded={expandedFeeApps.includes(bulk.batchId)}
            onExpandedChange={open => setAppExpanded(bulk.batchId, open)}
          >
            <BulkApplicationFeeCardView
              embedded
              card={bulk}
              agreement={agreement}
              allowAddServices={!isCreditNote}
              onChange={next => updateBulk(bulk.batchId, next)}
            />
          </InvoiceApplicationFeeAccordion>
        ))}
      </InvoiceApplicationFeeAccordionList>
    )

    return [
      {
        id: 'selection-summary',
        title: 'Selected applications summary',
        span: 2,
        columns: 1,
        importance: 'secondary',
        children: (
          <InvoiceCompositionSelectionSummary
            state={composition}
            billingEntityOptions={billingEntityOptions}
            onBillingEntityChange={updateBillingEntity}
            billingTypeLabel={billingTypeLabel(agreement?.billingType)}
          />
        ),
      },
      {
        id: 'application-fees',
        title: isCreditNote ? 'Services to credit' : 'Billable services',
        description: isCreditNote
          ? 'Keep or remove services from the source invoice. Remaining lines become the credit note.'
          : 'Client-billable services from Expense Management, per passenger. Add agreement services, edit amount/remark, or remove lines.',
        span: 2,
        columns: 1,
        importance: 'secondary',
        children: applicationFeeAccordions,
      },
      {
        id: 'billing-config',
        title: 'Billing configuration',
        description: 'From Agreements & Contracts billing setup',
        span: 1,
        columns: 1,
        importance: 'secondary',
        children: (
          <InvoiceCompositionBillingPanel
            agreement={agreement}
            snapshot={adjustment.snapshot}
            dueDate={dueDate}
          />
        ),
      },
      {
        id: 'invoice-summary',
        title: isCreditNote ? 'Credit note summary' : 'Invoice Summary',
        span: 1,
        columns: 1,
        importance: 'primary',
        children: (
          <InvoiceCompositionTotalsPanel
            categoryTotals={categoryTotals}
            subtotal={mergedTotals.subtotal}
            gstTotal={mergedTotals.gstTotal}
            advanceAdjusted={mergedTotals.advanceAdjusted}
            balancePayable={mergedTotals.balancePayable}
            variant={isCreditNote ? 'credit_note' : 'invoice'}
          />
        ),
      },
    ]
  }, [
    ready,
    composition,
    categoryTotals,
    mergedTotals,
    adjustment,
    workspacePreview,
    agreement,
    expandedFeeApps,
    setAppExpanded,
    updateSingle,
    updateBulk,
    expandAllFeeApps,
    collapseAllFeeApps,
    billingEntityOptions,
    updateBillingEntity,
    isCreditNote,
  ])

  const hasSelection =
    resolvedApplicationIds.length > 0 ||
    resolvedBatchIds.length > 0 ||
    Boolean(draftId) ||
    Boolean(creditNoteSourceId)

  return {
    ready,
    hasSelection,
    sections,
    saving,
    isCreditNote,
    sourceInvoiceId: creditSource?.invoiceId,
    handleSaveDraft,
    handleSubmit,
    handleDownloadPreview,
  }
}

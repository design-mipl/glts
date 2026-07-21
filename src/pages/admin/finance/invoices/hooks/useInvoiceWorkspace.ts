import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { invoiceService } from '@/shared/services/invoiceService'
import type { Invoice, InvoiceWorkspaceState } from '@/shared/types/invoice'
import { EMPTY_INVOICE_BILLING_SELECTION } from '@/shared/types/invoice'
import {
  buildLineItems,
  enrichSelectionFromApplication,
  findAgreementForCompany,
} from '@/shared/utils/invoiceBillingEngine'
import {
  computeInvoiceBillingAdjustment,
  mergeTotalsWithAdjustment,
} from '@/shared/utils/invoiceBillingAdjustment'
import {
  computeInvoiceTotals,
  recalculateLineItems,
} from '@/shared/utils/invoiceCalculations'

function defaultDueDate() {
  const d = new Date()
  d.setDate(d.getDate() + 30)
  return d.toISOString().slice(0, 10)
}

function workspaceFromInvoice(invoice: Invoice): InvoiceWorkspaceState {
  return {
    selection: {
      billingMode: invoice.billingMode,
      applicationSelectionMode:
        invoice.batchIds.length === 1 && invoice.gltsReferences.length <= 1
          ? 'batch'
          : invoice.gltsReferences.length > 1
            ? 'multiple'
            : 'single',
      invoiceType: invoice.invoiceType,
      companyId: invoice.companyId,
      companyName: invoice.companyName,
      billingEntity: invoice.billingEntity,
      vesselId: invoice.vesselId,
      vesselName: invoice.vesselName,
      applicationIds: invoice.gltsReferences,
      batchIds: invoice.batchIds,
      servicePresetIds: [],
      poReference: invoice.poReference,
    },
    lineItems: invoice.lineItems,
    taxConfig: invoice.taxConfig,
    additionalCharges: invoice.totals.additionalCharges,
    paymentTerms: invoice.paymentTerms ?? 'Net 30',
    dueDate: invoice.dueDate,
    sourceInvoiceId: invoice.sourceInvoiceId,
    draftInvoiceId: invoice.id,
    agreementId: invoice.agreementId,
  }
}

export function useInvoiceWorkspace(invoiceId?: string, creditNoteSourceId?: string) {
  const [searchParams] = useSearchParams()
  const mode = searchParams.get('mode')
  const type = searchParams.get('type')
  const applicationId = searchParams.get('applicationId')

  const [workspace, setWorkspace] = useState<InvoiceWorkspaceState>(() => {
    const selection = { ...EMPTY_INVOICE_BILLING_SELECTION }
    if (mode === 'batch') {
      selection.applicationSelectionMode = 'batch'
    }
    if (mode === 'cumulative') {
      selection.invoiceType = 'cumulative'
      selection.applicationSelectionMode = 'multiple'
    }
    if (type === 'additional_expense') selection.invoiceType = 'additional_expense'
    if (type === 'final_settlement') selection.invoiceType = 'final_settlement'
    return {
      selection,
      lineItems: [],
      taxConfig: { gstApplicable: true, gstPercentage: 18, tdsApplicable: false, tdsPercentage: 0 },
      additionalCharges: 0,
      paymentTerms: 'Net 30',
      dueDate: defaultDueDate(),
    }
  })

  useEffect(() => {
    if (invoiceId) {
      const inv = invoiceService.getById(invoiceId)
      if (inv) setWorkspace(workspaceFromInvoice(inv))
      return
    }
    if (creditNoteSourceId) {
      const source = invoiceService.getById(creditNoteSourceId)
      if (source) {
        const base = workspaceFromInvoice(source)
        const negatedItems = source.lineItems.map(li => ({
          ...li,
          id: `cn-${li.id}`,
          unitPrice: -Math.abs(li.unitPrice),
          gstAmount: -Math.abs(li.gstAmount),
          amount: -Math.abs(li.amount),
          description: `Credit: ${li.description}`,
          billingStatus: 'unbilled' as const,
        }))
        setWorkspace({
          ...base,
          selection: {
            ...base.selection,
            invoiceType: 'credit_note',
          },
          lineItems: negatedItems,
          sourceInvoiceId: source.id,
          draftInvoiceId: undefined,
        })
      }
    }
  }, [invoiceId, creditNoteSourceId])

  useEffect(() => {
    if (applicationId) {
      setWorkspace(prev => {
        const enriched = enrichSelectionFromApplication(prev.selection, applicationId)
        const built = buildLineItems(enriched)
        return {
          ...prev,
          selection: enriched,
          lineItems: recalculateLineItems(built.lineItems, built.taxConfig),
          taxConfig: built.taxConfig,
          agreementId: built.agreementId,
        }
      })
    }
  }, [applicationId])

  const updateSelection = useCallback((patch: Partial<InvoiceWorkspaceState['selection']>) => {
    setWorkspace(prev => {
      const selection = { ...prev.selection, ...patch }
      const built = buildLineItems(selection)
      return {
        ...prev,
        selection,
        lineItems: recalculateLineItems(built.lineItems, built.taxConfig),
        taxConfig: built.taxConfig,
        agreementId: built.agreementId,
      }
    })
  }, [])

  const updateLineItems = useCallback((lineItems: InvoiceWorkspaceState['lineItems']) => {
    setWorkspace(prev => ({
      ...prev,
      lineItems: recalculateLineItems(lineItems, prev.taxConfig),
    }))
  }, [])

  const baseTotals = useMemo(
    () => computeInvoiceTotals(workspace.lineItems, workspace.taxConfig, workspace.additionalCharges),
    [workspace.lineItems, workspace.taxConfig, workspace.additionalCharges],
  )

  const agreement = useMemo(
    () => findAgreementForCompany(workspace.selection.companyName),
    [workspace.selection.companyName],
  )

  const adjustment = useMemo(
    () => computeInvoiceBillingAdjustment(agreement, baseTotals.finalAmount),
    [agreement, baseTotals.finalAmount],
  )

  const totals = useMemo(
    () => mergeTotalsWithAdjustment(baseTotals, adjustment),
    [baseTotals, adjustment],
  )

  return {
    workspace,
    totals,
    billingAdjustment: adjustment.snapshot,
    agreement,
    setWorkspace,
    updateSelection,
    updateLineItems,
  }
}

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { invoiceService } from '@/shared/services/invoiceService'
import type { Invoice, InvoiceWorkspaceState } from '@/shared/types/invoice'
import { EMPTY_INVOICE_BILLING_SELECTION } from '@/shared/types/invoice'
import {
  buildLineItems,
  enrichSelectionFromApplication,
} from '@/shared/utils/invoiceBillingEngine'
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
      invoiceType: invoice.invoiceType === 'credit_note' ? 'credit_note' : invoice.invoiceType,
      companyId: invoice.companyId,
      companyName: invoice.companyName,
      billingEntity: invoice.billingEntity,
      vesselId: invoice.vesselId,
      vesselName: invoice.vesselName,
      applicationIds: invoice.gltsReferences,
      batchIds: invoice.batchIds,
      serviceTypes: [],
      billableOnly: false,
    },
    lineItems: invoice.lineItems,
    taxConfig: invoice.taxConfig,
    additionalCharges: invoice.totals.additionalCharges,
    paymentTerms: invoice.paymentTerms ?? 'Net 30',
    dueDate: invoice.dueDate,
    sourceInvoiceId: invoice.sourceInvoiceId,
    draftInvoiceId: invoice.id,
  }
}

export function useInvoiceWorkspace(invoiceId?: string, creditNoteSourceId?: string) {
  const [searchParams] = useSearchParams()
  const mode = searchParams.get('mode')
  const type = searchParams.get('type')
  const applicationId = searchParams.get('applicationId')

  const [workspace, setWorkspace] = useState<InvoiceWorkspaceState>(() => {
    const selection = { ...EMPTY_INVOICE_BILLING_SELECTION }
    if (mode === 'batch') selection.billingMode = 'batch'
    if (mode === 'cumulative') selection.billingMode = 'cumulative'
    if (type === 'additional_expense') selection.invoiceType = 'additional_expense'
    if (type === 'service_wise') {
      selection.billingMode = 'service_wise'
      selection.invoiceType = 'service_wise'
    }
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
        const negatedItems = source.lineItems.map(li => ({
          ...li,
          id: `cn-${li.id}`,
          unitPrice: -Math.abs(li.unitPrice),
          gstAmount: -Math.abs(li.gstAmount),
          amount: -Math.abs(li.amount),
          description: `Credit: ${li.description}`,
        }))
        setWorkspace({
          ...workspaceFromInvoice(source),
          selection: {
            ...workspaceFromInvoice(source).selection,
            invoiceType: 'credit_note',
            billableOnly: false,
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
        }
      })
    }
  }, [applicationId])

  const refreshLineItems = useCallback((selection = workspace.selection) => {
    const built = buildLineItems(selection)
    setWorkspace(prev => ({
      ...prev,
      lineItems: recalculateLineItems(built.lineItems, prev.taxConfig.gstPercentage ? prev.taxConfig : built.taxConfig),
      taxConfig: prev.taxConfig.gstPercentage ? prev.taxConfig : built.taxConfig,
    }))
  }, [workspace.selection])

  const updateSelection = useCallback((patch: Partial<InvoiceWorkspaceState['selection']>) => {
    setWorkspace(prev => {
      const selection = { ...prev.selection, ...patch }
      const built = buildLineItems(selection)
      return {
        ...prev,
        selection,
        lineItems: recalculateLineItems(built.lineItems, built.taxConfig),
        taxConfig: built.taxConfig,
      }
    })
  }, [])

  const updateLineItems = useCallback((lineItems: InvoiceWorkspaceState['lineItems']) => {
    setWorkspace(prev => ({
      ...prev,
      lineItems: recalculateLineItems(lineItems, prev.taxConfig),
    }))
  }, [])

  const totals = useMemo(
    () => computeInvoiceTotals(workspace.lineItems, workspace.taxConfig, workspace.additionalCharges),
    [workspace.lineItems, workspace.taxConfig, workspace.additionalCharges],
  )

  return {
    workspace,
    totals,
    setWorkspace,
    updateSelection,
    updateLineItems,
    refreshLineItems,
  }
}

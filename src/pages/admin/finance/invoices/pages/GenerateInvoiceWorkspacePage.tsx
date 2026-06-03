import { useMemo, useState } from 'react'
import { Download } from 'lucide-react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { BaseCard, Button, useToast } from '@/design-system/UIComponents'
import { AdminFinanceWorkspaceShell } from '@/pages/admin/components/AdminFinanceWorkspaceShell'
import { AdminFullPageFormFooter } from '@/pages/admin/components/AdminFullPageFormFooter'
import { invoiceService } from '@/shared/services/invoiceService'
import type { BillingMode, InvoiceType } from '@/shared/types/invoice'
import { recalculateLineItems } from '@/shared/utils/invoiceCalculations'
import { InvoiceBillingSelectionPanel } from '../components/workspace/InvoiceBillingSelectionPanel'
import { InvoiceLineItemsTable } from '../components/workspace/InvoiceLineItemsTable'
import { InvoicePreviewPanel } from '../components/workspace/InvoicePreviewPanel'
import { InvoiceSummaryPanel } from '../components/workspace/InvoiceSummaryPanel'
import { useInvoiceWorkspace } from '../hooks/useInvoiceWorkspace'

const LISTING_PATH = '/admin/finance/invoices'

interface GenerateInvoiceWorkspacePageProps {
  creditNoteMode?: boolean
}

export function GenerateInvoiceWorkspacePage({ creditNoteMode = false }: GenerateInvoiceWorkspacePageProps) {
  const navigate = useNavigate()
  const { invoiceId: creditNoteSourceId } = useParams<{ invoiceId?: string }>()
  const [searchParams] = useSearchParams()
  const draftId = searchParams.get('draftId') ?? undefined
  const { showToast } = useToast()

  const { workspace, totals, billingAdjustment, agreement, updateSelection, updateLineItems, setWorkspace } =
    useInvoiceWorkspace(draftId, creditNoteMode ? creditNoteSourceId : undefined)

  const [savedInvoiceId, setSavedInvoiceId] = useState<string>()

  const title = useMemo(() => {
    if (creditNoteMode) return 'Create credit note'
    if (workspace.selection.invoiceType === 'additional_expense') return 'Additional expense billing'
    if (workspace.selection.applicationSelectionMode === 'batch') return 'Batch billing workspace'
    return 'Generate invoice'
  }, [creditNoteMode, workspace.selection])

  const handleSaveDraft = () => {
    const saved = invoiceService.saveDraft(workspace)
    setSavedInvoiceId(saved.id)
    setWorkspace(prev => ({ ...prev, draftInvoiceId: saved.id }))
    showToast({ title: 'Draft saved', description: saved.invoiceId, variant: 'success' })
  }

  const handleSubmit = () => {
    if (creditNoteMode && creditNoteSourceId) {
      const creditNote = invoiceService.createCreditNote(creditNoteSourceId, {
        mode: 'full',
        reason: 'Credit note from workspace',
      })
      if (!creditNote) {
        showToast({ title: 'Unable to create credit note', variant: 'error' })
        return
      }
      showToast({ title: 'Credit note submitted', description: creditNote.invoiceId, variant: 'success' })
      navigate(`${LISTING_PATH}/${creditNote.id}`)
      return
    }
    const merged = { ...workspace, draftInvoiceId: savedInvoiceId ?? workspace.draftInvoiceId }
    const invoice = invoiceService.submit(merged)
    showToast({ title: 'Invoice submitted', description: invoice.invoiceId, variant: 'success' })
    navigate(`${LISTING_PATH}/${invoice.id}`)
  }

  const handleDownloadPreview = () => {
    showToast({ title: 'Preview download started', variant: 'success' })
  }

  const selection = workspace.selection

  return (
    <AdminFinanceWorkspaceShell
      breadcrumbs={[
        { label: 'Finance', href: LISTING_PATH },
        { label: 'Billing & invoices', href: LISTING_PATH },
        { label: title },
      ]}
      title={title}
      description="Configure billing selection, edit line items, and submit invoices manually."
      leftPanel={
        <InvoiceBillingSelectionPanel
          billingMode={selection.billingMode}
          applicationSelectionMode={selection.applicationSelectionMode}
          invoiceType={selection.invoiceType}
          companyId={selection.companyId}
          billingEntity={selection.billingEntity}
          billingEntityOverride={selection.billingEntityOverride ?? ''}
          vesselId={selection.vesselId ?? ''}
          applicationIds={selection.applicationIds}
          batchIds={selection.batchIds}
          billingPeriodFrom={selection.billingPeriodFrom ?? ''}
          billingPeriodTo={selection.billingPeriodTo ?? ''}
          poReference={selection.poReference ?? ''}
          onBillingModeChange={(mode: BillingMode) => updateSelection({ billingMode: mode })}
          onApplicationSelectionModeChange={mode => updateSelection({ applicationSelectionMode: mode })}
          onInvoiceTypeChange={(type: InvoiceType) => updateSelection({ invoiceType: type })}
          onCompanyChange={(companyId, companyName, billingEntity) =>
            updateSelection({ companyId, companyName, billingEntity, billingEntityOverride: billingEntity })
          }
          onBillingEntityOverrideChange={v => updateSelection({ billingEntityOverride: v, billingEntity: v })}
          onVesselChange={(vesselId, vesselName) => updateSelection({ vesselId, vesselName })}
          onApplicationIdsChange={ids => updateSelection({ applicationIds: ids })}
          onBatchIdsChange={ids => updateSelection({ batchIds: ids })}
          onBillingPeriodFromChange={v => updateSelection({ billingPeriodFrom: v })}
          onBillingPeriodToChange={v => updateSelection({ billingPeriodTo: v })}
          onPoReferenceChange={v => updateSelection({ poReference: v })}
        />
      }
      centerPanel={
        <BaseCard sx={{ p: 2 }}>
          <InvoiceLineItemsTable
            lineItems={workspace.lineItems}
            onChange={updateLineItems}
            gstPercentage={workspace.taxConfig.gstPercentage}
          />
        </BaseCard>
      }
      rightPanel={
        <>
          <InvoiceSummaryPanel
            subtotal={totals.subtotal}
            gstTotal={totals.gstTotal}
            tdsAmount={totals.tdsAmount}
            additionalCharges={totals.additionalCharges}
            finalAmount={totals.finalAmount}
            advanceAvailable={totals.advanceAvailable}
            advanceAdjusted={totals.advanceAdjusted}
            creditApplied={totals.creditApplied}
            balancePayable={totals.balancePayable}
            billingAdjustment={billingAdjustment}
            agreement={agreement}
            taxConfig={workspace.taxConfig}
            onTaxConfigChange={taxConfig =>
              setWorkspace(prev => ({
                ...prev,
                taxConfig,
                lineItems: recalculateLineItems(prev.lineItems, taxConfig),
              }))
            }
            onAdditionalChargesChange={additionalCharges =>
              setWorkspace(prev => ({ ...prev, additionalCharges }))
            }
            paymentTerms={workspace.paymentTerms}
            dueDate={workspace.dueDate}
            onPaymentTermsChange={paymentTerms => setWorkspace(prev => ({ ...prev, paymentTerms }))}
            onDueDateChange={dueDate => setWorkspace(prev => ({ ...prev, dueDate }))}
          />
          <InvoicePreviewPanel
            companyName={selection.companyName}
            billingEntity={selection.billingEntityOverride || selection.billingEntity}
            vesselName={selection.vesselName}
            lineItems={workspace.lineItems.filter(li => li.included !== false)}
            taxConfig={workspace.taxConfig}
            subtotal={totals.subtotal}
            gstTotal={totals.gstTotal}
            tdsAmount={totals.tdsAmount}
            finalAmount={totals.finalAmount}
            paymentTerms={workspace.paymentTerms}
            dueDate={workspace.dueDate}
          />
        </>
      }
      footer={
        <AdminFullPageFormFooter
          onCancel={() => navigate(LISTING_PATH)}
          cancelLabel="Back to listing"
          onDraft={handleSaveDraft}
          draftLabel="Save as draft"
          onSave={handleSubmit}
          saveLabel={creditNoteMode ? 'Submit credit note' : 'Submit invoice'}
          extraActions={
            <Button
              label="Download preview"
              variant="outlined"
              startIcon={<Download size={14} />}
              onClick={handleDownloadPreview}
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            />
          }
        />
      }
    />
  )
}

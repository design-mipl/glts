import { useMemo, useState } from 'react'
import { Download, Send } from 'lucide-react'
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
import type { ShareInvoiceModalValue } from '../components/workspace/ShareInvoiceModal'
import { ShareInvoiceModal } from '../components/workspace/ShareInvoiceModal'
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

  const { workspace, totals, updateSelection, updateLineItems, setWorkspace } = useInvoiceWorkspace(
    draftId,
    creditNoteMode ? creditNoteSourceId : undefined,
  )

  const [shareOpen, setShareOpen] = useState(false)
  const [shareValue, setShareValue] = useState<ShareInvoiceModalValue>({
    email: '',
    paymentTerms: workspace.paymentTerms,
    dueDate: workspace.dueDate,
    message: '',
  })
  const [savedInvoiceId, setSavedInvoiceId] = useState<string>()

  const title = useMemo(() => {
    if (creditNoteMode) return 'Create credit note'
    if (workspace.selection.invoiceType === 'additional_expense') return 'Additional expense billing'
    if (workspace.selection.billingMode === 'batch') return 'Batch billing workspace'
    return 'Generate invoice'
  }, [creditNoteMode, workspace.selection])

  const handleSaveDraft = () => {
    const saved = invoiceService.saveDraft(workspace)
    setSavedInvoiceId(saved.id)
    setWorkspace(prev => ({ ...prev, draftInvoiceId: saved.id }))
    showToast({ title: 'Draft saved', description: saved.invoiceId, variant: 'success' })
  }

  const handleGenerate = () => {
    if (creditNoteMode && creditNoteSourceId) {
      const creditNote = invoiceService.createCreditNote(creditNoteSourceId, {
        mode: 'full',
        reason: 'Credit note from workspace',
      })
      if (!creditNote) {
        showToast({ title: 'Unable to create credit note', variant: 'error' })
        return
      }
      showToast({ title: 'Credit note generated', description: creditNote.invoiceId, variant: 'success' })
      navigate(`${LISTING_PATH}/${creditNote.id}`)
      return
    }
    const merged = { ...workspace, draftInvoiceId: savedInvoiceId ?? workspace.draftInvoiceId }
    const invoice = invoiceService.generate(merged)
    showToast({ title: 'Invoice generated', description: invoice.invoiceId, variant: 'success' })
    navigate(`${LISTING_PATH}/${invoice.id}`)
  }

  const handleShare = () => {
    const merged = { ...workspace, draftInvoiceId: savedInvoiceId ?? workspace.draftInvoiceId }
    let invoiceId = savedInvoiceId
    if (!invoiceId) {
      const generated = invoiceService.generate(merged)
      invoiceId = generated.id
    }
    setSavedInvoiceId(invoiceId)
    setShareOpen(true)
  }

  const handleShareConfirm = () => {
    if (!savedInvoiceId) return
    invoiceService.share(savedInvoiceId, shareValue)
    showToast({ title: 'Invoice shared', variant: 'success' })
    setShareOpen(false)
    navigate(`${LISTING_PATH}/${savedInvoiceId}`)
  }

  const handleDownload = () => {
    showToast({ title: 'PDF download started', variant: 'success' })
  }

  const selection = workspace.selection

  return (
    <>
      <AdminFinanceWorkspaceShell
        breadcrumbs={[
          { label: 'Finance', href: LISTING_PATH },
          { label: 'Billing & invoices', href: LISTING_PATH },
          { label: title },
        ]}
        title={title}
        description="Configure billing selection, edit line items, and generate or share invoices."
        leftPanel={
          <InvoiceBillingSelectionPanel
            billingMode={selection.billingMode}
            invoiceType={selection.invoiceType}
            companyId={selection.companyId}
            billingEntity={selection.billingEntity}
            billingEntityOverride={selection.billingEntityOverride ?? ''}
            vesselId={selection.vesselId ?? ''}
            applicationIds={selection.applicationIds}
            batchIds={selection.batchIds}
            serviceTypes={selection.serviceTypes}
            billableOnly={selection.billableOnly}
            onBillingModeChange={(mode: BillingMode) => updateSelection({ billingMode: mode })}
            onInvoiceTypeChange={(type: InvoiceType) => updateSelection({ invoiceType: type })}
            onCompanyChange={(companyId, companyName, billingEntity) =>
              updateSelection({ companyId, companyName, billingEntity, billingEntityOverride: billingEntity })
            }
            onBillingEntityOverrideChange={v => updateSelection({ billingEntityOverride: v, billingEntity: v })}
            onVesselChange={(vesselId, vesselName) => updateSelection({ vesselId, vesselName })}
            onApplicationIdsChange={ids => updateSelection({ applicationIds: ids })}
            onBatchIdsChange={ids => updateSelection({ batchIds: ids })}
            onServiceTypesChange={types => updateSelection({ serviceTypes: types })}
            onBillableOnlyChange={v => updateSelection({ billableOnly: v })}
          />
        }
        centerPanel={
          <BaseCard sx={{ p: 2 }}>
            <InvoiceLineItemsTable lineItems={workspace.lineItems} onChange={updateLineItems} />
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
              lineItems={workspace.lineItems}
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
            draftLabel="Save draft"
            onSave={handleGenerate}
            saveLabel={creditNoteMode ? 'Generate credit note' : 'Generate invoice'}
            extraActions={
              <>
                <Button
                  label="Share invoice"
                  variant="outlined"
                  startIcon={<Send size={14} />}
                  onClick={handleShare}
                  sx={{ width: { xs: '100%', sm: 'auto' } }}
                />
                <Button
                  label="Download PDF"
                  variant="outlined"
                  startIcon={<Download size={14} />}
                  onClick={handleDownload}
                  sx={{ width: { xs: '100%', sm: 'auto' } }}
                />
              </>
            }
          />
        }
      />

      <ShareInvoiceModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        value={shareValue}
        onChange={setShareValue}
        onSubmit={handleShareConfirm}
      />
    </>
  )
}

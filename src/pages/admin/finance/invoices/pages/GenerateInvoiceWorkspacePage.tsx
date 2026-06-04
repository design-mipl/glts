import { useMemo, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { BaseCard, useToast } from '@/design-system/UIComponents'
import { AdminFinanceWorkspaceShell } from '@/pages/admin/components/AdminFinanceWorkspaceShell'
import { AdminFullPageFormFooter } from '@/pages/admin/components/AdminFullPageFormFooter'
import { invoiceService } from '@/shared/services/invoiceService'
import { InvoiceBillingSelectionPanel } from '../components/workspace/InvoiceBillingSelectionPanel'
import { InvoiceLineItemsTable } from '../components/workspace/InvoiceLineItemsTable'
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

  const { workspace, updateSelection, updateLineItems, setWorkspace } = useInvoiceWorkspace(
    draftId,
    creditNoteMode ? creditNoteSourceId : undefined,
  )

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

  const selection = workspace.selection

  return (
    <AdminFinanceWorkspaceShell
      breadcrumbs={[
        { label: 'Billing & invoices', href: LISTING_PATH },
        { label: title },
      ]}
      title={title}
      description="Configure billing selection, edit line items, and submit invoices manually."
      leftPanel={
        <InvoiceBillingSelectionPanel
          applicationIds={selection.applicationIds}
          batchIds={selection.batchIds}
          onApplicationSelectionModeChange={mode => updateSelection({ applicationSelectionMode: mode })}
          onApplicationIdsChange={ids => updateSelection({ applicationIds: ids })}
          onBatchIdsChange={ids => updateSelection({ batchIds: ids })}
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
      footer={
        <AdminFullPageFormFooter
          onCancel={() => navigate(LISTING_PATH)}
          cancelLabel="Back to listing"
          onDraft={handleSaveDraft}
          draftLabel="Save as draft"
          onSave={handleSubmit}
          saveLabel={creditNoteMode ? 'Submit credit note' : 'Submit invoice'}
        />
      }
    />
  )
}

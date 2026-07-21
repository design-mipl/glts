import { useCallback, useEffect, useState } from 'react'
import { Box, CircularProgress } from '@mui/material'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { BaseCard, ConfirmDialog, EmptyState, Tabs, useToast } from '@/design-system/UIComponents'
import { AdminDetailShell } from '@/pages/admin/components/AdminDetailShell'
import { invoiceService } from '@/shared/services/invoiceService'
import type { Invoice } from '@/shared/types/invoice'
import { getListingReturnHref } from '@/shared/utils/listingNavigationUtils'
import { InvoiceDetailSummary } from '../components/detail/InvoiceDetailSummary'
import { InvoiceDetailTabContent } from '../components/detail/InvoiceDetailTabs'
import type { ShareInvoiceModalValue } from '../components/workspace/ShareInvoiceModal'
import { ShareInvoiceModal } from '../components/workspace/ShareInvoiceModal'

const LISTING_PATH = '/admin/finance/invoices'
const GENERATE_DRAFT_PATH = `${LISTING_PATH}/generate`

export function InvoiceDetailPage() {
  const { invoiceId } = useParams<{ invoiceId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const listingHref = getListingReturnHref(location, LISTING_PATH)
  const { showToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [invoice, setInvoice] = useState<Invoice>()
  const [activeTab, setActiveTab] = useState('overview')
  const [shareOpen, setShareOpen] = useState(false)
  const [cancelOpen, setCancelOpen] = useState(false)
  const [revisedPromptOpen, setRevisedPromptOpen] = useState(false)
  const [shareValue, setShareValue] = useState<ShareInvoiceModalValue>({
    email: '',
    paymentTerms: 'Net 30',
    dueDate: '',
    message: '',
  })

  const reload = useCallback(() => {
    if (!invoiceId) return
    setInvoice(invoiceService.getById(invoiceId))
    setLoading(false)
  }, [invoiceId])

  useEffect(() => {
    reload()
  }, [reload])

  const openRevisedInvoiceFlow = useCallback(
    (row: Invoice) => {
      const originId = row.invoiceType === 'credit_note' ? row.sourceInvoiceId ?? row.id : row.id
      const existing = invoiceService.findReplacementInvoice(originId)
      if (existing) {
        showToast({
          title: 'Revised invoice already exists',
          description: existing.invoiceId,
          variant: 'info',
        })
        navigate(
          existing.invoiceStatus === 'draft'
            ? `${GENERATE_DRAFT_PATH}?draftId=${existing.id}&step=1`
            : `${LISTING_PATH}/${existing.id}`,
        )
        return
      }
      const draft = invoiceService.createRevisedInvoiceDraft(row.id)
      if (!draft) {
        showToast({ title: 'Unable to create revised invoice', variant: 'error' })
        return
      }
      showToast({
        title: 'Revised invoice draft created',
        description: draft.invoiceId,
        variant: 'success',
      })
      navigate(`${GENERATE_DRAFT_PATH}?draftId=${draft.id}&step=1`)
    },
    [navigate, showToast],
  )

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={32} />
      </Box>
    )
  }

  if (!invoice) {
    return (
      <EmptyState
        variant="no-data"
        title="Invoice not found"
        action={{ label: 'Back to invoices', onClick: () => navigate(listingHref) }}
      />
    )
  }

  const handleShare = () => {
    setShareValue({
      email: invoice.sharedToEmail ?? '',
      paymentTerms: invoice.paymentTerms ?? 'Net 30',
      dueDate: invoice.dueDate,
      message: '',
    })
    setShareOpen(true)
  }

  const handleShareConfirm = () => {
    invoiceService.share(invoice.id, shareValue)
    showToast({ title: 'Invoice shared', variant: 'success' })
    setShareOpen(false)
    reload()
  }

  return (
    <>
      <AdminDetailShell
        breadcrumbs={[
          { label: 'Finance', href: listingHref },
          { label: 'Billing & invoices', href: listingHref },
          { label: invoice.invoiceId },
        ]}
        summary={
          <InvoiceDetailSummary
            invoice={invoice}
            onShare={handleShare}
            onDownload={() => showToast({ title: 'Download started', variant: 'success' })}
            onCreditNote={() => navigate(`${LISTING_PATH}/${invoice.id}/credit-note`)}
            onCancel={() => setCancelOpen(true)}
            onModify={() => navigate(`${GENERATE_DRAFT_PATH}?draftId=${invoice.id}&step=1`)}
            onCreateRevisedInvoice={() => openRevisedInvoiceFlow(invoice)}
            onMarkGstFiled={() => {
              const updated = invoiceService.markGstFiled(invoice.id)
              if (!updated) {
                showToast({ title: 'Unable to mark GST filed', variant: 'error' })
                return
              }
              showToast({ title: 'GST filing date recorded', description: updated.gstFiledAt, variant: 'success' })
              reload()
            }}
          />
        }
      >
        <BaseCard sx={{ p: 0 }}>
          <Box sx={{ px: 2.5, pt: 1.5, borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              items={[
                { label: 'Overview', value: 'overview' },
                { label: 'Line items', value: 'line_items' },
                { label: 'Tax breakdown', value: 'tax' },
                { label: 'Advance / credit', value: 'adjustment' },
                { label: 'Attachments', value: 'attachments' },
                { label: 'Payment history', value: 'payments' },
                { label: 'Activity logs', value: 'activity' },
              ]}
              value={activeTab}
              onChange={setActiveTab}
              variant="underline"
              size="sm"
            />
          </Box>
          <Box sx={{ p: 2.5 }}>
            <InvoiceDetailTabContent invoice={invoice} activeTab={activeTab} />
          </Box>
        </BaseCard>
      </AdminDetailShell>

      <ShareInvoiceModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        value={shareValue}
        onChange={setShareValue}
        onSubmit={handleShareConfirm}
        invoiceId={invoice.invoiceId}
      />

      <ConfirmDialog
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        title="Cancel invoice"
        description={`Cancel invoice ${invoice.invoiceId}? Applications remain billable.`}
        confirmLabel="Cancel invoice"
        variant="destructive"
        onConfirm={() => {
          const updated = invoiceService.cancel(invoice.id)
          if (!updated) {
            showToast({ title: 'Unable to cancel invoice', variant: 'error' })
            return
          }
          showToast({ title: 'Invoice cancelled', variant: 'info' })
          setCancelOpen(false)
          reload()
          setRevisedPromptOpen(true)
        }}
      />

      <ConfirmDialog
        open={revisedPromptOpen}
        onClose={() => setRevisedPromptOpen(false)}
        title="Create revised invoice?"
        description="Create a revised invoice now? You can also do this later from the cancelled invoice."
        confirmLabel="Create revised invoice"
        cancelLabel="Not now"
        onConfirm={() => {
          setRevisedPromptOpen(false)
          const current = invoiceService.getById(invoice.id)
          if (current) openRevisedInvoiceFlow(current)
        }}
      />
    </>
  )
}

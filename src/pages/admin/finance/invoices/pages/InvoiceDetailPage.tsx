import { useCallback, useEffect, useState } from 'react'
import { Box, CircularProgress } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { BaseCard, ConfirmDialog, EmptyState, Tabs, useToast } from '@/design-system/UIComponents'
import { AdminDetailShell } from '@/pages/admin/components/AdminDetailShell'
import { invoiceService } from '@/shared/services/invoiceService'
import type { Invoice } from '@/shared/types/invoice'
import { InvoiceDetailSummary } from '../components/detail/InvoiceDetailSummary'
import { InvoiceDetailTabContent } from '../components/detail/InvoiceDetailTabs'
import type { ShareInvoiceModalValue } from '../components/workspace/ShareInvoiceModal'
import { ShareInvoiceModal } from '../components/workspace/ShareInvoiceModal'

const LISTING_PATH = '/admin/finance/invoices'

export function InvoiceDetailPage() {
  const { invoiceId } = useParams<{ invoiceId: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [invoice, setInvoice] = useState<Invoice>()
  const [activeTab, setActiveTab] = useState('overview')
  const [shareOpen, setShareOpen] = useState(false)
  const [cancelOpen, setCancelOpen] = useState(false)
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
        action={{ label: 'Back to invoices', onClick: () => navigate(LISTING_PATH) }}
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
          { label: 'Finance', href: LISTING_PATH },
          { label: 'Billing & invoices', href: LISTING_PATH },
          { label: invoice.invoiceId },
        ]}
        summary={
          <InvoiceDetailSummary
            invoice={invoice}
            onShare={handleShare}
            onDownload={() => showToast({ title: 'Download started', variant: 'success' })}
            onCreditNote={() => navigate(`${LISTING_PATH}/${invoice.id}/credit-note`)}
            onCancel={() => setCancelOpen(true)}
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
        description={`Cancel invoice ${invoice.invoiceId}?`}
        confirmLabel="Cancel invoice"
        variant="destructive"
        onConfirm={() => {
          invoiceService.cancel(invoice.id)
          showToast({ title: 'Invoice cancelled', variant: 'info' })
          setCancelOpen(false)
          reload()
        }}
      />
    </>
  )
}

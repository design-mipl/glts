import { useState } from 'react'
import { Box, CircularProgress, Stack } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, useToast } from '@/design-system/UIComponents'
import { AdminRecordPageChrome } from '@/pages/admin/components/AdminRecordPageChrome'
import { quotationService } from '@/shared/services/quotationService'
import { QuotationPdfPreviewPanel } from '../components/QuotationPdfPreviewPanel'
import { QuotationShareModal } from '../components/QuotationShareModal'
import { useQuotationDetailState } from '../hooks/useQuotationDetailState'

const ACTOR = 'Admin User'

export function QuotationPdfPreviewPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { quotationId } = useParams<{ quotationId: string }>()
  const { loading, quotation } = useQuotationDetailState(quotationId)
  const [shareOpen, setShareOpen] = useState(false)

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 240 }}>
        <CircularProgress size={32} />
      </Box>
    )
  }

  if (!quotation) return null

  return (
    <>
      <AdminRecordPageChrome
        breadcrumbs={[
          { label: 'Customer & Accounts', href: '/admin/customer-accounts/quotations' },
          { label: 'Quotation Management', href: '/admin/customer-accounts/quotations' },
          { label: quotation.quotationNo, href: `/admin/customer-accounts/quotations/${quotation.id}` },
          { label: 'PDF Preview' },
        ]}
      >
        <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mb: 2 }}>
          <Button label="Back" variant="neutral" onClick={() => navigate(`/admin/customer-accounts/quotations/${quotation.id}`)} />
          <Button
            label="Download PDF"
            onClick={() => {
              showToast({ title: 'Download started', description: `${quotation.quotationNo}.pdf`, variant: 'success' })
              window.print()
            }}
          />
          <Button label="Share PDF" onClick={() => setShareOpen(true)} />
        </Stack>
        <QuotationPdfPreviewPanel quotation={quotation} />
      </AdminRecordPageChrome>

      <QuotationShareModal
        open={shareOpen}
        quotation={quotation}
        onClose={() => setShareOpen(false)}
        onShared={() => {
          setShareOpen(false)
          quotationService.share(quotation.id, ACTOR, { recipientEmail: quotation.customer.emailAddress })
          showToast({ title: 'Quotation PDF shared', variant: 'success' })
        }}
        actor={ACTOR}
      />
    </>
  )
}

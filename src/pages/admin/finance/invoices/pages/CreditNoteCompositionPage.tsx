import { useState } from 'react'
import { Box, CircularProgress } from '@mui/material'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { ConfirmDialog, EmptyState, useToast } from '@/design-system/UIComponents'
import { AdminFullPageFormFooter } from '@/pages/admin/components/AdminFullPageFormFooter'
import { AdminFullPageFormShell } from '@/pages/admin/components/AdminFullPageFormShell'
import { invoiceService } from '@/shared/services/invoiceService'
import { getListingReturnHref } from '@/shared/utils/listingNavigationUtils'
import { useGenerateInvoiceComposition } from '../hooks/useGenerateInvoiceComposition'

const LISTING_PATH = '/admin/finance/invoices'
const GENERATE_DRAFT_PATH = `${LISTING_PATH}/generate`

export function CreditNoteCompositionPage() {
  const { invoiceId: sourceInvoiceId } = useParams<{ invoiceId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const listingHref = getListingReturnHref(location, LISTING_PATH)
  const { showToast } = useToast()
  const [revisedPromptOpen, setRevisedPromptOpen] = useState(false)
  const [createdCreditNoteId, setCreatedCreditNoteId] = useState<string>()

  const source = sourceInvoiceId ? invoiceService.getById(sourceInvoiceId) : undefined

  const composition = useGenerateInvoiceComposition({
    applicationIds: [],
    batchIds: [],
    creditNoteSourceId: sourceInvoiceId,
    enabled: Boolean(source),
  })

  const openRevisedInvoice = (creditNoteId: string) => {
    const cn = invoiceService.getById(creditNoteId)
    if (!cn) return
    const originId = cn.sourceInvoiceId ?? cn.id
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
    const draft = invoiceService.createRevisedInvoiceDraft(cn.id)
    if (!draft) {
      showToast({ title: 'Unable to create revised invoice', variant: 'error' })
      return
    }
    showToast({
      title: 'Revised invoice draft created',
      description: 'Edit services, add lines, or change billing entity, then submit.',
      variant: 'success',
    })
    navigate(`${GENERATE_DRAFT_PATH}?draftId=${draft.id}&step=1`)
  }

  if (!sourceInvoiceId || !source) {
    return (
      <EmptyState
        variant="no-data"
        title="Invoice not found"
        action={{ label: 'Back to invoices', onClick: () => navigate(listingHref) }}
      />
    )
  }

  if (!composition.ready) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={32} />
      </Box>
    )
  }

  return (
    <>
      <AdminFullPageFormShell
        breadcrumbs={[
          { label: 'Billing & invoices', href: listingHref },
          { label: source.invoiceId, href: `${LISTING_PATH}/${source.id}` },
          { label: 'Create credit note' },
        ]}
        title="Create credit note"
        description={`Credit note against ${source.invoiceId}. Keep or remove services, then submit. After this you can create a revised invoice.`}
        sections={composition.sections}
        footer={
          <AdminFullPageFormFooter
            onCancel={() => navigate(`${LISTING_PATH}/${source.id}`)}
            cancelLabel="Back"
            onSave={() => {
              const creditNote = composition.handleSubmit()
              if (creditNote && typeof creditNote === 'object' && 'id' in creditNote) {
                setCreatedCreditNoteId(creditNote.id)
                setRevisedPromptOpen(true)
              }
            }}
            saveLabel="Submit credit note"
            loading={composition.saving}
            disabled={!composition.ready}
          />
        }
      />

      <ConfirmDialog
        open={revisedPromptOpen}
        onClose={() => {
          setRevisedPromptOpen(false)
          if (createdCreditNoteId) navigate(`${LISTING_PATH}/${createdCreditNoteId}`)
        }}
        title="Create revised invoice?"
        description="Open invoice composition to keep or add services and change billing entity if needed."
        confirmLabel="Create revised invoice"
        cancelLabel="Not now"
        onConfirm={() => {
          const id = createdCreditNoteId
          setRevisedPromptOpen(false)
          if (id) openRevisedInvoice(id)
        }}
      />
    </>
  )
}

import { useMemo, useState } from 'react'
import { Box, CircularProgress } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { BaseCard, Tabs, useToast } from '@/design-system/UIComponents'
import { AdminDetailShell } from '@/pages/admin/components/AdminDetailShell'
import { quotationService } from '@/shared/services/quotationService'
import { QuotationDetailSummary } from '../components/QuotationDetailSummary'
import { QuotationShareModal } from '../components/QuotationShareModal'
import { QuotationConvertDialog } from '../components/QuotationConvertDialog'
import { OverviewTab } from '../components/detail/OverviewTab'
import { CurrentPricingTab } from '../components/detail/CurrentPricingTab'
import { PricingVersionsTab } from '../components/detail/PricingVersionsTab'
import { DocumentsTab } from '../components/detail/DocumentsTab'
import { TimelineTab } from '../components/detail/TimelineTab'
import { useQuotationDetailState } from '../hooks/useQuotationDetailState'

const ACTOR = 'Admin User'

export function QuotationDetailPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { quotationId } = useParams<{ quotationId: string }>()
  const { loading, quotation, reload } = useQuotationDetailState(quotationId)
  const [activeTab, setActiveTab] = useState('overview')
  const [shareOpen, setShareOpen] = useState(false)
  const [convertOpen, setConvertOpen] = useState(false)
  const [convertVersionId, setConvertVersionId] = useState<string>()

  const tabs = useMemo(
    () => [
      { label: 'Overview', value: 'overview' },
      { label: 'Current Pricing', value: 'pricing' },
      { label: 'Pricing Versions', value: 'versions', badge: quotation?.pricingVersions.length ?? 0 },
      { label: 'Documents', value: 'documents', badge: quotation?.attachments.length ?? 0 },
      { label: 'Timeline', value: 'timeline', badge: quotation?.activities.length ?? 0 },
    ],
    [quotation],
  )

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 240 }}>
        <CircularProgress size={32} />
      </Box>
    )
  }

  if (!quotation) {
    return null
  }

  const handleConvert = (versionId: string) => {
    const result = quotationService.markConverted(quotation.id, versionId)
    if (!result.ok) {
      showToast({ title: 'Cannot convert', description: result.issues?.join('; '), variant: 'error' })
      return
    }
    setConvertOpen(false)
    setConvertVersionId(undefined)
    navigate(`/admin/customer-accounts/agreements/new?quotationId=${quotation.id}&versionId=${versionId}`)
  }

  return (
    <>
      <AdminDetailShell
        breadcrumbs={[
          { label: 'Client Management', href: '/admin/customer-accounts/quotations' },
          { label: 'Quotations', href: '/admin/customer-accounts/quotations' },
          { label: quotation.quotationNo },
        ]}
        summary={
          <QuotationDetailSummary
            quotation={quotation}
            onEdit={() => navigate(`/admin/customer-accounts/quotations/${quotation.id}/edit`)}
            onShare={() => setShareOpen(true)}
            onGeneratePdf={() => navigate(`/admin/customer-accounts/quotations/${quotation.id}/pdf`)}
            onConvert={() => {
              setConvertVersionId(undefined)
              setConvertOpen(true)
            }}
          />
        }
      >
        <BaseCard sx={{ p: 0, overflow: 'hidden' }}>
          <Tabs items={tabs} value={activeTab} onChange={setActiveTab} variant="underline" size="sm" />
          <Box sx={{ p: 2 }}>
            {activeTab === 'overview' ? <OverviewTab quotation={quotation} /> : null}
            {activeTab === 'pricing' ? <CurrentPricingTab quotation={quotation} /> : null}
            {activeTab === 'versions' ? (
              <PricingVersionsTab
                quotation={quotation}
                onReload={reload}
                onConvert={(versionId) => {
                  setConvertVersionId(versionId)
                  setConvertOpen(true)
                }}
              />
            ) : null}
            {activeTab === 'documents' ? <DocumentsTab quotation={quotation} onReload={reload} /> : null}
            {activeTab === 'timeline' ? <TimelineTab quotation={quotation} /> : null}
          </Box>
        </BaseCard>
      </AdminDetailShell>

      <QuotationShareModal
        open={shareOpen}
        quotation={quotation}
        onClose={() => setShareOpen(false)}
        onShared={async () => {
          setShareOpen(false)
          showToast({ title: 'Quotation shared', variant: 'success' })
          await reload()
        }}
        actor={ACTOR}
      />

      <QuotationConvertDialog
        open={convertOpen}
        quotation={quotation}
        initialVersionId={convertVersionId}
        onClose={() => {
          setConvertOpen(false)
          setConvertVersionId(undefined)
        }}
        onConfirm={handleConvert}
      />
    </>
  )
}

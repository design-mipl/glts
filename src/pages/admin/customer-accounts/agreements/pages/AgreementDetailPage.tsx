import { useCallback, useEffect, useState } from 'react'
import { Box, CircularProgress } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { BaseCard, ConfirmDialog, EmptyState, Tabs, useToast } from '@/design-system/UIComponents'
import { AdminDetailShell } from '@/pages/admin/components/AdminDetailShell'
import { commercialAgreementService } from '@/shared/services/commercialAgreementService'
import type { CommercialAgreement } from '@/shared/types/commercialAgreement'
import { AgreementDetailSummary } from '../components/AgreementDetailSummary'
import { ActivityTab, DocumentsTab, OverviewTab } from '../components/detail/AgreementDetailTabs'

export function AgreementDetailPage() {
  const { agreementId } = useParams<{ agreementId: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [agreement, setAgreement] = useState<CommercialAgreement>()
  const [activeTab, setActiveTab] = useState('overview')
  const [rejectOpen, setRejectOpen] = useState(false)

  const reload = useCallback(() => {
    if (!agreementId) return
    setAgreement(commercialAgreementService.getById(agreementId))
    setLoading(false)
  }, [agreementId])

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

  if (!agreement) {
    return (
      <EmptyState
        variant="no-data"
        title="Agreement not found"
        action={{ label: 'Back to agreements', onClick: () => navigate('/admin/customer-accounts/agreements') }}
      />
    )
  }

  const handleSubmit = () => {
    const formData = commercialAgreementService.agreementToFormData(agreement)
    const validation = commercialAgreementService.validateForApproval(formData)
    if (!validation.ok) {
      showToast({ title: 'Cannot submit', description: validation.issues.join('; '), variant: 'error' })
      return
    }
    commercialAgreementService.submit(agreement.id, formData)
    showToast({ title: 'Agreement submitted', variant: 'success' })
    reload()
  }

  const handleApprove = () => {
    const result = commercialAgreementService.approve(agreement.id)
    if (!result.ok) {
      showToast({ title: 'Cannot approve', description: result.issues.join('; '), variant: 'error' })
      return
    }
    showToast({ title: 'Agreement approved', variant: 'success' })
    reload()
  }

  const handleReject = () => {
    commercialAgreementService.reject(agreement.id, 'Rejected from detail page')
    showToast({ title: 'Agreement rejected', variant: 'info' })
    setRejectOpen(false)
    reload()
  }

  return (
    <>
      <AdminDetailShell
        breadcrumbs={[
          { label: 'Customer & accounts', href: '/admin/customer-accounts/agreements' },
          { label: 'Agreements & contracts', href: '/admin/customer-accounts/agreements' },
          { label: agreement.agreementId },
        ]}
        summary={
          <AgreementDetailSummary
            agreement={agreement}
            onEdit={() => navigate(`/admin/customer-accounts/agreements/${agreement.id}/edit`)}
            onSubmit={agreement.status === 'draft' ? handleSubmit : undefined}
            onApprove={agreement.status === 'submitted' ? handleApprove : undefined}
            onReject={agreement.status === 'submitted' ? () => setRejectOpen(true) : undefined}
            onProceedToCorporate={
              agreement.status === 'approved'
                ? () => navigate(`/admin/customer-accounts/corporate-accounts/new?agreementId=${agreement.id}`)
                : undefined
            }
          />
        }
      >
        <Tabs
          items={[
            { label: 'Overview', value: 'overview' },
            { label: 'Documents', value: 'documents', badge: agreement.documents.length },
            { label: 'Activity', value: 'activity', badge: agreement.activities.length },
          ]}
          value={activeTab}
          onChange={setActiveTab}
        />
        <BaseCard sx={{ mt: 2, p: 2 }}>
          {activeTab === 'overview' ? <OverviewTab agreement={agreement} /> : null}
          {activeTab === 'documents' ? <DocumentsTab agreement={agreement} /> : null}
          {activeTab === 'activity' ? <ActivityTab agreement={agreement} /> : null}
        </BaseCard>
      </AdminDetailShell>

      <ConfirmDialog
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
        title="Reject agreement?"
        description="This agreement will be marked as rejected."
        confirmLabel="Reject"
        variant="destructive"
        onConfirm={handleReject}
      />
    </>
  )
}

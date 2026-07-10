import { useCallback, useEffect, useState } from 'react'
import { Box, CircularProgress } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { BaseCard, EmptyState, Tabs, useToast } from '@/design-system/UIComponents'
import { AdminDetailShell } from '@/pages/admin/components/AdminDetailShell'
import { commercialAgreementService } from '@/shared/services/commercialAgreementService'
import type { CommercialAgreement } from '@/shared/types/commercialAgreement'
import { AgreementDetailSummary } from '../components/AgreementDetailSummary'
import { AgreementStatusUpdateDialog } from '../components/AgreementStatusUpdateDialog'
import { canUpdateAgreementHoldOrTerminate } from '../config/agreementStatusConfig'
import {
  ActivityTab,
  BillingConfigurationTab,
  DocumentsTab,
  EntitiesTab,
  OverviewTab,
  PricingMatrixTab,
  TaxConfigurationTab,
} from '../components/detail/AgreementDetailTabs'

export function AgreementDetailPage() {
  const { agreementId } = useParams<{ agreementId: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [agreement, setAgreement] = useState<CommercialAgreement>()
  const [activeTab, setActiveTab] = useState('overview')
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [statusUpdating, setStatusUpdating] = useState(false)

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

  const handleMarkReady = () => {
    const formData = commercialAgreementService.agreementToFormData(agreement)
    const validation = commercialAgreementService.validateForActivation(formData)
    if (!validation.ok) {
      showToast({ title: 'Cannot mark ready', description: validation.issues.join('; '), variant: 'error' })
      return
    }
    try {
      commercialAgreementService.markReadyForActivation(agreement.id, formData)
      showToast({ title: 'Agreement ready for activation', variant: 'success' })
      reload()
    } catch (error) {
      showToast({
        title: 'Cannot mark ready',
        description: error instanceof Error ? error.message : 'Validation failed',
        variant: 'error',
      })
    }
  }

  const handleStatusUpdate = (status: 'on_hold' | 'terminated', remarks: string) => {
    setStatusUpdating(true)
    const updated = commercialAgreementService.updateHoldOrTerminateStatus(agreement.id, status, remarks)
    setStatusUpdating(false)
    if (!updated) {
      showToast({ title: 'Unable to update status', description: 'Check remarks and current agreement status.', variant: 'error' })
      return
    }
    setStatusDialogOpen(false)
    showToast({ title: 'Agreement status updated', variant: 'success' })
    reload()
  }

  return (
    <>
      <AdminDetailShell
        breadcrumbs={[
          { label: 'Client Management', href: '/admin/customer-accounts/agreements' },
          { label: 'Agreements', href: '/admin/customer-accounts/agreements' },
          { label: agreement.agreementId },
        ]}
        summary={
          <AgreementDetailSummary
            agreement={agreement}
            onEdit={() => navigate(`/admin/customer-accounts/agreements/${agreement.id}/edit`)}
            onMarkReady={agreement.status === 'draft' ? handleMarkReady : undefined}
            onProceedToCorporate={
              agreement.status === 'ready_for_activation'
                ? () => navigate(`/admin/customer-accounts/corporate-accounts/new?agreementId=${agreement.id}`)
                : undefined
            }
            onUpdateStatus={
              canUpdateAgreementHoldOrTerminate(agreement.status)
                ? () => setStatusDialogOpen(true)
                : undefined
            }
          />
        }
      >
        <BaseCard>
          <Box sx={{ px: 2.5, pt: 1.5, borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              items={[
                { label: 'Overview', value: 'overview' },
                { label: 'Entities', value: 'entities', badge: agreement.entities.length || undefined },
                { label: 'Pricing Matrix', value: 'pricing', badge: agreement.pricingMatrix.length || undefined },
                { label: 'Billing Configuration', value: 'billing' },
                { label: 'Tax Configuration', value: 'tax' },
                { label: 'Documents', value: 'documents', badge: agreement.documents.length },
                { label: 'Activity Logs', value: 'activity', badge: agreement.activities.length || undefined },
              ]}
              value={activeTab}
              onChange={setActiveTab}
              variant="underline"
              size="sm"
            />
          </Box>
          <Box sx={{ p: 2.5 }}>
            {activeTab === 'overview' ? <OverviewTab agreement={agreement} /> : null}
            {activeTab === 'entities' ? <EntitiesTab agreement={agreement} /> : null}
            {activeTab === 'pricing' ? <PricingMatrixTab agreement={agreement} /> : null}
            {activeTab === 'billing' ? <BillingConfigurationTab agreement={agreement} /> : null}
            {activeTab === 'tax' ? <TaxConfigurationTab agreement={agreement} /> : null}
            {activeTab === 'documents' ? <DocumentsTab agreement={agreement} /> : null}
            {activeTab === 'activity' ? <ActivityTab agreement={agreement} /> : null}
          </Box>
        </BaseCard>
      </AdminDetailShell>

      <AgreementStatusUpdateDialog
        open={statusDialogOpen}
        onClose={() => setStatusDialogOpen(false)}
        onConfirm={handleStatusUpdate}
        loading={statusUpdating}
      />
    </>
  )
}

import { useCallback, useEffect, useState } from 'react'
import { Box, CircularProgress } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { BaseCard, EmptyState, Tabs, useToast } from '@/design-system/UIComponents'
import { AdminDetailShell } from '@/pages/admin/components/AdminDetailShell'
import { corporateAccountService } from '@/shared/services/corporateAccountService'
import type { CorporateAccount } from '@/shared/types/corporateAccount'
import { PORTAL_LOGIN_URL } from '@/shared/utils/corporateAccountValidation'
import { CorporateAccountDetailSummary } from '../components/CorporateAccountDetailSummary'
import {
  ActivityTab,
  AdminsTab,
  BillingTab,
  DocumentsTab,
  EntitiesTab,
  OverviewTab,
  VesselsTab,
} from '../components/detail/CorporateAccountDetailTabs'

export function CorporateAccountDetailPage() {
  const { accountId } = useParams<{ accountId: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [account, setAccount] = useState<CorporateAccount>()
  const [activeTab, setActiveTab] = useState('overview')

  const reload = useCallback(() => {
    if (!accountId) return
    setAccount(corporateAccountService.getById(accountId))
    setLoading(false)
  }, [accountId])

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

  if (!account) {
    return (
      <EmptyState
        variant="no-data"
        title="Corporate account not found"
        action={{ label: 'Back to corporate accounts', onClick: () => navigate('/admin/customer-accounts/corporate-accounts') }}
      />
    )
  }

  const handleSendLogin = (adminId: string) => {
    const payload = corporateAccountService.sendLoginEmail(account.id, adminId)
    if (!payload) {
      showToast({ title: 'Could not send credentials', variant: 'error' })
      return
    }
    showToast({
      title: 'Login credentials sent',
      description: `${payload.portalUrl} · ${payload.username} · ${payload.temporaryPassword}`,
      variant: 'success',
    })
    reload()
  }

  const handleActivate = () => {
    const formData = corporateAccountService.accountToFormData(account)
    const result = corporateAccountService.activate(account.id, formData)
    if (!result.ok) {
      showToast({ title: 'Cannot activate', description: result.issues.join('; '), variant: 'error' })
      return
    }
    showToast({ title: 'Account activated', variant: 'success' })
    reload()
  }

  return (
    <AdminDetailShell
      breadcrumbs={[
        { label: 'Customer & accounts', href: '/admin/customer-accounts/corporate-accounts' },
        { label: 'Corporate accounts', href: '/admin/customer-accounts/corporate-accounts' },
        { label: account.companyName },
      ]}
      summary={
        <CorporateAccountDetailSummary
          account={account}
          onEdit={() => navigate(`/admin/customer-accounts/corporate-accounts/${account.id}/edit`)}
          onActivate={account.portalStatus !== 'active' ? handleActivate : undefined}
          onDeactivate={
            account.portalStatus === 'active'
              ? () => {
                  corporateAccountService.deactivate(account.id)
                  showToast({ title: 'Account deactivated', variant: 'info' })
                  reload()
                }
              : undefined
          }
          onSendCredentials={
            account.superAdmin
              ? () => {
                  handleSendLogin(account.superAdmin!.id)
                  showToast({ title: 'Credentials queued', description: PORTAL_LOGIN_URL, variant: 'info' })
                }
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
              { label: 'Admins', value: 'admins', badge: corporateAccountService.getCounts(account).totalAdmins },
              { label: 'Entities', value: 'entities', badge: account.entityIds.length },
              { label: 'Vessels', value: 'vessels', badge: account.vesselIds.length },
              { label: 'Billing configuration', value: 'billing' },
              { label: 'Documents', value: 'documents' },
              { label: 'Activity logs', value: 'activity', badge: account.activities.length },
            ]}
            value={activeTab}
            onChange={setActiveTab}
            variant="underline"
            size="sm"
            scrollable
          />
        </Box>
        <Box sx={{ p: 2.5 }}>
          {activeTab === 'overview' ? <OverviewTab account={account} /> : null}
          {activeTab === 'admins' ? <AdminsTab account={account} onSendLogin={handleSendLogin} /> : null}
          {activeTab === 'entities' ? <EntitiesTab account={account} /> : null}
          {activeTab === 'vessels' ? <VesselsTab account={account} /> : null}
          {activeTab === 'billing' ? <BillingTab account={account} /> : null}
          {activeTab === 'documents' ? <DocumentsTab account={account} /> : null}
          {activeTab === 'activity' ? <ActivityTab account={account} /> : null}
        </Box>
      </BaseCard>
    </AdminDetailShell>
  )
}

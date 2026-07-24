import { useCallback, useEffect, useState } from 'react'
import { Box, CircularProgress } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { BaseCard, ConfirmDialog, EmptyState, Tabs, useToast } from '@/design-system/UIComponents'
import { AdminDetailShell } from '@/pages/admin/components/AdminDetailShell'
import { bookerManagementService } from '@/shared/services/bookerManagementService'
import { corporateAccountService } from '@/shared/services/corporateAccountService'
import type { CorporateAccount } from '@/shared/types/corporateAccount'
import { PORTAL_LOGIN_URL } from '@/shared/utils/corporateAccountValidation'
import { CorporateAccountDetailSummary } from '../components/CorporateAccountDetailSummary'
import {
  ActivityTab,
  AdminsTab,
  AssignedUsersTab,
  BillingTab,
  DocumentsTab,
  EntitiesTab,
  OverviewTab,
  BookersTab,
  VesselsTab,
} from '../components/detail/CorporateAccountDetailTabs'

export function CorporateAccountDetailPage() {
  const { accountId } = useParams<{ accountId: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [account, setAccount] = useState<CorporateAccount>()
  const [activeTab, setActiveTab] = useState('overview')
  const [accessTarget, setAccessTarget] = useState<{ adminId: string; accessStatus: 'active' | 'inactive' }>()
  const [bookerAccessTarget, setBookerAccessTarget] = useState<{ bookerId: string; status: 'active' | 'inactive' }>()

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

  const handleConfirmAccessChange = () => {
    if (!accessTarget) return
    const { adminId, accessStatus } = accessTarget
    const updated = corporateAccountService.setAdminAccessStatus(account.id, adminId, accessStatus)
    setAccessTarget(undefined)
    if (!updated) {
      showToast({ title: 'Could not update user access', variant: 'error' })
      return
    }
    showToast({
      title: accessStatus === 'active' ? 'User activated' : 'User deactivated',
      variant: 'success',
    })
    reload()
  }

  const accessTargetAdmin = accessTarget
    ? [account.superAdmin, ...account.admins].find((admin) => admin?.id === accessTarget.adminId)
    : undefined

  const handleSendBookerLogin = (bookerId: string) => {
    const payload = bookerManagementService.sendLoginEmail(bookerId)
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

  const handleConfirmBookerAccessChange = () => {
    if (!bookerAccessTarget) return
    const { bookerId, status } = bookerAccessTarget
    const updated = bookerManagementService.setStatus(bookerId, status)
    setBookerAccessTarget(undefined)
    if (!updated) {
      showToast({ title: 'Could not update booker access', variant: 'error' })
      return
    }
    showToast({
      title: status === 'active' ? 'Booker activated' : 'Booker deactivated',
      variant: 'success',
    })
    reload()
  }

  const bookerAccessTargetRecord = bookerAccessTarget
    ? (account.bookerIds ?? [])
        .map((id) => bookerManagementService.getById(id))
        .find((booker) => booker?.id === bookerAccessTarget.bookerId)
    : undefined

  return (
    <>
      <AdminDetailShell
      breadcrumbs={[
        { label: 'Client Management', href: '/admin/customer-accounts/corporate-accounts' },
        { label: 'Client Accounts', href: '/admin/customer-accounts/corporate-accounts' },
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
              {
                label: 'Assigned users',
                value: 'assigned-users',
                badge: account.assignedUserIds?.length ?? 0,
              },
              { label: 'Entities', value: 'entities', badge: corporateAccountService.getCounts(account).totalEntities },
              { label: 'Vessels', value: 'vessels', badge: corporateAccountService.getCounts(account).totalVessels },
              { label: 'Bookers', value: 'bookers', badge: corporateAccountService.getCounts(account).totalBookers },
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
          {activeTab === 'admins' ? (
            <AdminsTab
              account={account}
              onSendLogin={handleSendLogin}
              onSetAccessStatus={(adminId, accessStatus) => setAccessTarget({ adminId, accessStatus })}
            />
          ) : null}
          {activeTab === 'assigned-users' ? <AssignedUsersTab account={account} /> : null}
          {activeTab === 'entities' ? <EntitiesTab account={account} /> : null}
          {activeTab === 'vessels' ? <VesselsTab account={account} /> : null}
          {activeTab === 'bookers' ? (
            <BookersTab
              account={account}
              onSendLogin={handleSendBookerLogin}
              onSetStatus={(bookerId, status) => setBookerAccessTarget({ bookerId, status })}
            />
          ) : null}
          {activeTab === 'billing' ? <BillingTab account={account} /> : null}
          {activeTab === 'documents' ? <DocumentsTab account={account} /> : null}
          {activeTab === 'activity' ? <ActivityTab account={account} /> : null}
        </Box>
      </BaseCard>

      <ConfirmDialog
        open={Boolean(bookerAccessTarget)}
        onClose={() => setBookerAccessTarget(undefined)}
        onConfirm={handleConfirmBookerAccessChange}
        title={bookerAccessTarget?.status === 'inactive' ? 'Deactivate booker?' : 'Activate booker?'}
        description={
          bookerAccessTargetRecord
            ? bookerAccessTarget?.status === 'inactive'
              ? `${bookerAccessTargetRecord.fullName} will lose portal login access until reactivated.`
              : `${bookerAccessTargetRecord.fullName} will be able to sign in to the corporate portal again.`
            : 'Update portal access for this booker.'
        }
        confirmLabel={bookerAccessTarget?.status === 'inactive' ? 'Deactivate' : 'Activate'}
        variant={bookerAccessTarget?.status === 'inactive' ? 'destructive' : 'default'}
      />

      <ConfirmDialog
        open={Boolean(accessTarget)}
        onClose={() => setAccessTarget(undefined)}
        onConfirm={handleConfirmAccessChange}
        title={accessTarget?.accessStatus === 'inactive' ? 'Deactivate user?' : 'Activate user?'}
        description={
          accessTargetAdmin
            ? accessTarget?.accessStatus === 'inactive'
              ? `${accessTargetAdmin.fullName} will lose portal login access until reactivated.`
              : `${accessTargetAdmin.fullName} will be able to sign in to the corporate portal again.`
            : 'Update portal access for this user.'
        }
        confirmLabel={accessTarget?.accessStatus === 'inactive' ? 'Deactivate' : 'Activate'}
        variant={accessTarget?.accessStatus === 'inactive' ? 'destructive' : 'default'}
      />
    </AdminDetailShell>
    </>
  )
}

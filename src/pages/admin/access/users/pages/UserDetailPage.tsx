import { useCallback, useMemo, useState } from 'react'
import { Box } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { BaseCard, ConfirmDialog, EmptyState, Tabs, useToast } from '@/design-system/UIComponents'
import { AdminDetailShell } from '@/pages/admin/components/AdminDetailShell'
import { adminPortalUserService } from '@/shared/services/adminPortalUserService'
import { UserActivityLogTable } from '../components/UserActivityLogTable'
import { UserDetailSummary } from '../components/UserDetailSummary'
import { UserPermissionSummary } from '../components/UserPermissionSummary'
import {
  UserBasicInfoSection,
  UserTeamInfoSection,
} from '../components/UserReadOnlySections'

type UserDetailTab = 'basic' | 'team' | 'permissions' | 'activity'

const DETAIL_TABS = [
  { value: 'basic' as const, label: 'Basic information' },
  { value: 'team' as const, label: 'Team information' },
  { value: 'permissions' as const, label: 'Permission summary' },
  { value: 'activity' as const, label: 'Activity logs' },
]

export function UserDetailPage() {
  const { userId } = useParams<{ userId: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState<UserDetailTab>('basic')
  const [refreshKey, setRefreshKey] = useState(0)
  const [statusOpen, setStatusOpen] = useState(false)
  const [superAdminConfirm, setSuperAdminConfirm] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  const user = useMemo(() => {
    void refreshKey
    return userId ? adminPortalUserService.getById(userId) : undefined
  }, [userId, refreshKey])

  const reload = useCallback(() => setRefreshKey((k) => k + 1), [])

  const handleConfirmStatus = () => {
    if (!user) return
    if (user.isSuperAdmin && user.status === 'active' && !superAdminConfirm) {
      setSuperAdminConfirm(true)
      return
    }
    setActionLoading(true)
    const nextStatus = user.status === 'active' ? 'inactive' : 'active'
    adminPortalUserService.setStatus(user.id, nextStatus, {
      confirmSuperAdmin: user.isSuperAdmin && nextStatus === 'inactive',
    })
    setActionLoading(false)
    showToast({
      title: nextStatus === 'active' ? 'User activated' : 'User deactivated',
      description:
        nextStatus === 'inactive'
          ? 'Login access is blocked. Historical data and logs are preserved.'
          : undefined,
      variant: 'success',
    })
    setStatusOpen(false)
    setSuperAdminConfirm(false)
    reload()
  }

  if (!userId || !user) {
    return (
      <EmptyState
        variant="no-data"
        title="User not found"
        action={{ label: 'Back to users', onClick: () => navigate('/admin/access/users') }}
      />
    )
  }

  const statusDescription =
    user.isSuperAdmin && user.status === 'active' && superAdminConfirm
      ? 'This will disable the only Super Admin account. Admin login access will be blocked until another Super Admin is activated.'
      : user.status === 'active'
        ? `Deactivate "${user.fullName}"? Login access will be blocked. User data and activity logs will be preserved.`
        : `Activate "${user.fullName}"?`

  return (
    <>
      <AdminDetailShell
        breadcrumbs={[
          { label: 'User management', href: '/admin/access/users' },
          { label: 'User & permission', href: '/admin/access/users' },
          { label: user.fullName },
        ]}
        summary={
          <UserDetailSummary
            user={user}
            onEdit={() => navigate(`/admin/access/users/${user.id}/edit`)}
            onConfigurePermissions={() => navigate(`/admin/access/users/${user.id}/permissions`)}
            onToggleStatus={() => {
              setSuperAdminConfirm(false)
              setStatusOpen(true)
            }}
          />
        }
      >
        <BaseCard>
          <Box sx={{ px: 2.5, pt: 1.5, borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={activeTab}
              onChange={(v) => setActiveTab(v as UserDetailTab)}
              variant="underline"
              size="sm"
              items={DETAIL_TABS.map((t) => ({
                ...t,
                badge: t.value === 'activity' ? user.activityLogs.length : undefined,
              }))}
            />
          </Box>
          <Box sx={{ p: 2.5 }}>
            {activeTab === 'basic' && <UserBasicInfoSection user={user} />}
            {activeTab === 'team' && <UserTeamInfoSection user={user} />}
            {activeTab === 'permissions' && (
              <UserPermissionSummary
                permissions={user.permissions}
                isSuperAdmin={user.isSuperAdmin}
              />
            )}
            {activeTab === 'activity' && <UserActivityLogTable logs={user.activityLogs} />}
          </Box>
        </BaseCard>
      </AdminDetailShell>

      <ConfirmDialog
        open={statusOpen}
        onClose={() => {
          setStatusOpen(false)
          setSuperAdminConfirm(false)
        }}
        onConfirm={handleConfirmStatus}
        loading={actionLoading}
        title={
          user.status === 'active'
            ? superAdminConfirm && user.isSuperAdmin
              ? 'Deactivate Super Admin?'
              : 'Deactivate user?'
            : 'Activate user?'
        }
        description={statusDescription}
        confirmLabel={
          user.status === 'active'
            ? superAdminConfirm && user.isSuperAdmin
              ? 'Deactivate Super Admin'
              : 'Deactivate'
            : 'Activate'
        }
        variant={user.status === 'active' ? 'destructive' : 'default'}
      />
    </>
  )
}

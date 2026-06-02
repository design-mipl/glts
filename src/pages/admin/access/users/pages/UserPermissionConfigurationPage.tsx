import { useEffect, useMemo, useState } from 'react'
import { Box, Typography } from '@mui/material'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Button, EmptyState, useToast } from '@/design-system/UIComponents'
import { getRoleTemplatePermissions } from '@/shared/config/adminRoleTemplates'
import { adminPortalUserService } from '@/shared/services/adminPortalUserService'
import { teamService } from '@/shared/services/teamService'
import type { AdminUserPermissions } from '@/shared/types/adminPermission'
import {
  createEmptyPermissions,
  hasNoConfiguredPermissions,
} from '@/shared/utils/adminPermissionEngine'
import { UserPermissionAccordion } from '../components/UserPermissionAccordion'
import { UserPermissionConfigurationShell } from '../components/UserPermissionConfigurationShell'
import { UserPermissionSummary } from '../components/UserPermissionSummary'

function resolveInitialPermissions(
  saved: AdminUserPermissions,
  roleTemplateId: string | null,
): AdminUserPermissions {
  if (roleTemplateId && hasNoConfiguredPermissions(saved)) {
    return getRoleTemplatePermissions(roleTemplateId)
  }
  return JSON.parse(JSON.stringify(saved)) as AdminUserPermissions
}

export function UserPermissionConfigurationPage() {
  const { userId } = useParams<{ userId: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const isCreateFlow = searchParams.get('flow') === 'create'
  const [loading, setLoading] = useState(false)

  const user = useMemo(
    () => (userId ? adminPortalUserService.getById(userId) : undefined),
    [userId],
  )

  const [permissions, setPermissions] = useState<AdminUserPermissions>(() =>
    createEmptyPermissions(),
  )

  useEffect(() => {
    if (!user) return
    setPermissions(resolveInitialPermissions(user.permissions, user.roleTemplateId))
  }, [user])

  if (!userId || !user) {
    return (
      <EmptyState
        variant="no-data"
        title="User not found"
        action={{ label: 'Back to users', onClick: () => navigate('/admin/access/users') }}
      />
    )
  }

  const teamName = teamService.getById(user.teamId)?.name ?? '—'
  const isReadOnly = user.isSuperAdmin

  const breadcrumbs = isCreateFlow
    ? [
        { label: 'User management', href: '/admin/access/users' },
        { label: 'User & permission', href: '/admin/access/users' },
        { label: 'Add user', href: '/admin/access/users/new' },
        { label: 'Configure permissions' },
      ]
    : [
        { label: 'User management', href: '/admin/access/users' },
        { label: 'User & permission', href: '/admin/access/users' },
        { label: user.fullName, href: `/admin/access/users/${user.id}` },
        { label: 'Configure permissions' },
      ]

  const handleBack = () => {
    if (isCreateFlow) {
      navigate(`/admin/access/users/${user.id}/edit`)
      return
    }
    navigate(`/admin/access/users/${user.id}`)
  }

  const persistPermissions = (finish: boolean) => {
    if (isReadOnly) return
    setLoading(true)
    const result = adminPortalUserService.updatePermissions(user.id, permissions)
    setLoading(false)
    if (!result) return
    if ('error' in result) {
      showToast({
        title: 'Permissions cannot be changed',
        description: 'Super Admin has full access and permissions are read-only.',
        variant: 'info',
      })
      return
    }
    showToast({
      title: finish ? 'User setup complete' : 'Permissions saved',
      variant: 'success',
    })
    if (finish) {
      navigate(`/admin/access/users/${user.id}`)
    }
  }

  const footer = (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'flex-end' }}>
      <Button label="Back" variant="outlined" color="secondary" onClick={handleBack} disabled={loading} />
      {!isReadOnly ? (
        <>
          <Button
            label="Save Permissions"
            variant="soft"
            color="primary"
            onClick={() => persistPermissions(false)}
            loading={loading}
          />
          <Button
            label="Save & Finish"
            variant="contained"
            color="primary"
            onClick={() => persistPermissions(true)}
            loading={loading}
          />
        </>
      ) : null}
    </Box>
  )

  return (
    <UserPermissionConfigurationShell
      breadcrumbs={breadcrumbs}
      title="Configure permissions"
      description="Set module-level and submodule-level access for this user."
      userContext={
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
          {user.fullName} · {user.email} · {teamName}
        </Typography>
      }
      mainPanel={
        <>
          {isReadOnly ? (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Super Admin has full access to all modules. Permissions cannot be edited for this
              account.
            </Typography>
          ) : null}
          <UserPermissionAccordion
            permissions={permissions}
            onChange={setPermissions}
            readOnly={isReadOnly}
          />
        </>
      }
      summaryPanel={
        <UserPermissionSummary permissions={permissions} isSuperAdmin={isReadOnly} />
      }
      footer={footer}
    />
  )
}

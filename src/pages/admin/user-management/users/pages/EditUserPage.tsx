import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { EmptyState } from '@/design-system/UIComponents'
import { adminPortalUserService } from '@/shared/services/adminPortalUserService'
import { AdminPortalUserFormPage } from './AdminUserFormPage'

export function EditUserPage() {
  const { userId } = useParams<{ userId: string }>()
  const navigate = useNavigate()
  const user = userId ? adminPortalUserService.getById(userId) : undefined

  if (!userId || !user) {
    return (
      <EmptyState
        variant="no-data"
        title="User not found"
        action={{ label: 'Back to users', onClick: () => navigate('/admin/user-management/users') }}
      />
    )
  }

  return (
    <AdminPortalUserFormPage
      mode="edit"
      user={user}
      breadcrumbs={[
        { label: 'User management', href: '/admin/user-management/users' },
        { label: 'User & permission', href: '/admin/user-management/users' },
        { label: user.fullName, href: `/admin/user-management/users/${user.id}` },
        { label: 'Edit' },
      ]}
      cancelHref={`/admin/user-management/users/${user.id}`}
    />
  )
}

/** Legacy configure-permissions URL → combined edit page. */
export function UserPermissionConfigurationPage() {
  const { userId } = useParams<{ userId: string }>()
  if (!userId) {
    return <Navigate to="/admin/user-management/users" replace />
  }
  return <Navigate to={`/admin/user-management/users/${userId}/edit`} replace />
}

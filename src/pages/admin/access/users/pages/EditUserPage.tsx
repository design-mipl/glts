import { useNavigate, useParams } from 'react-router-dom'
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
        action={{ label: 'Back to users', onClick: () => navigate('/admin/access/users') }}
      />
    )
  }

  return (
    <AdminPortalUserFormPage
      mode="edit"
      user={user}
      breadcrumbs={[
        { label: 'User management', href: '/admin/access/users' },
        { label: 'User & permission', href: '/admin/access/users' },
        { label: user.fullName, href: `/admin/access/users/${user.id}` },
        { label: 'Edit' },
      ]}
      cancelHref={`/admin/access/users/${user.id}`}
    />
  )
}

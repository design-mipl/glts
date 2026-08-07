import { AdminPortalUserFormPage } from './AdminUserFormPage'

export function CreateUserPage() {
  return (
    <AdminPortalUserFormPage
      mode="create"
      breadcrumbs={[
        { label: 'User management', href: '/admin/user-management/users' },
        { label: 'User & permission', href: '/admin/user-management/users' },
        { label: 'Add user' },
      ]}
      cancelHref="/admin/user-management/users"
    />
  )
}

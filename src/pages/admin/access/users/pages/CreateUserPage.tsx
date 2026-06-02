import { AdminPortalUserFormPage } from './AdminUserFormPage'

export function CreateUserPage() {
  return (
    <AdminPortalUserFormPage
      mode="create-basic"
      breadcrumbs={[
        { label: 'User management', href: '/admin/access/users' },
        { label: 'User & permission', href: '/admin/access/users' },
        { label: 'Add user' },
      ]}
      cancelHref="/admin/access/users"
    />
  )
}

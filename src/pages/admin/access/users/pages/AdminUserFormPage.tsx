import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/design-system/UIComponents'
import {
  AdminFullPageFormFooter,
  AdminFullPageFormHeaderSave,
} from '@/pages/admin/components/AdminFullPageFormFooter'
import { AdminFullPageFormShell } from '@/pages/admin/components/AdminFullPageFormShell'
import { adminPortalUserService } from '@/shared/services/adminPortalUserService'
import type { AdminPortalUser } from '@/shared/types/adminPortalUser'
import { UserFormFields } from '../components/UserFormFields'
import { UserSecurityFields } from '../components/UserSecurityFields'
import {
  INITIAL_ADMIN_USER_BASIC_FORM,
  AdminPortalUserToFormData,
  useAdminPortalUserBasicForm,
  useAdminPortalUserForm,
} from '../hooks/useAdminUserForm'

interface AdminPortalUserFormPageProps {
  mode: 'create-basic' | 'edit'
  user?: AdminPortalUser
  breadcrumbs: { label: string; href?: string }[]
  cancelHref: string
}

export function AdminPortalUserFormPage({
  mode,
  user,
  breadcrumbs,
  cancelHref,
}: AdminPortalUserFormPageProps) {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const editForm = useAdminPortalUserForm()
  const basicForm = useAdminPortalUserBasicForm()
  const [loading, setLoading] = useState(false)

  const isCreateBasic = mode === 'create-basic'

  useEffect(() => {
    if (mode === 'edit' && user) {
      editForm.reset(AdminPortalUserToFormData(user))
    } else if (mode === 'create-basic') {
      basicForm.reset(INITIAL_ADMIN_USER_BASIC_FORM)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, user?.id])

  const handleSaveAndContinue = () => {
    if (!basicForm.validateBasic()) return
    setLoading(true)
    const result = adminPortalUserService.createBasicProfile(basicForm.formData)
    setLoading(false)
    if (result && 'error' in result) {
      showToast({
        title: 'Could not create user',
        description: 'A user with this email already exists.',
        variant: 'error',
      })
      return
    }
    showToast({ title: 'Basic profile saved', variant: 'success' })
    navigate(`/admin/access/users/${(result as AdminPortalUser).id}/permissions?flow=create`)
  }

  const handleEditSubmit = () => {
    if (!editForm.validate('edit')) return
    if (!user) return
    setLoading(true)
    const result = adminPortalUserService.updateBasicProfile(user.id, editForm.formData)
    setLoading(false)
    if (!result) return
    if ('error' in result) {
      showToast({
        title: 'Could not update user',
        description: 'A user with this email already exists.',
        variant: 'error',
      })
      return
    }
    showToast({ title: 'User updated', variant: 'success' })
    navigate(`/admin/access/users/${user.id}`)
  }

  if (isCreateBasic) {
    return (
      <AdminFullPageFormShell
        breadcrumbs={breadcrumbs}
        title="Add user"
        description="Enter basic profile details. Permissions are configured in the next step."
        headerActions={
          <AdminFullPageFormHeaderSave
            loading={loading}
            label="Save & Continue"
            onClick={handleSaveAndContinue}
          />
        }
        footer={
          <AdminFullPageFormFooter
            loading={loading}
            onCancel={() => navigate(cancelHref)}
            onSave={handleSaveAndContinue}
            saveLabel="Save & Continue"
          />
        }
        sections={[
          {
            id: 'basic',
            title: 'Basic information',
            description: 'User profile, team assignment, and status',
            span: 2,
            columns: 1,
            children: (
              <UserFormFields
                formData={basicForm.formData}
                onChange={basicForm.setFormData}
                errors={basicForm.errors}
              />
            ),
          },
        ]}
      />
    )
  }

  return (
    <AdminFullPageFormShell
      breadcrumbs={breadcrumbs}
      title="Edit user"
      footer={
        <AdminFullPageFormFooter
          loading={loading}
          onCancel={() => navigate(cancelHref)}
          onSave={handleEditSubmit}
        />
      }
      sections={[
        {
          id: 'basic',
          title: 'Basic information',
          description: 'User profile, team assignment, and status',
          span: 2,
          columns: 1,
          children: (
            <UserFormFields
              formData={editForm.formData}
              onChange={(next) => editForm.setFormData({ ...editForm.formData, ...next })}
              errors={editForm.errors}
            />
          ),
        },
        {
          id: 'security',
          title: 'Security',
          description: 'Password setup and login access',
          importance: 'secondary',
          span: 2,
          columns: 1,
          children: (
            <UserSecurityFields
              formData={editForm.formData}
              onChange={editForm.setFormData}
              errors={editForm.errors}
              mode="edit"
            />
          ),
        },
      ]}
    />
  )
}

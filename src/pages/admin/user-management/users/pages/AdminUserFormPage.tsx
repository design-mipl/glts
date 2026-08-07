import { useEffect, useState } from 'react'
import { Box, Divider, Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { BaseCard, useToast } from '@/design-system/UIComponents'
import type { BreadcrumbItem } from '@/design-system/UIComponents'
import {
  AdminFullPageFormFooter,
  AdminFullPageFormHeaderSave,
} from '@/pages/admin/components/AdminFullPageFormFooter'
import { ADMIN_FULL_PAGE_FORM_LAYOUT } from '@/pages/admin/components/adminFullPageFormLayout'
import { AdminOverlayFormSection } from '@/pages/admin/components/AdminOverlayFormSection'
import { AdminRecordPageChrome } from '@/pages/admin/components/AdminRecordPageChrome'
import {
  ADMIN_RECORD_PAGE_TITLE_SX,
  ADMIN_RECORD_PAGE_TITLE_VARIANT,
} from '@/pages/admin/components/adminRecordPageTitle'
import { adminPortalUserService } from '@/shared/services/adminPortalUserService'
import type { AdminPortalUser, AdminPortalUserBasicFormData } from '@/shared/types/adminPortalUser'
import {
  createEmptyPermissions,
  superAdminFullPermissions,
} from '@/shared/utils/adminPermissionEngine'
import { UserFormFields } from '../components/UserFormFields'
import { UserPermissionAccordion } from '../components/UserPermissionAccordion'
import { UserSecurityFields } from '../components/UserSecurityFields'
import {
  AdminPortalUserToFormData,
  INITIAL_ADMIN_USER_FORM,
  useAdminPortalUserForm,
} from '../hooks/useAdminUserForm'

interface AdminPortalUserFormPageProps {
  mode: 'create' | 'edit'
  user?: AdminPortalUser
  breadcrumbs: BreadcrumbItem[]
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
  const { formData, setFormData, errors, validate, reset } = useAdminPortalUserForm()
  const [loading, setLoading] = useState(false)

  const isCreate = mode === 'create'
  const isPermissionsReadOnly = formData.userType === 'super_admin'

  useEffect(() => {
    if (mode === 'edit' && user) {
      reset(AdminPortalUserToFormData(user))
    } else if (mode === 'create') {
      reset(INITIAL_ADMIN_USER_FORM)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, user?.id])

  const handleBasicChange = (next: AdminPortalUserBasicFormData) => {
    const userTypeChanged = next.userType !== formData.userType

    let permissions = formData.permissions
    if (next.userType === 'super_admin') {
      permissions = createEmptyPermissions()
    } else if (userTypeChanged && formData.userType === 'super_admin') {
      permissions = createEmptyPermissions()
    }

    setFormData({
      ...formData,
      ...next,
      permissions,
    })
  }

  const handleSave = () => {
    if (!validate(isCreate ? 'create' : 'edit')) return
    setLoading(true)

    if (isCreate) {
      const result = adminPortalUserService.create(formData)
      setLoading(false)
      if (result && 'error' in result) {
        showToast({
          title: 'Could not create user',
          description:
            result.error === 'duplicate_email'
              ? 'A user with this email already exists.'
              : 'Could not create this user.',
          variant: 'error',
        })
        return
      }
      showToast({ title: 'User created', variant: 'success' })
      navigate(`/admin/user-management/users/${result.id}`)
      return
    }

    if (!user) return
    const result = adminPortalUserService.update(user.id, formData)
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
    navigate(`/admin/user-management/users/${user.id}`)
  }

  const { shellPaddingX, stickyFooterZIndex, pageStackGap } = ADMIN_FULL_PAGE_FORM_LAYOUT
  const saveLabel = isCreate ? 'Create user' : 'Save user'

  return (
    <AdminRecordPageChrome breadcrumbs={breadcrumbs}>
      <Stack spacing={pageStackGap}>
        <BaseCard sx={{ overflow: 'visible' }}>
          <Box sx={{ px: shellPaddingX, pt: shellPaddingX, pb: 0 }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              alignItems={{ xs: 'stretch', sm: 'flex-start' }}
              justifyContent="space-between"
              spacing={1.5}
            >
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  variant={ADMIN_RECORD_PAGE_TITLE_VARIANT}
                  component="h1"
                  fontWeight={700}
                  color="text.primary"
                  sx={ADMIN_RECORD_PAGE_TITLE_SX}
                >
                  {isCreate ? 'Add user' : 'Edit user'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, maxWidth: 720 }}>
                  {isCreate
                    ? 'Enter profile details and set module permissions in one step.'
                    : 'Update profile details and module permissions.'}
                </Typography>
              </Box>
              <Box
                sx={{
                  flexShrink: 0,
                  width: { xs: '100%', sm: 'auto' },
                  display: 'flex',
                  alignItems: 'center',
                  alignSelf: { xs: 'stretch', sm: 'center' },
                }}
              >
                <AdminFullPageFormHeaderSave
                  loading={loading}
                  label={saveLabel}
                  onClick={handleSave}
                />
              </Box>
            </Stack>
            <Divider sx={{ mt: 2, mb: 2.5 }} />
          </Box>

          <Box sx={{ px: shellPaddingX, pb: 2.5 }}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  lg: 'minmax(320px, 0.9fr) minmax(0, 1.35fr)',
                },
                gap: pageStackGap,
                alignItems: 'start',
              }}
            >
              <Stack spacing={pageStackGap} sx={{ minWidth: 0 }}>
                <AdminOverlayFormSection
                  title="Basic information"
                  description="User profile, team assignment, and status"
                  importance="primary"
                  columns={1}
                  fieldColumnsFrom="xs"
                >
                  <UserFormFields
                    formData={formData}
                    onChange={handleBasicChange}
                    errors={errors}
                  />
                </AdminOverlayFormSection>

                {!isCreate ? (
                  <AdminOverlayFormSection
                    title="Security"
                    description="Password setup and login access"
                    importance="secondary"
                    columns={1}
                    fieldColumnsFrom="xs"
                  >
                    <UserSecurityFields
                      formData={formData}
                      onChange={setFormData}
                      errors={errors}
                      mode="edit"
                    />
                  </AdminOverlayFormSection>
                ) : null}
              </Stack>

              <AdminOverlayFormSection
                title="Configure permissions"
                importance="primary"
                columns={1}
                fieldColumnsFrom="xs"
              >
                {isPermissionsReadOnly ? (
                  <Typography variant="body2" color="text.secondary">
                    Super Admin has full access to all modules. Permissions cannot be edited for
                    this account.
                  </Typography>
                ) : null}
                <Box sx={{ gridColumn: '1 / -1', minWidth: 0 }}>
                  <UserPermissionAccordion
                    permissions={
                      isPermissionsReadOnly ? superAdminFullPermissions() : formData.permissions
                    }
                    onChange={(permissions) => setFormData({ ...formData, permissions })}
                    readOnly={isPermissionsReadOnly}
                  />
                </Box>
              </AdminOverlayFormSection>
            </Box>
          </Box>

          <Box
            sx={{
              position: 'sticky',
              bottom: 0,
              zIndex: stickyFooterZIndex,
              flexShrink: 0,
              px: shellPaddingX,
              py: 2,
              bgcolor: 'background.paper',
              borderTop: 1,
              borderColor: 'divider',
            }}
          >
            <AdminFullPageFormFooter
              loading={loading}
              onCancel={() => navigate(cancelHref)}
              onSave={handleSave}
              saveLabel={saveLabel}
            />
          </Box>
        </BaseCard>
      </Stack>
    </AdminRecordPageChrome>
  )
}

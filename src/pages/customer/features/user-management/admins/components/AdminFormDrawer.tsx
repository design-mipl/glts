import { useEffect } from 'react'
import { AdminDrawerFormShell } from '@/pages/admin/components/AdminDrawerFormShell'
import { AdminFullPageFormFooter } from '@/pages/admin/components/AdminFullPageFormFooter'
import { ADMIN_DRAWER_FORM_LAYOUT } from '@/pages/admin/components/adminOverlayFormLayout'
import { adminManagementService } from '@/shared/services/adminManagementService'
import type { AdminUser } from '@/shared/types/adminUser'
import { AdminFormFields } from './AdminFormFields'
import { adminUserToFormData, useAdminForm } from '../hooks/useAdminForm'

export interface AdminFormDrawerProps {
  open: boolean
  onClose: () => void
  initial?: AdminUser
  onSaved?: (record: AdminUser) => void
}

export function AdminFormDrawer({ open, onClose, initial, onSaved }: AdminFormDrawerProps) {
  const { formData, errors, update, reset, validate } = useAdminForm(initial?.id)

  useEffect(() => {
    if (open) {
      reset(initial ? adminUserToFormData(initial) : undefined)
    }
  }, [open, initial, reset])

  const handleSave = () => {
    if (!validate()) return
    const record = initial
      ? adminManagementService.update(initial.id, formData)
      : adminManagementService.create(formData)
    if (record) {
      onSaved?.(record)
      onClose()
    }
  }

  const fieldProps = { formData, errors, onUpdate: update }

  return (
    <AdminDrawerFormShell
      open={open}
      onClose={onClose}
      title={initial ? 'Edit admin' : 'Add admin'}
      width={ADMIN_DRAWER_FORM_LAYOUT.recommendedWidth}
      footer={
        <AdminFullPageFormFooter
          onCancel={onClose}
          onSave={handleSave}
          saveLabel={initial ? 'Save changes' : 'Create admin'}
        />
      }
      sections={[
        {
          id: 'primary',
          title: 'Basic details',
          description: 'Identity and contact information',
          columns: ADMIN_DRAWER_FORM_LAYOUT.primarySectionColumns,
          children: <AdminFormFields variant="primary" {...fieldProps} />,
        },
        {
          id: 'access',
          title: 'Access details',
          description: 'Role and account status',
          importance: 'secondary',
          columns: ADMIN_DRAWER_FORM_LAYOUT.secondarySectionColumns,
          children: <AdminFormFields variant="access" {...fieldProps} />,
        },
        {
          id: 'notes',
          title: 'Notes',
          description: 'Optional supplemental information',
          importance: 'secondary',
          columns: ADMIN_DRAWER_FORM_LAYOUT.secondarySectionColumns,
          children: <AdminFormFields variant="notes" {...fieldProps} />,
        },
      ]}
    />
  )
}

import { useEffect } from 'react'
import { AdminDrawerFormShell } from '@/pages/admin/components/AdminDrawerFormShell'
import { AdminFullPageFormFooter } from '@/pages/admin/components/AdminFullPageFormFooter'
import { ADMIN_DRAWER_FORM_LAYOUT } from '@/pages/admin/components/adminOverlayFormLayout'
import { bookerManagementService } from '@/shared/services/bookerManagementService'
import type { BookerUser } from '@/shared/types/bookerUser'
import { BookerFormFields } from './BookerFormFields'
import { bookerUserToFormData, useBookerForm } from '../hooks/useBookerForm'

export interface BookerFormDrawerProps {
  open: boolean
  onClose: () => void
  initial?: BookerUser
  onSaved?: (record: BookerUser) => void
}

export function BookerFormDrawer({ open, onClose, initial, onSaved }: BookerFormDrawerProps) {
  const { formData, errors, update, reset, validate } = useBookerForm(initial?.id)

  useEffect(() => {
    if (open) {
      reset(initial ? bookerUserToFormData(initial) : undefined)
    }
  }, [open, initial, reset])

  const handleSave = () => {
    if (!validate()) return
    const record = initial
      ? bookerManagementService.update(initial.id, formData)
      : bookerManagementService.create(formData)
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
      title={initial ? 'Edit booker' : 'Add booker'}
      width={ADMIN_DRAWER_FORM_LAYOUT.recommendedWidth}
      footer={
        <AdminFullPageFormFooter
          onCancel={onClose}
          onSave={handleSave}
          saveLabel={initial ? 'Save changes' : 'Create booker'}
        />
      }
      sections={[
        {
          id: 'primary',
          title: 'Basic details',
          description: 'Identity and contact information',
          columns: ADMIN_DRAWER_FORM_LAYOUT.primarySectionColumns,
          children: <BookerFormFields variant="primary" {...fieldProps} />,
        },
        {
          id: 'access',
          title: 'Access details',
          description: 'Role and account status',
          importance: 'secondary',
          columns: ADMIN_DRAWER_FORM_LAYOUT.secondarySectionColumns,
          children: <BookerFormFields variant="access" {...fieldProps} />,
        },
        {
          id: 'notes',
          title: 'Notes',
          description: 'Optional supplemental information',
          importance: 'secondary',
          columns: ADMIN_DRAWER_FORM_LAYOUT.secondarySectionColumns,
          children: <BookerFormFields variant="notes" {...fieldProps} />,
        },
      ]}
    />
  )
}

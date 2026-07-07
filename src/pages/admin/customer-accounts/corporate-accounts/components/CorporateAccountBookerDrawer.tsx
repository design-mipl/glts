import { useEffect } from 'react'
import { AdminDrawerFormShell } from '@/pages/admin/components/AdminDrawerFormShell'
import { AdminFullPageFormFooter } from '@/pages/admin/components/AdminFullPageFormFooter'
import { ADMIN_DRAWER_FORM_LAYOUT } from '@/pages/admin/components/adminOverlayFormLayout'
import { BookerFormFields } from '@/pages/customer/features/user-management/bookers/components/BookerFormFields'
import { bookerUserToFormData, useBookerForm } from '@/pages/customer/features/user-management/bookers/hooks/useBookerForm'
import { bookerManagementService } from '@/shared/services/bookerManagementService'
import type { BookerUser } from '@/shared/types/bookerUser'

const ADMIN_ACTOR = 'Admin User'
const ADMIN_ACTOR_ID = 'admin-portal-user'

export interface CorporateAccountBookerDrawerProps {
  open: boolean
  onClose: () => void
  corporateAccountId?: string
  companyName: string
  initial?: BookerUser
  onSaved?: (record: BookerUser) => void
}

export function CorporateAccountBookerDrawer({
  open,
  onClose,
  corporateAccountId,
  companyName,
  initial,
  onSaved,
}: CorporateAccountBookerDrawerProps) {
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
      : bookerManagementService.create(formData, {
          corporateAccountId,
          companyName,
          createdBy: ADMIN_ACTOR,
          createdById: ADMIN_ACTOR_ID,
        })
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

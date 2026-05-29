import { useEffect } from 'react'
import { AdminDrawerFormShell } from '@/pages/admin/components/AdminDrawerFormShell'
import { AdminFullPageFormFooter } from '@/pages/admin/components/AdminFullPageFormFooter'
import { ADMIN_DRAWER_FORM_LAYOUT } from '@/pages/admin/components/adminOverlayFormLayout'
import { EntityFormFields } from '@/pages/customer/features/masters/entities/components/EntityFormFields'
import { entityMasterToFormData, useEntityForm } from '@/pages/customer/features/masters/entities/hooks/useEntityForm'
import { entityMasterService } from '@/shared/services/entityMasterService'
import type { EntityMaster } from '@/shared/types/entityMaster'

export interface CorporateAccountEntityDrawerProps {
  open: boolean
  onClose: () => void
  corporateAccountId?: string
  initial?: EntityMaster
  onSaved?: (record: EntityMaster) => void
}

export function CorporateAccountEntityDrawer({
  open,
  onClose,
  corporateAccountId,
  initial,
  onSaved,
}: CorporateAccountEntityDrawerProps) {
  const { formData, errors, update, reset, validate, countryOptions } = useEntityForm()

  useEffect(() => {
    if (open) reset(initial ? entityMasterToFormData(initial) : undefined)
  }, [open, initial, reset])

  const handleSave = () => {
    if (!validate()) return
    const record = initial
      ? entityMasterService.update(initial.id, formData)
      : entityMasterService.create(formData, corporateAccountId)
    if (record) {
      onSaved?.(record)
      onClose()
    }
  }

  const fieldProps = { formData, errors, countryOptions, onUpdate: update }

  return (
    <AdminDrawerFormShell
      open={open}
      onClose={onClose}
      title={initial ? 'Edit entity' : 'Add entity'}
      width={ADMIN_DRAWER_FORM_LAYOUT.recommendedWidth}
      footer={<AdminFullPageFormFooter onCancel={onClose} onSave={handleSave} saveLabel={initial ? 'Save changes' : 'Create entity'} />}
      sections={[
        {
          id: 'primary',
          title: 'Entity details',
          columns: ADMIN_DRAWER_FORM_LAYOUT.primarySectionColumns,
          children: <EntityFormFields variant="primary" {...fieldProps} />,
        },
        {
          id: 'secondary',
          title: 'Additional details',
          importance: 'secondary',
          columns: ADMIN_DRAWER_FORM_LAYOUT.secondarySectionColumns,
          children: <EntityFormFields variant="secondary" {...fieldProps} />,
        },
      ]}
    />
  )
}

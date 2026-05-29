import { useEffect } from 'react'
import { AdminDrawerFormShell } from '@/pages/admin/components/AdminDrawerFormShell'
import { AdminFullPageFormFooter } from '@/pages/admin/components/AdminFullPageFormFooter'
import { ADMIN_DRAWER_FORM_LAYOUT } from '@/pages/admin/components/adminOverlayFormLayout'
import { entityMasterService } from '@/shared/services/entityMasterService'
import type { EntityMaster } from '@/shared/types/entityMaster'
import { EntityFormFields } from './EntityFormFields'
import { entityMasterToFormData, useEntityForm } from '../hooks/useEntityForm'

export interface EntityFormDrawerProps {
  open: boolean
  onClose: () => void
  initial?: EntityMaster
  onSaved?: (record: EntityMaster) => void
}

export function EntityFormDrawer({ open, onClose, initial, onSaved }: EntityFormDrawerProps) {
  const { formData, errors, update, reset, validate, countryOptions } = useEntityForm()

  useEffect(() => {
    if (open) {
      reset(initial ? entityMasterToFormData(initial) : undefined)
    }
  }, [open, initial, reset])

  const handleSave = () => {
    if (!validate()) return
    const record = initial
      ? entityMasterService.update(initial.id, formData)
      : entityMasterService.create(formData)
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
      footer={
        <AdminFullPageFormFooter
          onCancel={onClose}
          onSave={handleSave}
          saveLabel={initial ? 'Save changes' : 'Create entity'}
        />
      }
      sections={[
        {
          id: 'primary',
          title: 'Entity details',
          description: 'Core identity and contact information',
          columns: ADMIN_DRAWER_FORM_LAYOUT.primarySectionColumns,
          children: <EntityFormFields variant="primary" {...fieldProps} />,
        },
        {
          id: 'secondary',
          title: 'Additional details',
          description: 'Address and notes',
          importance: 'secondary',
          columns: ADMIN_DRAWER_FORM_LAYOUT.secondarySectionColumns,
          children: <EntityFormFields variant="secondary" {...fieldProps} />,
        },
      ]}
    />
  )
}

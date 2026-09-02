import { useEffect, useState } from 'react'
import { useToast } from '@/design-system/UIComponents'
import { AdminDrawerFormShell } from '@/pages/admin/components/AdminDrawerFormShell'
import { AdminFullPageFormFooter } from '@/pages/admin/components/AdminFullPageFormFooter'
import { ADMIN_DRAWER_FORM_LAYOUT } from '@/pages/admin/components/adminOverlayFormLayout'
import { organizationLocationMasterService } from '@/shared/services/organizationLocationMasterService'
import type { OrganizationLocationMaster } from '@/shared/types/organizationLocationMaster'
import {
  INITIAL_ORGANIZATION_LOCATION_FORM,
  organizationLocationToFormData,
  useOrganizationLocationForm,
} from '../hooks/useOrganizationLocationForm'
import { OrganizationLocationFormFields } from './OrganizationLocationFormFields'

interface OrganizationLocationFormDrawerProps {
  open: boolean
  record?: OrganizationLocationMaster | null
  onClose: () => void
  onSaved: () => void
}

export function OrganizationLocationFormDrawer({
  open,
  record,
  onClose,
  onSaved,
}: OrganizationLocationFormDrawerProps) {
  const { showToast } = useToast()
  const { formData, setFormData, errors, validate, reset } = useOrganizationLocationForm()
  const [loading, setLoading] = useState(false)
  const isEdit = Boolean(record)

  useEffect(() => {
    if (open) {
      reset(record ? organizationLocationToFormData(record) : INITIAL_ORGANIZATION_LOCATION_FORM)
    }
  }, [open, record, reset])

  const handleClose = () => {
    if (loading) return
    onClose()
  }

  const handleSubmit = () => {
    if (!validate()) return
    setLoading(true)
    const result =
      isEdit && record
        ? organizationLocationMasterService.update(record.id, formData)
        : organizationLocationMasterService.create(formData)
    setLoading(false)
    if (result && 'error' in result && result.error === 'duplicate_name') {
      showToast({
        title: 'Duplicate name',
        description: 'An organization or location with this name already exists.',
        variant: 'error',
      })
      return
    }
    showToast({
      title: isEdit ? 'Location updated' : 'Location added',
      variant: 'success',
    })
    onSaved()
    onClose()
  }

  const fieldProps = { formData, onChange: setFormData, errors }

  return (
    <AdminDrawerFormShell
      open={open}
      onClose={handleClose}
      title={isEdit ? 'Edit organization & location' : 'Add organization & location'}
      subtitle="GLTS branches and partner locations used across operations"
      footer={
        <AdminFullPageFormFooter
          loading={loading}
          onCancel={handleClose}
          onSave={handleSubmit}
        />
      }
      sections={[
        {
          id: 'organization',
          title: 'Organization',
          description: 'Type and contact details',
          columns: ADMIN_DRAWER_FORM_LAYOUT.primarySectionColumns,
          children: <OrganizationLocationFormFields {...fieldProps} section="organization" />,
        },
        {
          id: 'address',
          title: 'Address',
          description: 'Registered location',
          columns: ADMIN_DRAWER_FORM_LAYOUT.primarySectionColumns,
          children: <OrganizationLocationFormFields {...fieldProps} section="address" />,
        },
      ]}
    />
  )
}

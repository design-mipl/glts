import { useEffect, useState } from 'react'
import { useToast } from '@/design-system/UIComponents'
import { AdminDrawerFormShell } from '@/pages/admin/components/AdminDrawerFormShell'
import { AdminFullPageFormFooter } from '@/pages/admin/components/AdminFullPageFormFooter'
import { ADMIN_DRAWER_FORM_LAYOUT } from '@/pages/admin/components/adminOverlayFormLayout'
import { serviceMasterService } from '@/shared/services/serviceMasterService'
import type { ServiceMaster } from '@/shared/types/serviceMaster'
import {
  INITIAL_SERVICE_FORM,
  serviceToFormData,
  useServiceForm,
} from '../hooks/useServiceForm'
import { ServiceFormFields } from './ServiceFormFields'

interface ServiceFormDrawerProps {
  open: boolean
  record?: ServiceMaster | null
  onClose: () => void
  onSaved: () => void
}

export function ServiceFormDrawer({ open, record, onClose, onSaved }: ServiceFormDrawerProps) {
  const { showToast } = useToast()
  const { formData, setFormData, errors, validate, reset } = useServiceForm()
  const [loading, setLoading] = useState(false)
  const isEdit = Boolean(record)

  useEffect(() => {
    if (open) {
      reset(record ? serviceToFormData(record) : INITIAL_SERVICE_FORM)
    }
  }, [open, record?.id, reset])

  const handleClose = () => {
    if (loading) return
    onClose()
  }

  const handleSubmit = () => {
    if (!validate()) return
    setLoading(true)
    const result =
      isEdit && record
        ? serviceMasterService.update(record.id, formData)
        : serviceMasterService.create(formData)
    setLoading(false)
    if (!result) return
    showToast({
      title: isEdit ? 'Fee updated' : 'Fee added',
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
      title={isEdit ? 'Edit fee' : 'Add fee'}
      subtitle="GLTS fees used in quotations, invoices, and billing"
      footer={
        <AdminFullPageFormFooter
          loading={loading}
          onCancel={handleClose}
          onSave={handleSubmit}
        />
      }
      sections={[
        {
          id: 'basic',
          title: 'Basic information',
          columns: ADMIN_DRAWER_FORM_LAYOUT.primarySectionColumns,
          children: <ServiceFormFields {...fieldProps} section="basic" />,
        },
        {
          id: 'pricingTax',
          title: 'Pricing & tax mapping',
          columns: ADMIN_DRAWER_FORM_LAYOUT.primarySectionColumns,
          children: <ServiceFormFields {...fieldProps} section="pricingTax" />,
        },
        {
          id: 'applicability',
          title: 'Applicability',
          importance: 'secondary',
          columns: ADMIN_DRAWER_FORM_LAYOUT.secondarySectionColumns,
          children: <ServiceFormFields {...fieldProps} section="applicability" />,
        },
        {
          id: 'status',
          title: 'Status',
          importance: 'secondary',
          columns: ADMIN_DRAWER_FORM_LAYOUT.secondarySectionColumns,
          children: <ServiceFormFields {...fieldProps} section="status" />,
        },
      ]}
    />
  )
}

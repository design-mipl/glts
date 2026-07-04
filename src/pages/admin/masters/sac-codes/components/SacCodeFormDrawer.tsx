import { useEffect, useState } from 'react'
import { useToast } from '@/design-system/UIComponents'
import { AdminDrawerFormShell } from '@/pages/admin/components/AdminDrawerFormShell'
import { AdminFullPageFormFooter } from '@/pages/admin/components/AdminFullPageFormFooter'
import { ADMIN_DRAWER_FORM_LAYOUT } from '@/pages/admin/components/adminOverlayFormLayout'
import { sacCodeMasterService } from '@/shared/services/sacCodeMasterService'
import type { SacCodeMaster } from '@/shared/types/sacCodeMaster'
import {
  INITIAL_SAC_CODE_FORM,
  sacCodeToFormData,
  useSacCodeForm,
} from '../hooks/useSacCodeForm'
import { SacCodeFormFields } from './SacCodeFormFields'

interface SacCodeFormDrawerProps {
  open: boolean
  record?: SacCodeMaster | null
  onClose: () => void
  onSaved: () => void
}

export function SacCodeFormDrawer({ open, record, onClose, onSaved }: SacCodeFormDrawerProps) {
  const { showToast } = useToast()
  const { formData, setFormData, errors, validate, reset } = useSacCodeForm()
  const [loading, setLoading] = useState(false)
  const isEdit = Boolean(record)

  useEffect(() => {
    if (open) {
      reset(record ? sacCodeToFormData(record) : INITIAL_SAC_CODE_FORM)
    }
  }, [open, record?.id, reset])

  const handleClose = () => {
    if (loading) return
    onClose()
  }

  const handleSubmit = () => {
    if (!validate()) return
    if (sacCodeMasterService.getBySacCode(formData.sacCode, record?.id)) {
      showToast({
        title: 'Duplicate SAC code',
        description: 'A SAC code with this value already exists.',
        variant: 'error',
      })
      return
    }
    setLoading(true)
    if (isEdit && record) {
      sacCodeMasterService.update(record.id, formData)
      showToast({ title: 'SAC code updated', variant: 'success' })
    } else {
      sacCodeMasterService.create(formData)
      showToast({ title: 'SAC code added', variant: 'success' })
    }
    setLoading(false)
    onSaved()
    onClose()
  }

  const fieldProps = { formData, onChange: setFormData, errors }

  return (
    <AdminDrawerFormShell
      open={open}
      onClose={handleClose}
      title={isEdit ? 'Edit SAC code' : 'Add SAC code'}
      subtitle="Service classification codes and default tax mapping"
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
          title: 'Basic details',
          description: 'SAC identification and category',
          columns: ADMIN_DRAWER_FORM_LAYOUT.primarySectionColumns,
          children: <SacCodeFormFields {...fieldProps} section="basic" />,
        },
        {
          id: 'tax',
          title: 'Tax configuration',
          description: 'Default GST and TDS mapping',
          columns: ADMIN_DRAWER_FORM_LAYOUT.primarySectionColumns,
          children: <SacCodeFormFields {...fieldProps} section="tax" />,
        },
        {
          id: 'applicability',
          title: 'Applicability',
          description: 'Segments this SAC applies to',
          columns: ADMIN_DRAWER_FORM_LAYOUT.secondarySectionColumns,
          importance: 'secondary',
          children: <SacCodeFormFields {...fieldProps} section="applicability" />,
        },
        {
          id: 'status',
          title: 'Status',
          columns: ADMIN_DRAWER_FORM_LAYOUT.secondarySectionColumns,
          importance: 'secondary',
          children: <SacCodeFormFields {...fieldProps} section="status" />,
        },
      ]}
    />
  )
}

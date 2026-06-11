import { useEffect, useState } from 'react'
import { FormSection, Modal, useToast } from '@/design-system/UIComponents'
import { AdminFullPageFormFooter } from '@/pages/admin/components/AdminFullPageFormFooter'
import { ADMIN_MODAL_FORM_LAYOUT } from '@/pages/admin/components/adminOverlayFormLayout'
import { jurisdictionMasterService } from '@/shared/services/jurisdictionMasterService'
import type { JurisdictionMaster } from '@/shared/types/jurisdictionMaster'
import {
  INITIAL_JURISDICTION_FORM,
  jurisdictionToFormData,
  useJurisdictionForm,
} from '../hooks/useJurisdictionForm'
import { JurisdictionFormFields } from './JurisdictionFormFields'

interface JurisdictionFormModalProps {
  open: boolean
  record?: JurisdictionMaster | null
  onClose: () => void
  onSaved: () => void
}

export function JurisdictionFormModal({
  open,
  record,
  onClose,
  onSaved,
}: JurisdictionFormModalProps) {
  const { showToast } = useToast()
  const { formData, setFormData, errors, validate, reset } = useJurisdictionForm()
  const [loading, setLoading] = useState(false)
  const isEdit = Boolean(record)

  useEffect(() => {
    if (open) {
      reset(record ? jurisdictionToFormData(record) : INITIAL_JURISDICTION_FORM)
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
        ? jurisdictionMasterService.update(record.id, formData)
        : jurisdictionMasterService.create(formData)
    setLoading(false)
    if (result && 'error' in result && result.error === 'duplicate_name') {
      showToast({
        title: 'Duplicate jurisdiction name',
        description: 'A jurisdiction with this name already exists.',
        variant: 'error',
      })
      return
    }
    showToast({
      title: isEdit ? 'Jurisdiction updated' : 'Jurisdiction added',
      variant: 'success',
    })
    onSaved()
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={isEdit ? 'Edit jurisdiction' : 'Add jurisdiction'}
      subtitle="Consulate and VFS processing jurisdictions"
      size={ADMIN_MODAL_FORM_LAYOUT.recommendedSize}
      footer={
        <AdminFullPageFormFooter
          loading={loading}
          onCancel={handleClose}
          onSave={handleSubmit}
        />
      }
    >
      <FormSection columns={ADMIN_MODAL_FORM_LAYOUT.fieldColumns}>
        <JurisdictionFormFields formData={formData} onChange={setFormData} errors={errors} />
      </FormSection>
    </Modal>
  )
}

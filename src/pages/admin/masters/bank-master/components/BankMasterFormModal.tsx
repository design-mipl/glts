import { useEffect, useState } from 'react'
import { FormSection, Modal, useToast } from '@/design-system/UIComponents'
import { AdminFullPageFormFooter } from '@/pages/admin/components/AdminFullPageFormFooter'
import { ADMIN_MODAL_FORM_LAYOUT } from '@/pages/admin/components/adminOverlayFormLayout'
import { bankMasterService } from '@/shared/services/bankMasterService'
import type { BankMaster } from '@/shared/types/bankMaster'
import {
  bankMasterToFormData,
  INITIAL_BANK_MASTER_FORM,
  useBankMasterForm,
} from '../hooks/useBankMasterForm'
import { BankMasterFormFields } from './BankMasterFormFields'

interface BankMasterFormModalProps {
  open: boolean
  record?: BankMaster | null
  onClose: () => void
  onSaved: () => void
}

export function BankMasterFormModal({
  open,
  record,
  onClose,
  onSaved,
}: BankMasterFormModalProps) {
  const { showToast } = useToast()
  const { formData, setFormData, errors, validate, reset } = useBankMasterForm()
  const [loading, setLoading] = useState(false)
  const isEdit = Boolean(record)

  useEffect(() => {
    if (open) {
      reset(record ? bankMasterToFormData(record) : INITIAL_BANK_MASTER_FORM)
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
        ? bankMasterService.update(record.id, formData)
        : bankMasterService.create(formData)
    setLoading(false)
    if (result && 'error' in result && result.error === 'duplicate_name') {
      showToast({
        title: 'Duplicate bank name',
        description: 'A bank with this name already exists.',
        variant: 'error',
      })
      return
    }
    showToast({
      title: isEdit ? 'Bank updated' : 'Bank added',
      variant: 'success',
    })
    onSaved()
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={isEdit ? 'Edit bank' : 'Add bank'}
      subtitle="Manage banks used across operations and fund allocation"
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
        <BankMasterFormFields formData={formData} onChange={setFormData} errors={errors} />
      </FormSection>
    </Modal>
  )
}

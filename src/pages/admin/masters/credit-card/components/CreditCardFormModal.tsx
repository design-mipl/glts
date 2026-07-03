import { useEffect, useState } from 'react'
import { FormSection, Modal, useToast } from '@/design-system/UIComponents'
import { AdminFullPageFormFooter } from '@/pages/admin/components/AdminFullPageFormFooter'
import { ADMIN_MODAL_FORM_LAYOUT } from '@/pages/admin/components/adminOverlayFormLayout'
import { creditCardMasterService } from '@/shared/services/creditCardMasterService'
import type { CreditCardMaster } from '@/shared/types/creditCardMaster'
import {
  creditCardToFormData,
  INITIAL_CREDIT_CARD_FORM,
  useCreditCardForm,
} from '../hooks/useCreditCardForm'
import { CreditCardFormFields } from './CreditCardFormFields'

interface CreditCardFormModalProps {
  open: boolean
  record?: CreditCardMaster | null
  onClose: () => void
  onSaved: () => void
}

export function CreditCardFormModal({
  open,
  record,
  onClose,
  onSaved,
}: CreditCardFormModalProps) {
  const { showToast } = useToast()
  const { formData, setFormData, errors, validate, reset } = useCreditCardForm()
  const [loading, setLoading] = useState(false)
  const isEdit = Boolean(record)

  useEffect(() => {
    if (open) {
      reset(record ? creditCardToFormData(record) : INITIAL_CREDIT_CARD_FORM)
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
        ? creditCardMasterService.update(record.id, formData)
        : creditCardMasterService.create(formData)
    setLoading(false)
    if (result && 'error' in result && result.error === 'duplicate_name') {
      showToast({
        title: 'Duplicate card name',
        description: 'A credit card with this name already exists.',
        variant: 'error',
      })
      return
    }
    showToast({
      title: isEdit ? 'Credit card updated' : 'Credit card added',
      variant: 'success',
    })
    onSaved()
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={isEdit ? 'Edit credit card' : 'Add credit card'}
      subtitle="Manage accepted credit card types for payments"
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
        <CreditCardFormFields formData={formData} onChange={setFormData} errors={errors} />
      </FormSection>
    </Modal>
  )
}

import { useEffect, useState } from 'react'
import { FormSection, Modal, useToast } from '@/design-system/UIComponents'
import { AdminFullPageFormFooter } from '@/pages/admin/components/AdminFullPageFormFooter'
import { ADMIN_MODAL_FORM_LAYOUT } from '@/pages/admin/components/adminOverlayFormLayout'
import { cardMasterService } from '@/shared/services/cardMasterService'
import type { CardMaster } from '@/shared/types/cardMaster'
import {
  cardMasterToFormData,
  INITIAL_CARD_MASTER_FORM,
  useCardMasterForm,
} from '../hooks/useCardMasterForm'
import { CardMasterFormFields } from './CardMasterFormFields'

interface CardMasterFormModalProps {
  open: boolean
  record?: CardMaster | null
  onClose: () => void
  onSaved: () => void
}

export function CardMasterFormModal({
  open,
  record,
  onClose,
  onSaved,
}: CardMasterFormModalProps) {
  const { showToast } = useToast()
  const { formData, setFormData, errors, validate, reset } = useCardMasterForm()
  const [loading, setLoading] = useState(false)
  const isEdit = Boolean(record)

  useEffect(() => {
    if (open) {
      reset(record ? cardMasterToFormData(record) : INITIAL_CARD_MASTER_FORM)
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
        ? cardMasterService.update(record.id, formData)
        : cardMasterService.create(formData)
    setLoading(false)
    if (result && 'error' in result && result.error === 'duplicate_name') {
      showToast({
        title: 'Duplicate card name',
        description: 'A card with this name already exists.',
        variant: 'error',
      })
      return
    }
    showToast({
      title: isEdit ? 'Card updated' : 'Card added',
      variant: 'success',
    })
    onSaved()
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={isEdit ? 'Edit card' : 'Add card'}
      subtitle="Manage payment cards used across operations and fund allocation"
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
        <CardMasterFormFields formData={formData} onChange={setFormData} errors={errors} />
      </FormSection>
    </Modal>
  )
}

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Modal, useToast } from '@/design-system/UIComponents'
import { AdminFullPageFormFooter } from '@/pages/admin/components/AdminFullPageFormFooter'
import { ADMIN_MODAL_FORM_LAYOUT } from '@/pages/admin/components/adminOverlayFormLayout'
import { documentMasterService } from '@/shared/services/documentMasterService'
import { DocumentFormFields } from './DocumentFormFields'
import { INITIAL_DOCUMENT_FORM, useDocumentForm } from '../hooks/useDocumentForm'

interface CreateDocumentModalProps {
  open: boolean
  onClose: () => void
  onCreated?: () => void
}

export function CreateDocumentModal({ open, onClose, onCreated }: CreateDocumentModalProps) {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { formData, setFormData, errors, validate, reset } = useDocumentForm()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      reset(INITIAL_DOCUMENT_FORM)
    }
  }, [open, reset])

  const handleClose = () => {
    if (loading) return
    onClose()
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    const created = documentMasterService.create(formData)
    setLoading(false)
    showToast({ title: 'Document created', variant: 'success' })
    onCreated?.()
    onClose()
    navigate(`/admin/masters/documents/${created.id}`)
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Create Document"
      subtitle="Add a standard document type for country and visa checklists"
      size={ADMIN_MODAL_FORM_LAYOUT.recommendedSize}
      footer={
        <AdminFullPageFormFooter
          loading={loading}
          onCancel={handleClose}
          onSave={() => void handleSubmit()}
        />
      }
    >
      <DocumentFormFields
        variant="modal"
        formData={formData}
        onChange={setFormData}
        errors={errors}
      />
    </Modal>
  )
}

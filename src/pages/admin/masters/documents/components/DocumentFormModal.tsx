import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Modal, useToast } from '@/design-system/UIComponents'
import { AdminFullPageFormFooter } from '@/pages/admin/components/AdminFullPageFormFooter'
import { documentMasterService } from '@/shared/services/documentMasterService'
import type { DocumentMaster } from '@/shared/types/documentMaster'
import { normalizeRichTextForSave } from '@/shared/utils/richTextUtils'
import { DocumentFormFields } from './DocumentFormFields'
import {
  documentToFormData,
  INITIAL_DOCUMENT_FORM,
  useDocumentForm,
} from '../hooks/useDocumentForm'

interface DocumentFormModalProps {
  open: boolean
  record?: DocumentMaster | null
  onClose: () => void
  onSaved?: () => void
  /** When true, navigates to the new document detail page after create. */
  navigateToDetailOnCreate?: boolean
}

export function DocumentFormModal({
  open,
  record,
  onClose,
  onSaved,
  navigateToDetailOnCreate = true,
}: DocumentFormModalProps) {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { formData, setFormData, errors, validate, reset } = useDocumentForm()
  const [loading, setLoading] = useState(false)
  const isEdit = Boolean(record)

  useEffect(() => {
    if (open) {
      reset(record ? documentToFormData(record) : INITIAL_DOCUMENT_FORM)
    }
  }, [open, record, reset])

  const handleClose = () => {
    if (loading) return
    onClose()
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    const payload = {
      ...formData,
      description: normalizeRichTextForSave(formData.description),
    }

    if (isEdit && record) {
      const updated = documentMasterService.update(record.id, payload)
      setLoading(false)
      if (!updated) {
        showToast({ title: 'Document not found', variant: 'error' })
        return
      }
      showToast({ title: 'Document updated', variant: 'success' })
      onSaved?.()
      onClose()
      return
    }

    const created = documentMasterService.create(payload)
    setLoading(false)
    showToast({ title: 'Document created', variant: 'success' })
    onSaved?.()
    onClose()
    if (navigateToDetailOnCreate) {
      navigate(`/admin/masters/documents/${created.id}`)
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={isEdit ? 'Edit document' : 'Create Document'}
      subtitle={
        isEdit
          ? 'Update this document type used across country and visa checklists'
          : 'Add a standard document type for country and visa checklists'
      }
      size="lg"
      footer={
        <AdminFullPageFormFooter
          loading={loading}
          onCancel={handleClose}
          onSave={() => void handleSubmit()}
          saveLabel={isEdit ? 'Save' : undefined}
        />
      }
    >
      <DocumentFormFields
        variant="modal"
        formData={formData}
        onChange={setFormData}
        errors={errors}
        documentId={record?.id}
      />
    </Modal>
  )
}

import { useEffect, useState } from 'react'
import {
  FormField,
  FormSection,
  Input,
  Modal,
  MultiSelect,
  Select,
  Textarea,
  useToast,
} from '@/design-system/UIComponents'
import { AdminFullPageFormFooter } from '@/pages/admin/components/AdminFullPageFormFooter'
import { AdminFullPageFormFieldSpan } from '@/pages/admin/components/AdminFullPageFormShell'
import { ADMIN_MODAL_FORM_LAYOUT } from '@/pages/admin/components/adminOverlayFormLayout'
import { clientDocumentMasterService } from '@/shared/services/clientDocumentMasterService'
import type { ClientDocumentMaster } from '@/shared/types/clientDocumentMaster'
import { MASTER_APPLICABILITY_OPTIONS } from '@/shared/types/masterCommon'
import { masterStatusLabel } from '../../config/masterStatusConfig'
import {
  clientDocumentToFormData,
  INITIAL_CLIENT_DOCUMENT_FORM,
  useClientDocumentForm,
} from '../hooks/useClientDocumentForm'

interface ClientDocumentFormModalProps {
  open: boolean
  record?: ClientDocumentMaster | null
  onClose: () => void
  onSaved: () => void
}

export function ClientDocumentFormModal({
  open,
  record,
  onClose,
  onSaved,
}: ClientDocumentFormModalProps) {
  const { showToast } = useToast()
  const { formData, setFormData, errors, validate, reset } = useClientDocumentForm()
  const [loading, setLoading] = useState(false)
  const isEdit = Boolean(record)

  useEffect(() => {
    if (open) {
      reset(record ? clientDocumentToFormData(record) : INITIAL_CLIENT_DOCUMENT_FORM)
    }
  }, [open, record, reset])

  const handleClose = () => {
    if (loading) return
    onClose()
  }

  const handleSubmit = () => {
    if (!validate()) return
    setLoading(true)
    if (isEdit && record) {
      clientDocumentMasterService.update(record.id, formData)
      showToast({ title: 'Client document updated', variant: 'success' })
    } else {
      clientDocumentMasterService.create(formData)
      showToast({ title: 'Client document added', variant: 'success' })
    }
    setLoading(false)
    onSaved()
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={isEdit ? 'Edit client document' : 'Add client document'}
      subtitle="Document types required from corporate, marine, and B2B clients"
      size={ADMIN_MODAL_FORM_LAYOUT.recommendedSize}
      footer={
        <AdminFullPageFormFooter loading={loading} onCancel={handleClose} onSave={handleSubmit} />
      }
    >
      <FormSection columns={ADMIN_MODAL_FORM_LAYOUT.fieldColumns}>
        <FormField
          label="Document type"
          required
          error={Boolean(errors.documentType)}
          helperText={errors.documentType}
        >
          <Input
            value={formData.documentType}
            onChange={(value) => setFormData({ ...formData, documentType: value })}
            placeholder="e.g. Company Registration Certificate"
            size="sm"
            fullWidth
          />
        </FormField>
        <FormField label="Status" required>
          <Select
            value={formData.status}
            onChange={(value) =>
              setFormData({ ...formData, status: value as typeof formData.status })
            }
            placeholder="Select status"
            options={(
              Object.entries(masterStatusLabel) as [typeof formData.status, string][]
            ).map(([value, label]) => ({ value, label }))}
            size="sm"
            fullWidth
          />
        </FormField>
        <AdminFullPageFormFieldSpan>
          <FormField
            label="Applicable for"
            required
            error={Boolean(errors.applicableFor)}
            helperText={errors.applicableFor}
          >
            <MultiSelect
              value={formData.applicableFor}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  applicableFor: value as typeof formData.applicableFor,
                })
              }
              placeholder="Select applicability"
              options={MASTER_APPLICABILITY_OPTIONS}
              searchable
              size="sm"
              fullWidth
            />
          </FormField>
        </AdminFullPageFormFieldSpan>
        <AdminFullPageFormFieldSpan>
          <FormField label="Description">
            <Textarea
              value={formData.description}
              onChange={(value) => setFormData({ ...formData, description: value })}
              placeholder="Explain when this document is required from the client"
              rows={3}
              fullWidth
            />
          </FormField>
        </AdminFullPageFormFieldSpan>
      </FormSection>
    </Modal>
  )
}

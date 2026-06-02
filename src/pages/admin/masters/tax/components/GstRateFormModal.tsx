import { useEffect, useState } from 'react'
import { FormField, FormSection, Input, Modal, Select, Textarea, useToast } from '@/design-system/UIComponents'
import { AdminFullPageFormFooter } from '@/pages/admin/components/AdminFullPageFormFooter'
import { AdminFullPageFormFieldSpan } from '@/pages/admin/components/AdminFullPageFormShell'
import { ADMIN_MODAL_FORM_LAYOUT } from '@/pages/admin/components/adminOverlayFormLayout'
import { taxMasterService } from '@/shared/services/taxMasterService'
import type { GstRate } from '@/shared/types/taxMaster'
import { masterStatusLabel } from '../../config/masterStatusConfig'
import {
  gstRateToFormData,
  INITIAL_GST_RATE_FORM,
  useGstRateForm,
} from '../hooks/useGstRateForm'

interface GstRateFormModalProps {
  open: boolean
  record?: GstRate | null
  onClose: () => void
  onSaved: () => void
}

export function GstRateFormModal({ open, record, onClose, onSaved }: GstRateFormModalProps) {
  const { showToast } = useToast()
  const { formData, setFormData, errors, validate, reset } = useGstRateForm()
  const [loading, setLoading] = useState(false)
  const isEdit = Boolean(record)

  useEffect(() => {
    if (open) {
      reset(record ? gstRateToFormData(record) : INITIAL_GST_RATE_FORM)
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
      taxMasterService.updateGst(record.id, formData)
      showToast({ title: 'GST rate updated', variant: 'success' })
    } else {
      taxMasterService.createGst(formData)
      showToast({ title: 'GST rate added', variant: 'success' })
    }
    setLoading(false)
    onSaved()
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={isEdit ? 'Edit GST rate' : 'Add GST rate'}
      subtitle="GST slabs used across invoicing and tax mapping"
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
        <FormField
          label="GST slab name"
          required
          error={Boolean(errors.slabName)}
          helperText={errors.slabName}
        >
          <Input
            value={formData.slabName}
            onChange={(value) => setFormData({ ...formData, slabName: value })}
            placeholder="Enter GST slab name"
            size="sm"
            fullWidth
          />
        </FormField>
        <FormField
          label="GST percentage"
          required
          error={Boolean(errors.ratePercent)}
          helperText={errors.ratePercent}
        >
          <Input
            value={formData.ratePercent}
            onChange={(value) => setFormData({ ...formData, ratePercent: value })}
            placeholder="Enter GST percentage"
            size="sm"
            fullWidth
          />
        </FormField>
        <AdminFullPageFormFieldSpan>
          <FormField label="Description">
            <Textarea
            value={formData.description}
            onChange={(value) => setFormData({ ...formData, description: value })}
            placeholder="Enter GST description"
            rows={3}
            fullWidth
            />
          </FormField>
        </AdminFullPageFormFieldSpan>
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
      </FormSection>
    </Modal>
  )
}

import { useEffect, useState } from 'react'
import { FormField, FormSection, Input, Modal, Select, Textarea, useToast } from '@/design-system/UIComponents'
import { AdminFullPageFormFooter } from '@/pages/admin/components/AdminFullPageFormFooter'
import { ADMIN_MODAL_FORM_LAYOUT } from '@/pages/admin/components/adminOverlayFormLayout'
import { AdminFullPageFormFieldSpan } from '@/pages/admin/components/AdminFullPageFormShell'
import { taxMasterService, TDS_APPLICABLE_ON_OPTIONS } from '@/shared/services/taxMasterService'
import type { TdsSection } from '@/shared/types/taxMaster'
import { masterStatusLabel } from '../../config/masterStatusConfig'
import {
  INITIAL_TDS_SECTION_FORM,
  tdsSectionToFormData,
  useTdsSectionForm,
} from '../hooks/useTdsSectionForm'

interface TdsSectionFormModalProps {
  open: boolean
  record?: TdsSection | null
  onClose: () => void
  onSaved: () => void
}

export function TdsSectionFormModal({ open, record, onClose, onSaved }: TdsSectionFormModalProps) {
  const { showToast } = useToast()
  const { formData, setFormData, errors, validate, reset } = useTdsSectionForm()
  const [loading, setLoading] = useState(false)
  const isEdit = Boolean(record)

  useEffect(() => {
    if (open) {
      reset(record ? tdsSectionToFormData(record) : INITIAL_TDS_SECTION_FORM)
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
      taxMasterService.updateTds(record.id, formData)
      showToast({ title: 'TDS section updated', variant: 'success' })
    } else {
      taxMasterService.createTds(formData)
      showToast({ title: 'TDS section added', variant: 'success' })
    }
    setLoading(false)
    onSaved()
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={isEdit ? 'Edit TDS section' : 'Add TDS section'}
      subtitle="TDS sections for invoicing and vendor payments"
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
          label="TDS section code"
          required
          error={Boolean(errors.sectionCode)}
          helperText={errors.sectionCode}
        >
          <Input
            value={formData.sectionCode}
            onChange={(value) => setFormData({ ...formData, sectionCode: value })}
            placeholder="Enter TDS section code"
            size="sm"
            fullWidth
          />
        </FormField>
        <FormField
          label="TDS percentage"
          required
          error={Boolean(errors.ratePercent)}
          helperText={errors.ratePercent}
        >
          <Input
            value={formData.ratePercent}
            onChange={(value) => setFormData({ ...formData, ratePercent: value })}
            placeholder="Enter TDS percentage"
            size="sm"
            fullWidth
          />
        </FormField>
        <FormField label="Applicable on" required>
          <Select
            value={formData.applicableOn}
            onChange={(value) =>
              setFormData({ ...formData, applicableOn: value as typeof formData.applicableOn })
            }
            placeholder="Select applicability"
            options={TDS_APPLICABLE_ON_OPTIONS}
            size="sm"
            fullWidth
          />
        </FormField>
        <FormField
          label="Threshold limit"
          error={Boolean(errors.thresholdLimit)}
          helperText={errors.thresholdLimit}
        >
          <Input
            value={formData.thresholdLimit}
            onChange={(value) => setFormData({ ...formData, thresholdLimit: value })}
            placeholder="Enter threshold limit"
            size="sm"
            fullWidth
          />
        </FormField>
        <AdminFullPageFormFieldSpan>
          <FormField label="Description">
            <Textarea
              value={formData.description}
              onChange={(value) => setFormData({ ...formData, description: value })}
              placeholder="Enter TDS description"
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

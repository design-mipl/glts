import { useEffect, useState } from 'react'
import { FormSection, Modal, useToast } from '@/design-system/UIComponents'
import { AdminFullPageFormFooter } from '@/pages/admin/components/AdminFullPageFormFooter'
import { ADMIN_MODAL_FORM_LAYOUT } from '@/pages/admin/components/adminOverlayFormLayout'
import { countryGroupMasterService } from '@/shared/services/countryGroupMasterService'
import type { CountryGroupMaster } from '@/shared/types/countryGroupMaster'
import {
  INITIAL_COUNTRY_GROUP_FORM,
  countryGroupToFormData,
  useCountryGroupForm,
} from '../hooks/useCountryGroupForm'
import { CountryGroupFormFields } from './CountryGroupFormFields'

interface CountryGroupFormModalProps {
  open: boolean
  record?: CountryGroupMaster | null
  onClose: () => void
  onSaved: () => void
}

export function CountryGroupFormModal({
  open,
  record,
  onClose,
  onSaved,
}: CountryGroupFormModalProps) {
  const { showToast } = useToast()
  const { formData, setFormData, errors, validate, reset } = useCountryGroupForm()
  const [loading, setLoading] = useState(false)
  const isEdit = Boolean(record)

  useEffect(() => {
    if (open) {
      reset(record ? countryGroupToFormData(record) : INITIAL_COUNTRY_GROUP_FORM)
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
        ? countryGroupMasterService.update(record.id, formData)
        : countryGroupMasterService.create(formData)
    setLoading(false)
    if (result && 'error' in result && result.error === 'duplicate_name') {
      showToast({
        title: 'Duplicate group name',
        description: 'A country group with this name already exists.',
        variant: 'error',
      })
      return
    }
    showToast({
      title: isEdit ? 'Country group updated' : 'Country group added',
      variant: 'success',
    })
    onSaved()
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={isEdit ? 'Edit country group' : 'Add country group'}
      subtitle="Name a group and map existing countries for quotation visa pricing."
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
        <CountryGroupFormFields formData={formData} onChange={setFormData} errors={errors} />
      </FormSection>
    </Modal>
  )
}

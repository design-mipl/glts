import { useEffect, useState } from 'react'
import { FormField, FormSection, Input, Modal, Select, useToast } from '@/design-system/UIComponents'
import { AdminFullPageFormFooter } from '@/pages/admin/components/AdminFullPageFormFooter'
import { ADMIN_MODAL_FORM_LAYOUT } from '@/pages/admin/components/adminOverlayFormLayout'
import { countryMasterAdminService } from '@/shared/services/countryMasterAdminService'
import type { CountryMasterStatus, ProcessingType } from '@/shared/types/countryMaster'
import {
  COUNTRY_STATUS_OPTIONS,
  PROCESSING_TYPE_OPTIONS,
} from '../../../config/countryProcessingConfig'

interface AddCountryModalProps {
  open: boolean
  onClose: () => void
  onCreated: (countryId: string) => void
}

export function AddCountryModal({ open, onClose, onCreated }: AddCountryModalProps) {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [region, setRegion] = useState('')
  const [processingType, setProcessingType] = useState<ProcessingType>('embassy')
  const [status, setStatus] = useState<CountryMasterStatus>('draft')

  useEffect(() => {
    if (open) {
      setName('')
      setCode('')
      setRegion('')
      setProcessingType('embassy')
      setStatus('draft')
    }
  }, [open])

  const handleClose = () => {
    if (loading) return
    onClose()
  }

  const handleSubmit = () => {
    if (!name.trim() || !code.trim() || !region.trim()) {
      showToast({
        title: 'Missing required fields',
        description: 'Country name, code, and region are required.',
        variant: 'error',
      })
      return
    }
    if (countryMasterAdminService.isCodeTaken(code)) {
      showToast({
        title: 'Duplicate country code',
        description: 'A country with this code already exists.',
        variant: 'error',
      })
      return
    }
    setLoading(true)
    const formData = countryMasterAdminService.createEmptyCountryFormData(
      name.trim(),
      code.trim().toUpperCase(),
      region.trim(),
    )
    const record = countryMasterAdminService.create({
      ...formData,
      processingType,
      status,
    })
    setLoading(false)
    showToast({ title: 'Country created', description: 'Opening configuration workspace.', variant: 'success' })
    onCreated(record.id)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Add country"
      subtitle="Create a new country configuration workspace"
      size={ADMIN_MODAL_FORM_LAYOUT.recommendedSize}
      footer={
        <AdminFullPageFormFooter loading={loading} onCancel={handleClose} onSave={handleSubmit} saveLabel="Create" />
      }
    >
      <FormSection title="Basic information" columns={ADMIN_MODAL_FORM_LAYOUT.fieldColumns}>
        <FormField label="Country Name" required>
          <Input value={name} onChange={setName} placeholder="e.g. China" size="sm" />
        </FormField>
        <FormField label="Country Code" required>
          <Input value={code} onChange={setCode} placeholder="e.g. CN" size="sm" />
        </FormField>
        <FormField label="Region" required>
          <Input value={region} onChange={setRegion} placeholder="e.g. Asia" size="sm" />
        </FormField>
        <FormField label="Processing Type">
          <Select
            value={processingType}
            onChange={(v) => setProcessingType(v as ProcessingType)}
            options={PROCESSING_TYPE_OPTIONS}
            size="sm"
          />
        </FormField>
        <FormField label="Status">
          <Select
            value={status}
            onChange={(v) => setStatus(v as CountryMasterStatus)}
            options={COUNTRY_STATUS_OPTIONS}
            size="sm"
          />
        </FormField>
      </FormSection>
    </Modal>
  )
}

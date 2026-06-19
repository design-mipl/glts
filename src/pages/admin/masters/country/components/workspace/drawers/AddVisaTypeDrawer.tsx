import { useEffect, useState } from 'react'
import { FormField, FormSection, Input, Modal, Select, Toggle, useToast } from '@/design-system/UIComponents'
import { AdminFullPageFormFooter } from '@/pages/admin/components/AdminFullPageFormFooter'
import { ADMIN_MODAL_FORM_LAYOUT } from '@/pages/admin/components/adminOverlayFormLayout'
import { countryMasterAdminService } from '@/shared/services/countryMasterAdminService'
import type { BusinessSegment, VisaMode, VisaTypeStatus } from '@/shared/types/countryMaster'
import {
  DEFAULT_VISA_MODE,
  VISA_CATEGORY_SELECT_OPTIONS,
  VISA_MODE_SELECT_OPTIONS,
} from '../../../config/countryProcessingConfig'

interface AddVisaTypeDrawerProps {
  open: boolean
  countryId: string
  segment: BusinessSegment | null
  onClose: () => void
  onSaved: (visaTypeId: string) => void
}

export function AddVisaTypeDrawer({
  open,
  countryId,
  segment,
  onClose,
  onSaved,
}: AddVisaTypeDrawerProps) {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [visaCategory, setVisaCategory] = useState('Tourism')
  const [visaMode, setVisaMode] = useState<VisaMode>(DEFAULT_VISA_MODE)
  const [purposeLabel, setPurposeLabel] = useState('')
  const [entryType, setEntryType] = useState('')
  const [stayDuration, setStayDuration] = useState('')
  const [validity, setValidity] = useState('')
  const [processingTime, setProcessingTime] = useState('')
  const [status, setStatus] = useState<VisaTypeStatus>('active')
  const [jurisdictionEnabled, setJurisdictionEnabled] = useState(false)

  useEffect(() => {
    if (open) {
      setName('')
      setVisaCategory('Tourism')
      setVisaMode(DEFAULT_VISA_MODE)
      setPurposeLabel('')
      setEntryType('Single entry')
      setStayDuration('30 days')
      setValidity('30 days')
      setProcessingTime('7–14 business days')
      setStatus('active')
      setJurisdictionEnabled(false)
    }
  }, [open])

  const handleClose = () => {
    if (loading) return
    onClose()
  }

  const handleSave = () => {
    if (!segment || !name.trim()) {
      showToast({ title: 'Visa type name is required', variant: 'error' })
      return
    }

    setLoading(true)
    const before = countryMasterAdminService.getById(countryId)
    countryMasterAdminService.addVisaType(countryId, segment, {
      name: name.trim(),
      visaCategory,
      visaMode,
      purposeLabel: purposeLabel || visaCategory,
      purposeId: visaCategory.toLowerCase().replace(/\s+/g, '_'),
      entryType,
      stayDuration,
      validity,
      processingTime,
      status,
      jurisdictionEnabled,
    })

    const after = countryMasterAdminService.getById(countryId)
    const seg = after?.segments.find((s) => s.segment === segment)
    const newVt = seg?.visaTypes.find(
      (v) => !before?.segments.find((s) => s.segment === segment)?.visaTypes.some((old) => old.id === v.id),
    )

    setLoading(false)
    showToast({ title: 'Visa type added', variant: 'success' })
    onSaved(newVt?.id ?? `${segment}/${name}`)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Add Visa Type"
      subtitle="Configure a new visa type for this segment"
      size="lg"
      footer={
        <AdminFullPageFormFooter loading={loading} onCancel={handleClose} onSave={handleSave} saveLabel="Add" />
      }
    >
      <FormSection title="Visa type details" columns={ADMIN_MODAL_FORM_LAYOUT.fieldColumns}>
        <FormField label="Visa Type Name" required>
          <Input value={name} onChange={setName} size="sm" />
        </FormField>
        <FormField label="Visa Category">
          <Select
            value={visaCategory}
            onChange={(v) => setVisaCategory(String(v))}
            options={VISA_CATEGORY_SELECT_OPTIONS}
            size="sm"
          />
        </FormField>
        <FormField label="Visa Mode">
          <Select
            value={visaMode}
            onChange={(v) => setVisaMode(v as VisaMode)}
            options={VISA_MODE_SELECT_OPTIONS}
            size="sm"
          />
        </FormField>
        <FormField label="Purpose of Visit">
          <Input value={purposeLabel} onChange={setPurposeLabel} size="sm" />
        </FormField>
        <FormField label="Entry Type">
          <Input value={entryType} onChange={setEntryType} size="sm" />
        </FormField>
        <FormField label="Stay Duration">
          <Input value={stayDuration} onChange={setStayDuration} size="sm" />
        </FormField>
        <FormField label="Validity">
          <Input value={validity} onChange={setValidity} size="sm" />
        </FormField>
        <FormField label="Processing Time">
          <Input value={processingTime} onChange={setProcessingTime} size="sm" />
        </FormField>
        <FormField label="Status">
          <Select
            value={status}
            onChange={(v) => setStatus(v as VisaTypeStatus)}
            options={[
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
            ]}
            size="sm"
          />
        </FormField>
        <FormField label="Jurisdiction">
          <Toggle
            checked={jurisdictionEnabled}
            onChange={setJurisdictionEnabled}
            label={jurisdictionEnabled ? 'Enabled' : 'Disabled'}
          />
        </FormField>
      </FormSection>
    </Modal>
  )
}

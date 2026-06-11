import { useEffect, useState } from 'react'
import { Stack } from '@mui/material'
import {
  FormField,
  FormSection,
  Input,
  Modal,
  MultiSelect,
  Select,
  useToast,
} from '@/design-system/UIComponents'
import { AdminFullPageFormFooter } from '@/pages/admin/components/AdminFullPageFormFooter'
import { ADMIN_MODAL_FORM_LAYOUT } from '@/pages/admin/components/adminOverlayFormLayout'
import { countryMasterAdminService } from '@/shared/services/countryMasterAdminService'
import type { BusinessSegment, VisaTypeStatus } from '@/shared/types/countryMaster'
import { PROCESSING_TIME_SELECT_OPTIONS } from '../../../config/countryProcessingConfig'
import { INDIAN_STATE_SELECT_OPTIONS } from '../../../config/indianStates'

interface AddJurisdictionDrawerProps {
  open: boolean
  countryId: string
  segment: BusinessSegment | null
  visaTypeId: string | null
  onClose: () => void
  onSaved: (jurisdictionId: string) => void
}

export function AddJurisdictionDrawer({
  open,
  countryId,
  segment,
  visaTypeId,
  onClose,
  onSaved,
}: AddJurisdictionDrawerProps) {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [embassyOrVfs, setEmbassyOrVfs] = useState('')
  const [processingTime, setProcessingTime] = useState('10 business days')
  const [status, setStatus] = useState<VisaTypeStatus>('active')
  const [applicableStates, setApplicableStates] = useState<string[]>([])

  useEffect(() => {
    if (open) {
      setName('')
      setEmbassyOrVfs('')
      setProcessingTime('10 business days')
      setStatus('active')
      setApplicableStates([])
    }
  }, [open])

  const handleClose = () => {
    if (loading) return
    onClose()
  }

  const handleSave = () => {
    if (!segment || !visaTypeId || !name.trim()) {
      showToast({ title: 'Jurisdiction name is required', variant: 'error' })
      return
    }
    setLoading(true)
    const before = countryMasterAdminService.getById(countryId)
    countryMasterAdminService.addJurisdiction(countryId, segment, visaTypeId, {
      name: name.trim(),
      embassyOrVfs,
      submissionCenter: '',
      processingTime,
      priorityLevel: 'standard',
      status,
      applicableStates,
    })
    const after = countryMasterAdminService.getById(countryId)
    const vt = after?.segments.find((s) => s.segment === segment)?.visaTypes.find((v) => v.id === visaTypeId)
    const newJur = vt?.jurisdictions?.find(
      (j) => !before?.segments
        .find((s) => s.segment === segment)
        ?.visaTypes.find((v) => v.id === visaTypeId)
        ?.jurisdictions?.some((old) => old.id === j.id),
    )
    setLoading(false)
    showToast({ title: 'Jurisdiction added', variant: 'success' })
    onSaved(newJur?.id ?? name.trim().toLowerCase())
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Add Jurisdiction"
      subtitle="Configure embassy/VFS jurisdiction for this visa type"
      size="lg"
      footer={
        <AdminFullPageFormFooter loading={loading} onCancel={handleClose} onSave={handleSave} saveLabel="Add" />
      }
    >
      <Stack spacing={1}>
        <FormSection title="Jurisdiction details" columns={ADMIN_MODAL_FORM_LAYOUT.fieldColumns} sx={{ mb: 2 }}>
          <FormField label="Jurisdiction Name" required>
            <Input value={name} onChange={setName} size="sm" />
          </FormField>
          <FormField label="Embassy / VFS">
            <Input value={embassyOrVfs} onChange={setEmbassyOrVfs} size="sm" />
          </FormField>
          <FormField label="Processing Time">
            <Select
              value={processingTime}
              onChange={(v) => setProcessingTime(String(v))}
              options={PROCESSING_TIME_SELECT_OPTIONS}
              size="sm"
            />
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
        </FormSection>

        <FormSection
          title="Applicable states"
          description="Select all states where this jurisdiction applies"
          columns={1}
          sx={{ mb: 0 }}
        >
          <FormField label="States">
            <MultiSelect
              value={applicableStates}
              onChange={(value) => setApplicableStates(value as string[])}
              options={INDIAN_STATE_SELECT_OPTIONS}
              placeholder="Search and select states"
              searchable
              size="sm"
              fullWidth
              chipPlacement="below"
            />
          </FormField>
        </FormSection>
      </Stack>
    </Modal>
  )
}

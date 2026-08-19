import { useEffect, useMemo, useState } from 'react'
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
import { jurisdictionMasterService } from '@/shared/services/jurisdictionMasterService'
import type { BusinessSegment, VisaTypeStatus } from '@/shared/types/countryMaster'
import { INDIAN_STATE_SELECT_OPTIONS } from '../../../config/indianStates'
import {
  buildJurisdictionMasterSelectOptions,
  resolveJurisdictionMasterId,
} from '../../../utils/countryReferenceOptions'

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
  const [jurisdictionMasterId, setJurisdictionMasterId] = useState('')
  const [embassyOrVfs, setEmbassyOrVfs] = useState('')
  const [processingTime, setProcessingTime] = useState('10')
  const [status, setStatus] = useState<VisaTypeStatus>('active')
  const [applicableStates, setApplicableStates] = useState<string[]>([])

  const jurisdictionOptions = useMemo(() => {
    if (!open || !segment || !visaTypeId) return []

    const country = countryMasterAdminService.getById(countryId)
    const visaType = country?.segments
      .find((entry) => entry.segment === segment)
      ?.visaTypes.find((entry) => entry.id === visaTypeId)

    const excludeIds = (visaType?.jurisdictions ?? [])
      .map((jurisdiction) => resolveJurisdictionMasterId(jurisdiction))
      .filter(Boolean)

    return buildJurisdictionMasterSelectOptions({ excludeIds })
  }, [open, countryId, segment, visaTypeId])

  useEffect(() => {
    if (open) {
      setJurisdictionMasterId('')
      setEmbassyOrVfs('')
      setProcessingTime('10')
      setStatus('active')
      setApplicableStates([])
    }
  }, [open])

  const handleClose = () => {
    if (loading) return
    onClose()
  }

  const handleSave = () => {
    const master = jurisdictionMasterService.getById(jurisdictionMasterId)
    if (!segment || !visaTypeId || !master) {
      showToast({ title: 'Jurisdiction is required', variant: 'error' })
      return
    }

    setLoading(true)
    const before = countryMasterAdminService.getById(countryId)
    countryMasterAdminService.addJurisdiction(countryId, segment, visaTypeId, {
      name: master.name,
      jurisdictionMasterId: master.id,
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
    onSaved(newJur?.id ?? master.id)
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
        <FormSection
          title="Jurisdiction details"
          columns={ADMIN_MODAL_FORM_LAYOUT.fieldColumns}
          fieldColumnsFrom="sm"
          sx={{ mb: 2 }}
        >
          <FormField label="Jurisdiction Name" required>
            <Select
              value={jurisdictionMasterId}
              onChange={(value) => setJurisdictionMasterId(String(value))}
              options={jurisdictionOptions}
              placeholder="Select jurisdiction"
              searchable
              size="sm"
              fullWidth
            />
          </FormField>
          <FormField label="Embassy / VFS">
            <Input value={embassyOrVfs} onChange={setEmbassyOrVfs} size="sm" fullWidth />
          </FormField>
          <FormField label="Processing Time (days)">
            <Input type="number" value={processingTime} onChange={setProcessingTime} size="sm" fullWidth />
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
              fullWidth
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

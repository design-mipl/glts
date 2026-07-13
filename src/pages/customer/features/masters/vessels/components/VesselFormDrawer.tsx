import { useEffect, useMemo } from 'react'
import { AdminDrawerFormShell } from '@/pages/admin/components/AdminDrawerFormShell'
import { AdminFullPageFormFooter } from '@/pages/admin/components/AdminFullPageFormFooter'
import { ADMIN_DRAWER_FORM_LAYOUT } from '@/pages/admin/components/adminOverlayFormLayout'
import { vesselMasterService } from '@/shared/services/vesselMasterService'
import type { VesselMaster } from '@/shared/types/vesselMaster'
import { VesselFormFields } from './VesselFormFields'
import { useVesselForm, vesselMasterToFormData } from '../hooks/useVesselForm'

export interface VesselFormDrawerProps {
  open: boolean
  onClose: () => void
  initial?: VesselMaster
  onSaved?: (record: VesselMaster) => void
}

export function VesselFormDrawer({ open, onClose, initial, onSaved }: VesselFormDrawerProps) {
  const { formData, errors, update, reset, validate } = useVesselForm(initial?.id)
  const flagOptions = useMemo(() => vesselMasterService.getFlagCountryOptions(), [])

  useEffect(() => {
    if (open) {
      reset(initial ? vesselMasterToFormData(initial) : undefined)
    }
  }, [open, initial, reset])

  const handleSave = () => {
    if (!validate()) return
    const record = initial
      ? vesselMasterService.update(initial.id, formData)
      : vesselMasterService.create(formData)
    if (record) {
      onSaved?.(record)
      onClose()
    }
  }

  const fieldProps = { formData, errors, flagOptions, onUpdate: update }

  return (
    <AdminDrawerFormShell
      open={open}
      onClose={onClose}
      title={initial ? 'Edit vessel' : 'Add vessel'}
      width={ADMIN_DRAWER_FORM_LAYOUT.recommendedWidth}
      footer={
        <AdminFullPageFormFooter
          onCancel={onClose}
          onSave={handleSave}
          saveLabel={initial ? 'Save changes' : 'Create vessel'}
        />
      }
      sections={[
        {
          id: 'primary',
          title: 'Basic vessel details',
          description: 'Vessel identity and registration details',
          columns: ADMIN_DRAWER_FORM_LAYOUT.primarySectionColumns,
          children: <VesselFormFields variant="primary" {...fieldProps} />,
        },
        {
          id: 'secondary',
          title: 'Notes',
          description: 'Optional supplemental information',
          importance: 'secondary',
          columns: ADMIN_DRAWER_FORM_LAYOUT.secondarySectionColumns,
          children: <VesselFormFields variant="secondary" {...fieldProps} />,
        },
      ]}
    />
  )
}

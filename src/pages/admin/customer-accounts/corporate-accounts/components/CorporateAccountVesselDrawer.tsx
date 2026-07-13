import { useEffect, useMemo } from 'react'
import { AdminDrawerFormShell } from '@/pages/admin/components/AdminDrawerFormShell'
import { AdminFullPageFormFooter } from '@/pages/admin/components/AdminFullPageFormFooter'
import { ADMIN_DRAWER_FORM_LAYOUT } from '@/pages/admin/components/adminOverlayFormLayout'
import { VesselFormFields } from '@/pages/customer/features/masters/vessels/components/VesselFormFields'
import { useVesselForm, vesselMasterToFormData } from '@/pages/customer/features/masters/vessels/hooks/useVesselForm'
import { vesselMasterService } from '@/shared/services/vesselMasterService'
import type { VesselMaster } from '@/shared/types/vesselMaster'

export interface CorporateAccountVesselDrawerProps {
  open: boolean
  onClose: () => void
  corporateAccountId?: string
  /** @deprecated Linked entity is no longer collected on the vessel form. Kept for call-site compatibility. */
  entityIds?: string[]
  initial?: VesselMaster
  onSaved?: (record: VesselMaster) => void
}

export function CorporateAccountVesselDrawer({
  open,
  onClose,
  corporateAccountId,
  initial,
  onSaved,
}: CorporateAccountVesselDrawerProps) {
  const { formData, errors, update, reset, validate } = useVesselForm(initial?.id)
  const flagOptions = useMemo(() => vesselMasterService.getFlagCountryOptions(), [])

  useEffect(() => {
    if (open) reset(initial ? vesselMasterToFormData(initial) : undefined)
  }, [open, initial, reset])

  const handleSave = () => {
    if (!validate()) return
    const record = initial
      ? vesselMasterService.update(initial.id, formData)
      : vesselMasterService.create(formData, corporateAccountId)
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
      footer={<AdminFullPageFormFooter onCancel={onClose} onSave={handleSave} saveLabel={initial ? 'Save changes' : 'Create vessel'} />}
      sections={[
        {
          id: 'primary',
          title: 'Vessel details',
          columns: ADMIN_DRAWER_FORM_LAYOUT.primarySectionColumns,
          children: <VesselFormFields variant="primary" {...fieldProps} />,
        },
        {
          id: 'secondary',
          title: 'Notes',
          importance: 'secondary',
          columns: ADMIN_DRAWER_FORM_LAYOUT.secondarySectionColumns,
          children: <VesselFormFields variant="secondary" {...fieldProps} />,
        },
      ]}
    />
  )
}

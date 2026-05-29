import { Stack } from '@mui/material'
import { Toggle } from '@/design-system/UIComponents'
import type { CorporateAccountFormData } from '@/shared/types/corporateAccount'

interface CorporateAccountPortalActivationFieldsProps {
  data: CorporateAccountFormData
  onChange: (next: CorporateAccountFormData) => void
}

function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1.5}>
      <Toggle checked={checked} onChange={onChange} />
      <span style={{ fontSize: 13, fontWeight: 600 }}>{label}</span>
    </Stack>
  )
}

export function CorporateAccountPortalActivationFields({ data, onChange }: CorporateAccountPortalActivationFieldsProps) {
  const update = (patch: Partial<CorporateAccountFormData['portalActivation']>) => {
    onChange({ ...data, portalActivation: { ...data.portalActivation, ...patch } })
  }

  return (
    <Stack spacing={2}>
      <ToggleRow label="Login access" checked={data.portalActivation.loginAccess} onChange={(v) => update({ loginAccess: v })} />
      <ToggleRow label="Application creation access" checked={data.portalActivation.applicationCreationAccess} onChange={(v) => update({ applicationCreationAccess: v })} />
      <ToggleRow label="Bulk upload access" checked={data.portalActivation.bulkUploadAccess} onChange={(v) => update({ bulkUploadAccess: v })} />
      <ToggleRow label="Invoice visibility" checked={data.portalActivation.invoiceVisibility} onChange={(v) => update({ invoiceVisibility: v })} />
      <ToggleRow label="Tracking visibility" checked={data.portalActivation.trackingVisibility} onChange={(v) => update({ trackingVisibility: v })} />
    </Stack>
  )
}

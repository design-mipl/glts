import { Stack } from '@mui/material'
import { Toggle } from '@/design-system/UIComponents'
import type { CorporateAccountFormData } from '@/shared/types/corporateAccount'

interface CorporateAccountWorkflowConfigFieldsProps {
  data: CorporateAccountFormData
  onChange: (next: CorporateAccountFormData) => void
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <Stack direction="row" alignItems="center" spacing={1.5}>
      <Toggle checked={checked} onChange={onChange} />
      <span style={{ fontSize: 13, fontWeight: 600 }}>{label}</span>
    </Stack>
  )
}

export function CorporateAccountWorkflowConfigFields({ data, onChange }: CorporateAccountWorkflowConfigFieldsProps) {
  const update = (patch: Partial<CorporateAccountFormData['workflowConfig']>) => {
    onChange({ ...data, workflowConfig: { ...data.workflowConfig, ...patch } })
  }

  return (
    <Stack spacing={2}>
      <ToggleRow label="Marine workflow enabled" checked={data.workflowConfig.marineWorkflowEnabled} onChange={(v) => update({ marineWorkflowEnabled: v })} />
      <ToggleRow label="Bulk upload enabled" checked={data.workflowConfig.bulkUploadEnabled} onChange={(v) => update({ bulkUploadEnabled: v })} />
      <ToggleRow label="Retail workflow enabled" checked={data.workflowConfig.retailWorkflowEnabled} onChange={(v) => update({ retailWorkflowEnabled: v })} />
      <ToggleRow label="Corporate workflow enabled" checked={data.workflowConfig.corporateWorkflowEnabled} onChange={(v) => update({ corporateWorkflowEnabled: v })} />
    </Stack>
  )
}

import { Box, Stack } from '@mui/material'
import { FormField, Select, Textarea } from '@/design-system/UIComponents'
import { Input } from '@/design-system/UIComponents'
import { MASTER_STATUS_FILTER_OPTIONS } from '@/pages/admin/masters/config/masterStatusConfig'
import type { TeamMasterFormData } from '@/shared/types/teamMaster'

interface TeamFormFieldsProps {
  formData: TeamMasterFormData
  onChange: (next: TeamMasterFormData) => void
  errors: Record<string, string>
}

export function TeamFormFields({ formData, onChange, errors }: TeamFormFieldsProps) {
  const update = (patch: Partial<TeamMasterFormData>) => onChange({ ...formData, ...patch })

  const statusOptions = MASTER_STATUS_FILTER_OPTIONS.filter((o) => o.value !== 'all').map(
    (o) => ({ value: o.value, label: o.label }),
  )

  return (
    <Stack spacing={2}>
      <FormField label="Team name" required error={Boolean(errors.name)} helperText={errors.name}>
        <Input
          value={formData.name}
          onChange={(v) => update({ name: v })}
          placeholder="e.g. Operations, Finance & Billing"
          fullWidth
        />
      </FormField>
      <FormField label="Description" optional>
        <Textarea
          value={formData.description}
          onChange={(v) => update({ description: v })}
          placeholder="Brief description of team responsibilities"
          rows={3}
          fullWidth
        />
      </FormField>
      <Box sx={{ maxWidth: 240 }}>
        <FormField label="Status" required error={Boolean(errors.status)} helperText={errors.status}>
          <Select
            value={formData.status}
            onChange={(v) => update({ status: String(v) as TeamMasterFormData['status'] })}
            options={statusOptions}
            placeholder="Select status"
            fullWidth
          />
        </FormField>
      </Box>
    </Stack>
  )
}

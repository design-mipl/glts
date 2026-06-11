import { Grid } from '@mui/material'
import { FormField, Input, Select } from '@/design-system/UIComponents'
import { MASTER_STATUS_FILTER_OPTIONS } from '@/pages/admin/masters/config/masterStatusConfig'
import { ADMIN_ROLE_TEMPLATES } from '@/shared/config/adminRoleTemplates'
import { teamService } from '@/shared/services/teamService'
import type { AdminPortalUserBasicFormData } from '@/shared/types/adminPortalUser'

interface UserFormFieldsProps {
  formData: AdminPortalUserBasicFormData
  onChange: (next: AdminPortalUserBasicFormData) => void
  errors: Record<string, string>
}

export function UserFormFields({
  formData,
  onChange,
  errors,
}: UserFormFieldsProps) {
  const update = (patch: Partial<AdminPortalUserBasicFormData>) => onChange({ ...formData, ...patch })

  const statusOptions = MASTER_STATUS_FILTER_OPTIONS.filter((o) => o.value !== 'all').map(
    (o) => ({ value: o.value, label: o.label }),
  )

  const teamOptions = teamService.listActiveOptions()
  const roleTemplateOptions = [
    { value: '', label: 'No template' },
    ...ADMIN_ROLE_TEMPLATES.map((t) => ({ value: t.id, label: t.label })),
  ]

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormField label="Full name" required error={Boolean(errors.fullName)} helperText={errors.fullName}>
          <Input
            value={formData.fullName}
            onChange={(v) => update({ fullName: v })}
            placeholder="Enter full name"
            fullWidth
          />
        </FormField>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormField label="Email" required error={Boolean(errors.email)} helperText={errors.email}>
          <Input
            value={formData.email}
            onChange={(v) => update({ email: v })}
            placeholder="name@company.com"
            fullWidth
          />
        </FormField>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormField label="Phone number" optional>
          <Input
            value={formData.phone}
            onChange={(v) => update({ phone: v })}
            placeholder="+91 98765 43210"
            fullWidth
          />
        </FormField>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormField label="Employee ID" optional>
          <Input
            value={formData.employeeId}
            onChange={(v) => update({ employeeId: v })}
            placeholder="e.g. GLTS-014"
            fullWidth
          />
        </FormField>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormField label="Team" required error={Boolean(errors.teamId)} helperText={errors.teamId}>
          <Select
            value={formData.teamId}
            onChange={(v) => update({ teamId: String(v) })}
            options={teamOptions}
            placeholder="Select team"
            fullWidth
          />
        </FormField>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormField label="Designation" required error={Boolean(errors.designation)} helperText={errors.designation}>
          <Input
            value={formData.designation}
            onChange={(v) => update({ designation: v })}
            placeholder="e.g. Operations Manager"
            fullWidth
          />
        </FormField>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormField label="Role template" optional helperText="Display template only — access depends on permissions below">
          <Select
            value={formData.roleTemplateId}
            onChange={(v) => update({ roleTemplateId: String(v) })}
            options={roleTemplateOptions}
            placeholder="Select optional role template"
            fullWidth
          />
        </FormField>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormField label="Status" required>
          <Select
            value={formData.status}
            onChange={(v) => update({ status: String(v) as AdminPortalUserBasicFormData['status'] })}
            options={statusOptions}
            placeholder="Select status"
            fullWidth
          />
        </FormField>
      </Grid>
    </Grid>
  )
}

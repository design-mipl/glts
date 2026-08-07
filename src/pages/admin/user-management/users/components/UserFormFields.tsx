import { Divider } from '@mui/material'
import { FormField, Input, Select } from '@/design-system/UIComponents'
import { AdminFullPageFormFieldSpan } from '@/pages/admin/components/AdminFullPageFormShell'
import { MASTER_STATUS_FILTER_OPTIONS } from '@/pages/admin/masters/config/masterStatusConfig'
import { departmentService } from '@/shared/services/departmentService'
import { teamService } from '@/shared/services/teamService'
import {
  ADMIN_PORTAL_USER_TYPE_OPTIONS,
  type AdminPortalUserBasicFormData,
  type AdminPortalUserType,
} from '@/shared/types/adminPortalUser'

interface UserFormFieldsProps {
  formData: AdminPortalUserBasicFormData
  onChange: (next: AdminPortalUserBasicFormData) => void
  errors: Record<string, string>
}

/** Bare fields for AdminOverlayFormSection / AdminFullPageFormShell grids. */
export function UserFormFields({ formData, onChange, errors }: UserFormFieldsProps) {
  const update = (patch: Partial<AdminPortalUserBasicFormData>) => onChange({ ...formData, ...patch })

  const statusOptions = MASTER_STATUS_FILTER_OPTIONS.filter((o) => o.value !== 'all').map(
    (o) => ({ value: o.value, label: o.label }),
  )

  const departmentOptions = departmentService.listActiveOptions()
  const teamOptions = teamService.listActiveOptions()

  return (
    <>
      <FormField label="Full name" required error={Boolean(errors.fullName)} helperText={errors.fullName}>
        <Input
          value={formData.fullName}
          onChange={(v) => update({ fullName: v })}
          placeholder="Enter full name"
          fullWidth
        />
      </FormField>
      <FormField
        label="User type"
        required
        error={Boolean(errors.userType)}
        helperText={errors.userType}
      >
        <Select
          value={formData.userType}
          onChange={(v) => update({ userType: String(v) as AdminPortalUserType })}
          options={ADMIN_PORTAL_USER_TYPE_OPTIONS}
          placeholder="Select user type"
          fullWidth
        />
      </FormField>
      <FormField label="Phone number" required error={Boolean(errors.phone)} helperText={errors.phone}>
        <Input
          value={formData.phone}
          onChange={(v) => update({ phone: v })}
          placeholder="+91 98765 43210"
          fullWidth
        />
      </FormField>
      <FormField label="Email" optional error={Boolean(errors.email)} helperText={errors.email}>
        <Input
          value={formData.email}
          onChange={(v) => update({ email: v })}
          placeholder="name@company.com"
          fullWidth
        />
      </FormField>
      <FormField label="Employee ID" optional>
        <Input
          value={formData.employeeId}
          onChange={(v) => update({ employeeId: v })}
          placeholder="e.g. GLTS-014"
          fullWidth
        />
      </FormField>

      <AdminFullPageFormFieldSpan>
        <Divider />
      </AdminFullPageFormFieldSpan>

      <FormField
        label="Department"
        required
        error={Boolean(errors.departmentId)}
        helperText={errors.departmentId}
      >
        <Select
          value={formData.departmentId}
          onChange={(v) => update({ departmentId: String(v) })}
          options={departmentOptions}
          placeholder="Select department"
          fullWidth
        />
      </FormField>
      <FormField label="Team" required error={Boolean(errors.teamId)} helperText={errors.teamId}>
        <Select
          value={formData.teamId}
          onChange={(v) => update({ teamId: String(v) })}
          options={teamOptions}
          placeholder="Select team"
          fullWidth
        />
      </FormField>
      <FormField
        label="Designation"
        required
        error={Boolean(errors.designation)}
        helperText={errors.designation}
      >
        <Input
          value={formData.designation}
          onChange={(v) => update({ designation: v })}
          placeholder="e.g. Operations Manager"
          fullWidth
        />
      </FormField>

      <AdminFullPageFormFieldSpan>
        <Divider />
      </AdminFullPageFormFieldSpan>

      <FormField label="Status" required>
        <Select
          value={formData.status}
          onChange={(v) => update({ status: String(v) as AdminPortalUserBasicFormData['status'] })}
          options={statusOptions}
          placeholder="Select status"
          fullWidth
        />
      </FormField>
    </>
  )
}

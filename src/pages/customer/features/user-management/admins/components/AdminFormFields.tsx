import { FormField, Input, Select, Textarea, Toggle } from '@/design-system/UIComponents'
import { AdminFullPageFormFieldSpan } from '@/pages/admin/components/AdminFullPageFormShell'
import type { AdminUserFormData } from '@/shared/types/adminUser'
import { ADMIN_LOCATIONS } from '@/shared/data/mockAdminUsers'

interface AdminFormFieldsProps {
  variant: 'primary' | 'access' | 'notes'
  formData: AdminUserFormData
  errors: Record<string, string>
  onUpdate: (patch: Partial<AdminUserFormData>) => void
}

export function AdminFormFields({ variant, formData, errors, onUpdate }: AdminFormFieldsProps) {
  if (variant === 'notes') {
    return (
      <AdminFullPageFormFieldSpan>
        <FormField label="Notes / remarks" optional>
          <Textarea
            value={formData.notes}
            onChange={v => onUpdate({ notes: v })}
            placeholder="Optional notes"
            minRows={3}
            fullWidth
          />
        </FormField>
      </AdminFullPageFormFieldSpan>
    )
  }

  if (variant === 'access') {
    return (
      <>
        <FormField label="Role">
          <Input value="Admin" disabled fullWidth />
        </FormField>
        <FormField label="Status" required error={!!errors.status} helperText={errors.status}>
          <Select
            value={formData.status}
            onChange={v => onUpdate({ status: v as AdminUserFormData['status'] })}
            options={[
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
            ]}
            fullWidth
          />
        </FormField>
        <AdminFullPageFormFieldSpan>
          <Toggle
            checked={formData.sendInviteEmail}
            onChange={v => onUpdate({ sendInviteEmail: v })}
            label="Send invite email"
            description={formData.sendInviteEmail ? 'Invite email will be sent on save' : 'No invite email will be sent'}
          />
        </AdminFullPageFormFieldSpan>
      </>
    )
  }

  return (
    <>
      <FormField label="Admin name" required error={!!errors.fullName} helperText={errors.fullName}>
        <Input
          value={formData.fullName}
          onChange={v => onUpdate({ fullName: v })}
          placeholder="Enter admin name"
          fullWidth
        />
      </FormField>
      <FormField label="Email ID" required error={!!errors.email} helperText={errors.email}>
        <Input
          value={formData.email}
          onChange={v => onUpdate({ email: v })}
          placeholder="admin@company.com"
          fullWidth
        />
      </FormField>
      <FormField label="Mobile number" error={!!errors.mobile} helperText={errors.mobile}>
        <Input
          value={formData.mobile}
          onChange={v => onUpdate({ mobile: v })}
          placeholder="+91 98765 43210"
          fullWidth
        />
      </FormField>
      <FormField label="Location">
        <Select
          value={formData.location}
          onChange={v => onUpdate({ location: String(v) })}
          options={[
            { value: '', label: 'Select location' },
            ...ADMIN_LOCATIONS.map(loc => ({ value: loc, label: loc })),
          ]}
          fullWidth
        />
      </FormField>
      <FormField label="Designation">
        <Input
          value={formData.designation}
          onChange={v => onUpdate({ designation: v })}
          placeholder="e.g. Operations Manager"
          fullWidth
        />
      </FormField>
      <FormField label="Department">
        <Input
          value={formData.department}
          onChange={v => onUpdate({ department: v })}
          placeholder="e.g. Operations"
          fullWidth
        />
      </FormField>
    </>
  )
}

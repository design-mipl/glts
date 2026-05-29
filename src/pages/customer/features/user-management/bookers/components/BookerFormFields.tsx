import { FormField, Input, Select, Textarea, Toggle } from '@/design-system/UIComponents'
import { AdminFullPageFormFieldSpan } from '@/pages/admin/components/AdminFullPageFormShell'
import type { BookerUserFormData } from '@/shared/types/bookerUser'
import { BOOKER_LOCATIONS } from '@/shared/data/mockBookerUsers'

interface BookerFormFieldsProps {
  variant: 'primary' | 'access' | 'notes'
  formData: BookerUserFormData
  errors: Record<string, string>
  onUpdate: (patch: Partial<BookerUserFormData>) => void
}

export function BookerFormFields({ variant, formData, errors, onUpdate }: BookerFormFieldsProps) {
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
          <Input value="Booker" disabled fullWidth />
        </FormField>
        <FormField label="Status" required error={!!errors.status} helperText={errors.status}>
          <Select
            value={formData.status}
            onChange={v => onUpdate({ status: v as BookerUserFormData['status'] })}
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
      <FormField label="Booker name" required error={!!errors.fullName} helperText={errors.fullName}>
        <Input
          value={formData.fullName}
          onChange={v => onUpdate({ fullName: v })}
          placeholder="Enter booker name"
          fullWidth
        />
      </FormField>
      <FormField label="Email ID" required error={!!errors.email} helperText={errors.email}>
        <Input
          value={formData.email}
          onChange={v => onUpdate({ email: v })}
          placeholder="booker@company.com"
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
            ...BOOKER_LOCATIONS.map(loc => ({ value: loc, label: loc })),
          ]}
          fullWidth
        />
      </FormField>
      <FormField label="Designation">
        <Input
          value={formData.designation}
          onChange={v => onUpdate({ designation: v })}
          placeholder="e.g. Travel Manager"
          fullWidth
        />
      </FormField>
      <FormField label="Department">
        <Input
          value={formData.department}
          onChange={v => onUpdate({ department: v })}
          placeholder="e.g. Travel Desk"
          fullWidth
        />
      </FormField>
    </>
  )
}

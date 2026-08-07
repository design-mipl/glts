import { FormField, Input, Select } from '@/design-system/UIComponents'
import type { AdminPortalUserFormData, PasswordSetupType } from '@/shared/types/adminPortalUser'

interface UserSecurityFieldsProps {
  formData: AdminPortalUserFormData
  onChange: (next: AdminPortalUserFormData) => void
  errors: Record<string, string>
  mode: 'create' | 'edit'
}

const PASSWORD_SETUP_OPTIONS: { value: PasswordSetupType; label: string }[] = [
  { value: 'auto_email_invite', label: 'Auto email invite' },
  { value: 'manual_password', label: 'Manual password' },
]

/** Bare fields for AdminOverlayFormSection / AdminFullPageFormShell grids. */
export function UserSecurityFields({ formData, onChange, errors, mode }: UserSecurityFieldsProps) {
  const update = (patch: Partial<AdminPortalUserFormData>) => onChange({ ...formData, ...patch })

  return (
    <>
      <FormField
        label="Password setup type"
        required
        helperText={
          mode === 'edit'
            ? 'Leave manual password blank to keep the existing password.'
            : formData.passwordSetupType === 'auto_email_invite'
              ? 'An invite email will be sent with setup instructions.'
              : undefined
        }
      >
        <Select
          value={formData.passwordSetupType}
          onChange={(v) =>
            update({
              passwordSetupType: String(v) as PasswordSetupType,
              manualPassword: '',
            })
          }
          options={PASSWORD_SETUP_OPTIONS}
          placeholder="Select password setup type"
          fullWidth
        />
      </FormField>
      {formData.passwordSetupType === 'manual_password' ? (
        <FormField
          label="Password"
          required={mode === 'create'}
          error={Boolean(errors.manualPassword)}
          helperText={errors.manualPassword}
        >
          <Input
            type="password"
            value={formData.manualPassword}
            onChange={(v) => update({ manualPassword: v })}
            placeholder={mode === 'edit' ? 'Enter new password to change' : 'Minimum 8 characters'}
            fullWidth
          />
        </FormField>
      ) : null}
    </>
  )
}

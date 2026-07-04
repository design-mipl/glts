import { useState } from 'react'
import { Stack } from '@mui/material'
import { Eye, EyeOff } from 'lucide-react'
import { Button, FormField, IconButton, Input, useToast } from '@/design-system/UIComponents'
import { AdminFullPageFormFieldSpan } from '@/pages/admin/components/AdminFullPageFormShell'
import { generateTemporaryPassword } from '@/shared/utils/corporateAccountValidation'
import type { CorporateAccountFormData } from '@/shared/types/corporateAccount'

interface CorporateAccountSuperAdminFieldsProps {
  data: CorporateAccountFormData
  onChange: (next: CorporateAccountFormData) => void
  variant?: 'identity' | 'credentials'
}

export function CorporateAccountSuperAdminFields({
  data,
  onChange,
  variant = 'identity',
}: CorporateAccountSuperAdminFieldsProps) {
  const { showToast } = useToast()
  const [showPassword, setShowPassword] = useState(false)

  const update = (patch: Partial<CorporateAccountFormData['superAdmin']>) => {
    onChange({ ...data, superAdmin: { ...data.superAdmin, ...patch } })
  }

  if (variant === 'credentials') {
    const handleGeneratePassword = () => {
      const pwd = generateTemporaryPassword()
      update({ temporaryPassword: pwd })
      setShowPassword(true)
      showToast({ title: 'Temporary password generated', description: pwd, variant: 'info' })
    }

    const handleSendLoginEmail = () => {
      const pwd = data.superAdmin.temporaryPassword?.trim()
      if (!data.superAdmin.emailAddress.trim()) {
        showToast({ title: 'Email required', description: 'Enter the super admin email address first.', variant: 'error' })
        return
      }
      if (!pwd || pwd.length < 8) {
        showToast({
          title: 'Password required',
          description: 'Enter or generate a portal password (minimum 8 characters).',
          variant: 'error',
        })
        return
      }
      showToast({
        title: 'Login email queued',
        description: `Portal URL sent to ${data.superAdmin.emailAddress}.`,
        variant: 'success',
      })
    }

    return (
      <Stack spacing={2}>
        <AdminFullPageFormFieldSpan>
          <FormField
            label="Portal password"
            helperText="Enter a password or generate a temporary one (minimum 8 characters)."
          >
            <Input
              value={data.superAdmin.temporaryPassword ?? ''}
              onChange={(v) => update({ temporaryPassword: v })}
              placeholder="Enter portal password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              endAdornment={
                <IconButton
                  size="sm"
                  variant="default"
                  tooltip={showPassword ? 'Hide password' : 'Show password'}
                  icon={showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  onClick={() => setShowPassword((current) => !current)}
                />
              }
            />
          </FormField>
        </AdminFullPageFormFieldSpan>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} useFlexGap flexWrap="wrap">
          <Button
            label="Generate temporary password"
            size="sm"
            variant="outlined"
            color="secondary"
            onClick={handleGeneratePassword}
          />
          <Button
            label="Send login email"
            size="sm"
            variant="outlined"
            color="secondary"
            onClick={handleSendLoginEmail}
          />
        </Stack>
      </Stack>
    )
  }

  return (
    <>
      <FormField label="Full name" required>
        <Input value={data.superAdmin.fullName} onChange={(v) => update({ fullName: v })} fullWidth />
      </FormField>
      <FormField label="Role">
        <Input value="Super Admin" disabled fullWidth />
      </FormField>
      <FormField label="Phone number">
        <Input value={data.superAdmin.phoneNumber} onChange={(v) => update({ phoneNumber: v })} fullWidth />
      </FormField>
      <AdminFullPageFormFieldSpan>
        <FormField label="Email address" required>
          <Input value={data.superAdmin.emailAddress} onChange={(v) => update({ emailAddress: v })} fullWidth />
        </FormField>
      </AdminFullPageFormFieldSpan>
    </>
  )
}

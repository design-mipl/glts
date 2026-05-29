import { Stack } from '@mui/material'
import { Button, FormField, Input, useToast } from '@/design-system/UIComponents'
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

  const update = (patch: Partial<CorporateAccountFormData['superAdmin']>) => {
    onChange({ ...data, superAdmin: { ...data.superAdmin, ...patch } })
  }

  if (variant === 'credentials') {
    return (
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} useFlexGap flexWrap="wrap">
        <Button
          label="Send login email"
          variant="outlined"
          onClick={() => {
            const pwd = generateTemporaryPassword()
            update({ temporaryPassword: pwd })
            showToast({
              title: 'Login email queued',
              description: `Portal URL sent to ${data.superAdmin.emailAddress || 'super admin'}. Temp password: ${pwd}`,
              variant: 'success',
            })
          }}
        />
        <Button
          label="Generate temporary password"
          variant="outlined"
          onClick={() => {
            const pwd = generateTemporaryPassword()
            update({ temporaryPassword: pwd })
            showToast({ title: 'Temporary password generated', description: pwd, variant: 'info' })
          }}
        />
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

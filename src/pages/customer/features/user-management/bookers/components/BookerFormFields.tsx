import { Box, IconButton, Stack, Typography } from '@mui/material'
import { Plus, Trash2 } from 'lucide-react'
import { Button, FormField, Input, Select, Textarea, Toggle } from '@/design-system/UIComponents'
import { AdminFullPageFormFieldSpan } from '@/pages/admin/components/AdminFullPageFormShell'
import type { BookerUserFormData } from '@/shared/types/bookerUser'

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

  const updateAdditionalEmail = (index: number, value: string) => {
    onUpdate({
      additionalEmails: formData.additionalEmails.map((email, i) => (i === index ? value : email)),
    })
  }

  const removeAdditionalEmail = (index: number) => {
    onUpdate({
      additionalEmails: formData.additionalEmails.filter((_, i) => i !== index),
    })
  }

  const addAdditionalEmail = () => {
    onUpdate({ additionalEmails: [...formData.additionalEmails, ''] })
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
      <AdminFullPageFormFieldSpan>
        <Stack spacing={1}>
          <Typography variant="body2" sx={{ fontWeight: 600, fontSize: 13 }}>
            Additional email IDs
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
            Optional. Login and invite use the primary email ID above.
          </Typography>
          {formData.additionalEmails.map((email, index) => {
            const errorKey = `additionalEmails.${index}`
            const errorMessage = errors[errorKey]
            return (
              <Stack key={index} direction="row" spacing={0.75} alignItems="flex-start">
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Input
                    value={email}
                    onChange={v => updateAdditionalEmail(index, v)}
                    placeholder="additional@company.com"
                    fullWidth
                  />
                  {errorMessage ? (
                    <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5, fontSize: 12 }}>
                      {errorMessage}
                    </Typography>
                  ) : null}
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    height: '34px',
                    flexShrink: 0,
                  }}
                >
                  <IconButton
                    size="small"
                    aria-label="Remove email ID"
                    onClick={() => removeAdditionalEmail(index)}
                    sx={{ p: 0.5 }}
                  >
                    <Trash2 size={14} />
                  </IconButton>
                </Box>
              </Stack>
            )
          })}
          <Button
            label="Add email ID"
            size="sm"
            variant="neutral"
            startIcon={<Plus size={14} />}
            onClick={addAdditionalEmail}
          />
        </Stack>
      </AdminFullPageFormFieldSpan>
    </>
  )
}

import { Stack, Typography } from '@mui/material'
import { Copy } from 'lucide-react'
import { IconButton, useToast } from '@/design-system/UIComponents'
import { AdminOverlayFormSection } from '@/pages/admin/components/AdminOverlayFormSection'
import type { FormAssistField, FormAssistFieldSection } from '../../utils/formAssistFieldBuilder'

interface CopyAssistFieldProps {
  field: FormAssistField
  disabled?: boolean
}

export function CopyAssistField({ field, disabled = false }: CopyAssistFieldProps) {
  const { showToast } = useToast()

  const handleCopy = async () => {
    if (disabled) return
    if (field.value === '—') {
      showToast({ title: 'Nothing to copy', description: 'This field has no value.', variant: 'info' })
      return
    }
    try {
      await navigator.clipboard.writeText(field.value)
      showToast({ title: 'Copied', description: `${field.label} copied to clipboard.`, variant: 'success' })
    } catch {
      showToast({ title: 'Copy failed', description: 'Unable to copy to clipboard.', variant: 'error' })
    }
  }

  return (
    <Stack
      spacing={0.75}
      sx={{
        p: 1.5,
        borderRadius: 1.5,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11, fontWeight: 600 }}>
        {field.label}
      </Typography>
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
        <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13, wordBreak: 'break-word' }}>
          {field.value}
        </Typography>
        <IconButton
          icon={<Copy size={16} />}
          aria-label={`Copy ${field.label}`}
          size="sm"
          disabled={disabled}
          onClick={() => void handleCopy()}
        />
      </Stack>
    </Stack>
  )
}

interface CopyAssistFieldListProps {
  fields: FormAssistField[]
}

export function CopyAssistFieldList({ fields }: CopyAssistFieldListProps) {
  return (
    <Stack spacing={1.25}>
      {fields.map(f => (
        <CopyAssistField key={f.id} field={f} />
      ))}
    </Stack>
  )
}

interface CopyAssistFieldSectionsProps {
  sections: FormAssistFieldSection[]
  disabled?: boolean
}

export function CopyAssistFieldSections({ sections, disabled = false }: CopyAssistFieldSectionsProps) {
  return (
    <Stack spacing={2}>
      {sections.map((section, index) => (
        <AdminOverlayFormSection
          key={section.id}
          title={section.title}
          columns={2}
          importance={index === 0 ? 'primary' : 'secondary'}
        >
          {section.fields.map(field => (
            <CopyAssistField key={`${section.id}-${field.id}`} field={field} disabled={disabled} />
          ))}
        </AdminOverlayFormSection>
      ))}
    </Stack>
  )
}

import { Stack, Typography } from '@mui/material'
import { BaseCard, Button, Textarea } from '@/design-system/UIComponents'

interface InternalNotesTabProps {
  value: string
  onChange: (value: string) => void
  onSave: () => void
}

export function InternalNotesTab({ value, onChange, onSave }: InternalNotesTabProps) {
  return (
    <Stack spacing={1.5}>
      <BaseCard sx={{ p: 2 }}>
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Team Internal Notes</Typography>
          <Textarea value={value} onChange={onChange} minRows={8} fullWidth />
          <Stack direction="row" justifyContent="flex-end">
            <Button label="Save Note" onClick={onSave} />
          </Stack>
        </Stack>
      </BaseCard>
    </Stack>
  )
}

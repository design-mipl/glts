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
          <Typography variant="subtitle2">Team notes</Typography>
          <Typography variant="body2" color="text.secondary">
            Add operational notes for your team. Enquiry remarks from the form are shown on the Overview tab.
          </Typography>
          <Textarea
            value={value}
            onChange={onChange}
            placeholder="Add team-only notes (not shown on the enquiry form)"
            minRows={8}
            fullWidth
          />
          <Stack direction="row" justifyContent="flex-end">
            <Button label="Save Note" onClick={onSave} />
          </Stack>
        </Stack>
      </BaseCard>
    </Stack>
  )
}

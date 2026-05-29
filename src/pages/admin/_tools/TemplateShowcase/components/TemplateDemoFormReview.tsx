import { Box, Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { alpha } from '@mui/material/styles'
import type { TemplateDemoFormData } from '../config/demoEntity'

interface TemplateDemoFormReviewProps {
  data: TemplateDemoFormData
}

export function TemplateDemoFormReview({ data }: TemplateDemoFormReviewProps) {
  const theme = useTheme()

  const rows = [
    { label: 'Reference', value: data.reference },
    { label: 'Name', value: data.name },
    { label: 'Country', value: data.country },
    { label: 'Priority', value: data.priority },
    { label: 'Assignee', value: data.assignee },
    { label: 'Notes', value: data.notes },
  ]

  return (
    <Box
      sx={{
        borderRadius: 2,
        border: 1,
        borderColor: 'divider',
        bgcolor: theme.palette.mode === 'light' ? 'grey.50' : alpha('#fff', 0.04),
        p: 2,
      }}
    >
      <Typography variant="subtitle2" fontWeight={600} color="text.secondary" sx={{ mb: 1.5 }}>
        Review before submit
      </Typography>
      <Stack spacing={1}>
        {rows.map((row) => (
          <Stack key={row.label} direction="row" spacing={2} sx={{ fontSize: 13 }}>
            <Typography component="span" sx={{ fontWeight: 600, minWidth: 100, color: 'text.secondary' }}>
              {row.label}
            </Typography>
            <Typography component="span" color="text.primary">
              {row.value || '—'}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  )
}

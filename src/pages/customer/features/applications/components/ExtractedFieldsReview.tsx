import { Box, Typography, Grid, TextField } from '@mui/material'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import type { ExtractedField } from '../data/applicationFlowData'

interface ExtractedFieldsReviewProps {
  title?: string
  fields: ExtractedField[]
  showValidationBar?: boolean
  compact?: boolean
  onFieldChange?: (key: string, value: string) => void
}

export function ExtractedFieldsReview({
  title = 'Detected fields · review & edit',
  fields,
  compact,
  onFieldChange,
}: ExtractedFieldsReviewProps) {
  const colors = usePublicBrandColors()
  return (
    <Box>
      <Typography sx={{ fontWeight: 700, fontSize: '14px', color: colors.navy, mb: 1.5 }}>{title}</Typography>
      <Grid container spacing={1.5}>
        {fields.map(field => (
          <Grid key={field.key} size={{ xs: 12, sm: compact ? 6 : 4 }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: '10px',
                border: `1px solid ${colors.border}`,
                bgcolor: colors.surface,
              }}
            >
              <Typography
                sx={{
                  fontSize: '10px',
                  fontWeight: 700,
                  color: colors.textMuted,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  mb: 0.5,
                }}
              >
                {field.label}
              </Typography>
              <TextField
                size="small"
                fullWidth
                value={field.value}
                variant="standard"
                onChange={e => onFieldChange?.(field.key, e.target.value)}
                InputProps={{ disableUnderline: true, sx: { fontSize: '14px', fontWeight: 700, color: colors.navy } }}
              />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

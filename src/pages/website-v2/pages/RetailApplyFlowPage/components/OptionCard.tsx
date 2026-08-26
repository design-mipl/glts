import { Box, Stack, Typography } from '@mui/material'
import { BORDER_RADIUS } from '@/design-system/tokens'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'

interface OptionCardProps {
  label: string
  description?: string
  selected: boolean
  onSelect: () => void
  tone?: 'default' | 'critical'
}

export function OptionCard({ label, description, selected, onSelect, tone = 'default' }: OptionCardProps) {
  const colors = usePublicBrandColors()
  const accent = tone === 'critical' ? colors.greenDark : colors.greenBright

  return (
    <Box
      onClick={onSelect}
      sx={{
        border: `1.5px solid ${selected ? accent : colors.border}`,
        backgroundColor: selected ? colors.greenMuted : colors.white,
        borderRadius: BORDER_RADIUS.lg,
        p: 2,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        '&:hover': { borderColor: accent },
      }}
    >
      <Stack direction="row" alignItems="flex-start" spacing={1.5}>
        <Box
          sx={{
            mt: '3px',
            width: 18,
            height: 18,
            flexShrink: 0,
            borderRadius: '50%',
            border: `2px solid ${selected ? accent : colors.border}`,
            backgroundColor: selected ? accent : 'transparent',
          }}
        />
        <Box>
          <Typography sx={{ fontSize: '14px', fontWeight: 600, color: colors.text }}>{label}</Typography>
          {description && (
            <Typography sx={{ fontSize: '13px', color: colors.textSecondary, mt: 0.25 }}>{description}</Typography>
          )}
        </Box>
      </Stack>
    </Box>
  )
}

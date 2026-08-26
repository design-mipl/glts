import { Box, Typography } from '@mui/material'
import { AlertTriangle } from 'lucide-react'
import { BORDER_RADIUS } from '@/design-system/tokens'
import { usePublicBrandColors, getOutlinedButtonSx } from '@/shared/theme/publicBrand'

interface IneligibleScreenProps {
  reason?: string
  onChangeAnswer: () => void
  listingHref: string
}

export function IneligibleScreen({ reason, onChangeAnswer, listingHref }: IneligibleScreenProps) {
  const colors = usePublicBrandColors()

  return (
    <Box
      sx={{
        backgroundColor: colors.white,
        border: `1px solid ${colors.criticalBorder}`,
        borderRadius: BORDER_RADIUS.lg,
        p: { xs: 3, md: 5 },
        textAlign: 'center',
      }}
    >
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          backgroundColor: colors.criticalMuted,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mx: 'auto',
          mb: 2.5,
        }}
      >
        <AlertTriangle size={26} color="#DC2626" />
      </Box>
      <Typography sx={{ fontSize: '20px', fontWeight: 700, color: colors.text, mb: 1 }}>
        This e-Visa isn't the right fit
      </Typography>
      <Typography sx={{ fontSize: '14px', color: colors.textSecondary, maxWidth: 440, mx: 'auto', mb: 3 }}>
        {reason ?? 'Based on your answer, this offering does not cover your travel purpose.'}
      </Typography>
      <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center' }}>
        <Box component="button" onClick={onChangeAnswer} sx={{ ...getOutlinedButtonSx(), border: `1px solid ${colors.border}`, backgroundColor: 'transparent', cursor: 'pointer', px: 2.5, py: 1 }}>
          Change my answer
        </Box>
        <Box
          component="a"
          href={listingHref}
          sx={{
            ...getOutlinedButtonSx(),
            border: `1px solid ${colors.border}`,
            backgroundColor: 'transparent',
            px: 2.5,
            py: 1,
            textDecoration: 'none',
            color: colors.text,
            display: 'inline-flex',
            alignItems: 'center',
          }}
        >
          Browse other destinations
        </Box>
      </Box>
    </Box>
  )
}

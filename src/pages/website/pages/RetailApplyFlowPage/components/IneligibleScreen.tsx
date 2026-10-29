import { Box, Typography, keyframes } from '@mui/material'
import { AlertTriangle } from 'lucide-react'
import { BORDER_RADIUS } from '@/design-system/tokens'
import { usePublicBrandColors, getOutlinedButtonSx } from '@/shared/theme/publicBrand'
import { retailFlowEaseOut } from '@/pages/website/theme/retailFlowTokens'

interface IneligibleScreenProps {
  reason?: string
  onChangeAnswer: () => void
  listingHref: string
}

const popIn = keyframes`
  from { opacity: 0; transform: scale(0.85); }
  to { opacity: 1; transform: scale(1); }
`

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`

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
          animation: `${popIn} 0.36s ${retailFlowEaseOut} both`,
        }}
      >
        <AlertTriangle size={26} color="#DC2626" />
      </Box>
      <Typography
        sx={{
          fontSize: '20px',
          fontWeight: 700,
          color: colors.text,
          mb: 1,
          animation: `${fadeUp} 0.3s ${retailFlowEaseOut} both`,
          animationDelay: '70ms',
        }}
      >
        This e-Visa isn't the right fit
      </Typography>
      <Typography
        sx={{
          fontSize: '14px',
          color: colors.textSecondary,
          maxWidth: 440,
          mx: 'auto',
          mb: 3,
          animation: `${fadeUp} 0.3s ${retailFlowEaseOut} both`,
          animationDelay: '120ms',
        }}
      >
        {reason ?? 'Based on your answer, this offering does not cover your travel purpose.'}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          gap: 1.5,
          justifyContent: 'center',
          animation: `${fadeUp} 0.3s ${retailFlowEaseOut} both`,
          animationDelay: '170ms',
        }}
      >
        <Box
          component="button"
          onClick={onChangeAnswer}
          sx={{
            ...getOutlinedButtonSx(),
            border: `1px solid ${colors.border}`,
            backgroundColor: 'transparent',
            cursor: 'pointer',
            px: 2.5,
            py: 1,
            transition: `transform 160ms ${retailFlowEaseOut}, border-color 150ms ease`,
            '&:active': { transform: 'scale(0.97)' },
          }}
        >
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
            transition: `transform 160ms ${retailFlowEaseOut}, border-color 150ms ease`,
            '&:active': { transform: 'scale(0.97)' },
          }}
        >
          Browse other destinations
        </Box>
      </Box>
    </Box>
  )
}

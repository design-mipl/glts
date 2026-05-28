import { Box, Button } from '@mui/material'
import { useMediaQuery, useTheme } from '@mui/material'
import { ArrowRight } from 'lucide-react'
import { publicFonts, usePublicBrandColors } from '../theme/publicSiteTokens'

export function MobileStickyCta() {
  const colors = usePublicBrandColors()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  if (!isMobile) return null

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1090,
        p: 2,
        pb: 'max(16px, env(safe-area-inset-bottom))',
        background: 'linear-gradient(to top, rgba(255,255,255,0.98) 70%, transparent)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <Button
        variant="contained"
        href="/countries"
        fullWidth
        endIcon={<ArrowRight size={18} />}
        sx={{
          py: 1.75,
          borderRadius: '14px',
          fontWeight: 700,
          fontSize: '16px',
          textTransform: 'none',
          fontFamily: publicFonts.body,
          backgroundColor: colors.greenBright,
          boxShadow: '0 8px 24px rgba(16, 185, 129, 0.35)',
        }}
      >
        Start Application
      </Button>
    </Box>
  )
}

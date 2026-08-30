import { Box, Button, Stack } from '@mui/material'
import { LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { GREENLIGHT_LOGO_DARK_SRC } from '@/components/brand/GreenlightLogo'
import { clearSession } from '@/shared/auth/session'
import { applyFlow } from '@/pages/website/theme/applyFlowTheme'
import { publicFonts } from '@/pages/website/theme/publicSiteTokens'

const HEADER_HEIGHT = 64

/** Minimal account chrome: logo + sign out only (no marketing nav / footer CTAs). */
export function RetailAccountHeader() {
  const navigate = useNavigate()

  const handleSignOut = () => {
    clearSession()
    navigate('/sign-in', { replace: true })
  }

  return (
    <Box
      component="header"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1100,
        height: HEADER_HEIGHT,
        bgcolor: applyFlow.ink,
        borderBottom: `1px solid rgba(255,255,255,0.08)`,
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          height: '100%',
          maxWidth: 1180,
          mx: 'auto',
          px: { xs: 2.5, md: 4 },
        }}
      >
        <Box
          component="a"
          href="/"
          sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
        >
          <Box
            component="img"
            src={GREENLIGHT_LOGO_DARK_SRC}
            alt="Greenlight"
            sx={{ height: 32, width: 'auto', borderRadius: '6px' }}
          />
        </Box>

        <Button
          onClick={handleSignOut}
          startIcon={<LogOut size={16} />}
          sx={{
            color: 'rgba(255,255,255,0.88)',
            textTransform: 'none',
            fontWeight: 600,
            fontSize: 13,
            fontFamily: publicFonts.body,
            borderRadius: '10px',
            px: 1.75,
            '&:hover': {
              color: applyFlow.accent,
              bgcolor: applyFlow.accentSoft,
            },
          }}
        >
          Sign out
        </Button>
      </Stack>
    </Box>
  )
}

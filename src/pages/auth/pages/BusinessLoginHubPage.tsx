import { Box, Typography, Button, Stack } from '@mui/material'
import { ArrowRight, Building2, Ship, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { GREENLIGHT_LOGO_SRC } from '@/components/brand/GreenlightLogo'
import { publicFonts, usePublicBrandColors } from '@/shared/theme/publicBrand'

const SEGMENTS = [
  {
    id: 'marine',
    title: 'Marine',
    subtitle: 'Crew & vessel visas',
    description: 'Crew manifests, vessel masters, and marine visa filing.',
    icon: Ship,
    href: '/sign-in/business/marine',
  },
  {
    id: 'corporate',
    title: 'Corporate',
    subtitle: 'Enterprise travel',
    description: 'Policy-compliant corporate visas, travelers, and bookers.',
    icon: Building2,
    href: '/sign-in/business/corporate',
  },
  {
    id: 'b2b',
    title: 'B2B Agent',
    subtitle: 'Multi-client filing',
    description: 'Client applications, booker management, and bulk uploads.',
    icon: Users,
    href: '/sign-in/business/b2b',
  },
] as const

/** Intermediate hub when visiting /sign-in/business without a segment. */
export function BusinessLoginHubPage() {
  const colors = usePublicBrandColors()
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: colors.surface,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        py: 6,
      }}
    >
      <Button
        onClick={() => navigate('/sign-in/portals')}
        sx={{
          position: 'absolute',
          top: 24,
          left: 24,
          textTransform: 'none',
          color: colors.textSecondary,
          fontWeight: 600,
          fontSize: '13px',
        }}
      >
        ← Back to workspaces
      </Button>

      <Box component="img" src={GREENLIGHT_LOGO_SRC} alt="Greenlight" sx={{ height: 48, mb: 3, borderRadius: '10px' }} />

      <Typography
        sx={{
          fontFamily: publicFonts.heading,
          fontWeight: 800,
          fontSize: { xs: '28px', sm: '34px' },
          color: colors.navy,
          textAlign: 'center',
          mb: 1,
        }}
      >
        Business Portal
      </Typography>
      <Typography
        sx={{
          fontSize: '15px',
          color: colors.textSecondary,
          textAlign: 'center',
          mb: 5,
          maxWidth: 480,
        }}
      >
        Choose your customer type to sign in to the matching portal experience.
      </Typography>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ width: '100%', maxWidth: 960 }}>
        {SEGMENTS.map(segment => {
          const Icon = segment.icon
          return (
            <Box
              key={segment.id}
              sx={{
                flex: 1,
                p: 3,
                borderRadius: '16px',
                border: `1px solid ${colors.border}`,
                bgcolor: colors.white,
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                '&:hover': {
                  borderColor: colors.greenBright,
                  boxShadow: '0 12px 32px rgba(0, 31, 63, 0.1)',
                  transform: 'translateY(-2px)',
                },
              }}
              onClick={() => navigate(segment.href)}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '12px',
                  bgcolor: `${colors.greenBright}18`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                }}
              >
                <Icon size={24} color={colors.greenBright} />
              </Box>
              <Typography sx={{ fontWeight: 800, fontSize: '20px', color: colors.navy, mb: 0.5 }}>
                {segment.title}
              </Typography>
              <Typography sx={{ fontSize: '13px', fontWeight: 600, color: colors.greenBright, mb: 1.5 }}>
                {segment.subtitle}
              </Typography>
              <Typography sx={{ fontSize: '14px', color: colors.textSecondary, lineHeight: 1.6, mb: 2.5 }}>
                {segment.description}
              </Typography>
              <Button
                variant="contained"
                endIcon={<ArrowRight size={16} />}
                onClick={e => {
                  e.stopPropagation()
                  navigate(segment.href)
                }}
                sx={{
                  borderRadius: '10px',
                  bgcolor: colors.navy,
                  textTransform: 'none',
                  fontWeight: 700,
                  '&:hover': { bgcolor: colors.navyLight },
                }}
              >
                Sign in
              </Button>
            </Box>
          )
        })}
      </Stack>
    </Box>
  )
}
